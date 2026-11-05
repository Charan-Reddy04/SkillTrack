import axios from "axios";

const API = axios.create({
    baseURL: "https://skilltrack-backend-m13o.onrender.com/api"
});

export default API;