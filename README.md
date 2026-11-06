# 🚀 SkillTrack – Personal Learning & Growth Platform

<p align="center">
  <b>Plan • Learn • Practice • Track • Improve</b>
</p>

<p align="center">
  A MERN Stack web application designed to help students organise their learning journey, develop technical skills and monitor their progress in one place.
</p>

<p align="center">
  <a href="https://skill-track-eight-virid.vercel.app/">🌐 Live Demo</a> •
  <a href="https://github.com/Charan-Reddy04/SkillTrack">📂 GitHub Repository</a>
</p>

---

## 📌 About the Project

**SkillTrack** is a Personal Learning & Growth Platform developed using the MERN Stack.

Students often use different platforms to manage learning resources, coding practice, study schedules, roadmaps and technical assessments. Managing these activities separately can make it difficult to organise and track their learning progress.

To solve this problem, SkillTrack brings these activities together in a single platform.

It helps students set learning goals, follow roadmaps, save resources, track coding practice, participate in contests, assess their technical knowledge and monitor their overall learning progress.

### 🎯 Project Objective

The main objective of SkillTrack is to make student learning more organised, measurable and productive through a single platform.

---

## ✨ Features

### 🔐 1. User Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected backend routes.
- Profile management and password updates.

### 📊 2. Dashboard
- Overview of learning activities.
- Learning progress statistics.
- Quick access to important modules.

### 🎯 3. Learning Goals
- Create, update and delete learning goals.
- Set personal learning targets.
- Track goal completion progress.

### 🗺️ 4. Roadmap Explorer
- Explore curated external learning roadmaps.
- Create personal roadmaps.
- Track completed and pending topics.

### 📚 5. Learning Resources
- Save useful learning resources.
- Search and filter resources.
- Organise learning links.

### 💻 6. Coding Practice Tracker
- Maintain coding problem records.
- Track solving status.
- Search and organise coding problems.

### 🏆 7. Contest Hub
- Maintain coding contest records.
- Organise contest participation details.

### 📝 8. Skill Assessment
- Technical knowledge assessments.
- Multiple-choice questions.
- Timed quizzes.
- Score review and assessment history.
- Includes 8 subjects with 5 questions per subject.

### ⏱️ 9. Daily Study Tracker
- Record daily study activities.
- Maintain study history.
- Monitor learning consistency.

### 📈 10. Analytics & Reports
- View learning statistics.
- Monitor learning progress.
- Understand study and practice activities through visual reports.

### 🗒️ 11. Personal Notes
- Create and manage personal notes.
- Edit and delete notes.
- Preview and read complete notes.

### ⚙️ 12. Settings
- Update profile information.
- Change account password.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| MongoDB | Database |
| Express.js | Backend framework |
| React.js | Frontend library |
| Node.js | Backend runtime |
| Vite | Frontend development and build tool |
| Tailwind CSS | UI styling |
| Axios | API communication |
| JWT | Authentication |
| bcrypt | Password hashing |
| Mongoose | MongoDB object modeling |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 🏗️ Project Architecture

SkillTrack follows a three-layer application architecture.

```text
             USER
               |
               v
       REACT FRONTEND
               |
             Axios
               |
               v
       NODE + EXPRESS
               |
          API ROUTES
               |
       AUTH MIDDLEWARE
               |
               v
          MONGOOSE
               |
               v
           MONGODB
```

### How It Works

1. Users interact with the application through the React frontend.
2. Axios sends HTTP requests to the Express backend.
3. Express processes requests through API routes and controllers.
4. JWT middleware verifies authenticated requests.
5. Mongoose communicates with MongoDB.
6. The backend returns the response to the frontend.
7. React displays the updated information.

---

## 📁 Project Folder Structure

```text
SkillTrack/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these steps to run SkillTrack locally.

### Prerequisites

Install the following:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Charan-Reddy04/SkillTrack.git
```

### 2. Navigate to the Project

```bash
cd SkillTrack
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

**Note:** Ensure `frontend/src/services/api.js` points to your local backend API (`http://localhost:5000/api`) when running locally, rather than the deployed backend URL.

---

## 🌐 Live Deployment

| Component | Platform | Link |
|---|---|---|
| Frontend | Vercel | https://skill-track-eight-virid.vercel.app |
| Backend | Render | https://skilltrack-backend-m13o.onrender.com |

---

## 🔒 Security

- JWT-based authentication.
- Password hashing using bcrypt.
- Protected API routes.
- Environment variables for sensitive configuration.
- User-specific data access.

**Important:** Never commit your `.env` file, MongoDB credentials or JWT secret to GitHub.

---

## 🚀 Future Enhancements

- Automatic learning-goal progress updates.
- GitHub integration for coding activity.
- Personalised learning recommendations.
- Study reminders and notifications.
- Progressive Web App (PWA) support.
- More detailed learning analytics.

---

## 👨‍💻 Team Members

| Student ID | Name |
|---|---|
| 241FA04535 | Dhanush |
| 241FA04562 | Yagnesh |
| 241FA04E13 | Charan |

---

## 🎓 Project Information

**Project Name:** SkillTrack – Personal Learning & Growth Platform

**Project Type:** MERN Stack Web Application

**Domain:** Full Stack Web Development

**Repository:** [Charan-Reddy04/SkillTrack](https://github.com/Charan-Reddy04/SkillTrack)

---

## ⭐ Support

If you find this project useful, consider giving the repository a star!

<p align="center">
  <b>SkillTrack – Your Learning Journey, Organised in One Place.</b>
</p>
