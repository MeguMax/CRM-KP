import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Request interceptor для додавання токенів
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor для обробки помилок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    // Clients
    async getClients() {
        const response = await api.get('/clients');
        return response.data;
    },

    async createClient(clientData: any) {
        const response = await api.post('/clients', clientData);
        return response.data;
    },

    async updateClient(id: string, clientData: any) {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data;
    },

    async deleteClient(id: string) {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },

    // Deals
    async getDeals() {
        const response = await api.get('/deals');
        return response.data;
    },

    async createDeal(dealData: any) {
        const response = await api.post('/deals', dealData);
        return response.data;
    },

    async updateDeal(id: string, dealData: any) {
        const response = await api.put(`/deals/${id}`, dealData);
        return response.data;
    },

    async deleteDeal(id: string) {
        const response = await api.delete(`/deals/${id}`);
        return response.data;
    },
};

export default api;