const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('🔍 Starting endpoint tests...\n');

    try {
        // Test 1: Get all jobs
        console.log('Testing GET /api/jobs...');
        const jobsResponse = await axios.get(`${BASE_URL}/jobs?query=developer`);
        console.log('✅ Successfully fetched jobs');
        console.log(`Found ${jobsResponse.data.external.length} external jobs and ${jobsResponse.data.local.length} local jobs\n`);

        // Test 2: Create a job
        console.log('Testing POST /api/jobs...');
        const newJob = {
            title: "Test Developer Position",
            company: "Test Company",
            location: "Remote",
            description: "This is a test job posting",
            employmentType: "Full-time",
            salary: {
                min: 50000,
                max: 100000,
                currency: "USD"
            }
        };
        
        const createResponse = await axios.post(`${BASE_URL}/jobs`, newJob);
        console.log('✅ Successfully created job');
        const jobId = createResponse.data._id;
        console.log(`Created job with ID: ${jobId}\n`);

        // Test 3: Get single job
        console.log(`Testing GET /api/jobs/${jobId}...`);
        const singleJobResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`);
        console.log('✅ Successfully fetched single job\n');

        console.log('🎉 All tests passed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testEndpoints();