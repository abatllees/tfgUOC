import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://weekob4y.directus.app/',
});

instance.interceptors.request.use(config => {
    config.params = {
        access_token: localStorage.getItem('access_token'),
        ...config.params,
    };
    return config;
});

export default instance; 