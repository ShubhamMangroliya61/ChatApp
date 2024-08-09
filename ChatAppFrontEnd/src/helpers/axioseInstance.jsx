import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7121',
  withCredentials: false,
  headers: {
    'ngrok-skip-browser-warning': true
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["ngrok-skip-browser-warning"] = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
