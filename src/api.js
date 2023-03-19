import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://weekob4y.directus.app/',
    headers: {
        "Content-Type": "application/json",
    },
});

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);
export default instance; 