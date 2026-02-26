import axios from 'axios';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
