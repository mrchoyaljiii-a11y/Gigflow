import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-backend-nl4s.onrender.com",
  // baseURL:"http://localhost:3000",
  withCredentials: true
});

export default api;
