import StudySession from "../models/StudySession.js";

// Add a study session
export const createStudySession = async (req, res) => {
  try {
    const {
      date,
      subject,
      durationMinutes,
      topic,
      tasksCompleted,
      notes
    } = req.body;

    if (!date || !subject || !durationMinutes) {
      return res.status(400).json({
        message: "Date, subject and study duration are required"
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: "Please provide a valid date"
      });
    }

    const duration = Number(durationMinutes);

    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({
        message: "Study duration must be greater than zero"
      });
    }

    const session = await StudySession.create({
      user: req.user.id,
      date,
      subject,
      durationMinutes: duration,
      topic,
      tasksCompleted,
      notes
    });

    res.status(201).json({
      message: "Study session added successfully",
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the logged-in student's study sessions
export const getStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      user: req.user.id
    }).sort({ date: -1, createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a study session
export const updateStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        message: "Study session not found"
      });
    }

    const allowedFields = [
      "date",
      "subject",
      "durationMinutes",
      "topic",
      "tasksCompleted",
      "notes"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();

    res.status(200).json({
      message: "Study session updated successfully",
      session
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a study session
export const deleteStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        message: "Study session not found"
      });
    }

    res.status(200).json({
      message: "Study session deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};