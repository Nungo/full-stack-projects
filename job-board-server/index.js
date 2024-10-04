const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Endpoint to fetch job listings
app.get('/api/jobs', async (req, res) => {
    const { query } = req.query;

    try {
        const serpApiUrl = `https://serpapi.com/search.json?engine=google_jobs&q=${query}&api_key=${process.env.SERP_API_KEY}`;
        
        // Log the query and API Key for debugging purposes
        console.log('API Key:', process.env.SERP_API_KEY);
        console.log('Search Query:', query);
        
        const response = await axios.get(serpApiUrl);
        
        // Log the response data from SerpApi
        console.log('Response from SerpApi:', response.data);
        
        // Send the job results to the frontend
        res.json(response.data.jobs_results || []); // Adjust 'jobs_results' depending on API response format
    } catch (error) {
        console.error('Error fetching jobs:', error); // Log error to backend console
        res.status(500).json({ error: 'Error fetching jobs' }); // Send error to frontend
    }
});

// Listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

