import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-7m76.onrender.com/",
  // baseURL:"http://localhost:3000",
  withCredentials: true
});

export default api;
