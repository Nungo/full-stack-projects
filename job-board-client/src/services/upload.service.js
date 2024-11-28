import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const UploadService = {
    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await axios.post(`${API_URL}/upload/resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append('profile', file);

        try {
            const response = await axios.post(`${API_URL}/upload/profile-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};