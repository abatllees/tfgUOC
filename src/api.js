import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://weekob4y.directus.app/',
    /*headers: {
        "Content-Type": "application/json",
    },*/
});

instance.interceptors.request.use(config => {
    config.params = {
        access_token: sessionStorage.getItem('access_token'),
        ...config.params,
    };
    return config;
});

export default instance;