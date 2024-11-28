// Create this file in your server folder as test-db.js
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        
        // Test creating a collection
        await mongoose.connection.db.createCollection('test');
        console.log('✅ Test collection created successfully!');
        
        // Clean up test collection
        await mongoose.connection.db.dropCollection('test');
        console.log('✅ Test cleanup successful!');
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed.');
    }
}

testConnection();