import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const JobService = {
    // Get all jobs (both local and SerpAPI)
    getAllJobs: async (query = '', location = '') => {
        const response = await api.get(`/jobs?query=${query}&location=${location}`);
        return response.data;
    },

    // Get single job details
    getJobById: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },

    // Post a new job (employers only)
    createJob: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },

    // Apply for a job
    applyForJob: async (jobId, applicationData) => {
        const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
        return response.data;
    }
};

export const AuthService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};