import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/guacamole/",
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 403) {
            window.location.href = '/login'
        }
        return Promise.reject(error);
    }
);

export default api;