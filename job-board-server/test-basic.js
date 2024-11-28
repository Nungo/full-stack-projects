const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

async function testBasicEndpoints() {
    try {
        console.log('🔍 Testing basic endpoints...\n');

        // Test SerpAPI integration
        console.log('Testing job search...');
        const response = await axios.get(`${BASE_URL}/jobs?query=developer`);
        
        if (response.data) {
            console.log('✅ Successfully got response from server');
            console.log('Response structure:', Object.keys(response.data));
            
            if (response.data.external) {
                console.log(`Found ${response.data.external.length} external jobs`);
            }
            
            if (response.data.local) {
                console.log(`Found ${response.data.local.length} local jobs`);
            }
        }

        console.log('\n🎉 Basic test completed successfully!');
    } catch (error) {
        console.error('\n❌ Test failed');
        console.error('Error details:', error.message);
        
        // More detailed error information
        if (error.response) {
            console.error('Server response:', {
                status: error.response.status,
                data: error.response.data
            });
        }
    }
}

console.log('Starting server test...');
console.log('Server URL:', BASE_URL);
console.log('SERP API Key exists:', !!process.env.SERP_API_KEY);

testBasicEndpoints();