import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),

    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    getMe: () => api.get('/auth/me'),
};

export const clientsService = {
    getAll: () => api.get('/clients'),
    create: (client: any) => api.post('/clients', client),
    update: (id: string, client: any) => api.put(`/clients/${id}`, client),
    delete: (id: string) => api.delete(`/clients/${id}`),
};

export default api;
