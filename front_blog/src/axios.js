import axios from 'axios';

// в axios также можно остлеживать download прогресс, когда грузится картинка можно вывести progress_bar, также можно отслеживать получение/отправку данных.

const instance = axios.create({
    baseURL: 'http://localhost:4444',
});

// миддлваре, которая при каждом запросе будет отправлять Authorization с токеном
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
});

export default instance;
