import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/",
});

api.interceptors.request.use((config) => {
    const accessToken = JSON.parse(
        localStorage.getItem("authInfo") || '{}'
    )?.accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default api;
