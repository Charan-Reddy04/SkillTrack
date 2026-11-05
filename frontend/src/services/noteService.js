
import API from "./api";

const getNotes = async () => {
    const response = await API.get("/notes");
    return response.data;
};

const createNote = async (noteData) => {
    const response = await API.post("/notes", noteData);
    return response.data;
};

const updateNote = async (id, noteData) => {
    const response = await API.put(`/notes/${id}`, noteData);
    return response.data;
};

const deleteNote = async (id) => {
    const response = await API.delete(`/notes/${id}`);
    return response.data;
};

export default {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
