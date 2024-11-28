// Create this file in your server folder
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB setup...');

// Test if mongoose is installed
if (!mongoose) {
    console.error('❌ Mongoose is not installed properly');
    process.exit(1);
}

console.log('✅ Mongoose is installed');

// Test MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });