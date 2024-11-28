const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Starting MongoDB connection test...\n');

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

// Print connection string (hiding password)
const connectionString = process.env.MONGODB_URI;
const maskedString = connectionString.replace(/:([^/:]+)@/, ':****@');
console.log('📝 Using connection string:', maskedString);

// Connect with more detailed options
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('✅ Successfully connected to MongoDB\n');
    
    // Test creating a collection
    try {
        await mongoose.connection.db.createCollection('test_collection');
        console.log('✅ Successfully created test collection');
        
        await mongoose.connection.db.dropCollection('test_collection');
        console.log('✅ Successfully cleaned up test collection');
        
        console.log('\n🎉 All tests passed successfully!');
    } catch (error) {
        console.error('❌ Error during collection test:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Connection closed');
    }
})
.catch((error) => {
    console.error('\n❌ MongoDB connection error');
    console.error('Error details:', error.message);
    
    if (error.message.includes('bad auth')) {
        console.log('\n👉 Possible solutions:');
        console.log('1. Check if username and password in connection string are correct');
        console.log('2. Ensure the user has the correct permissions');
        console.log('3. Verify that your IP address is whitelisted in MongoDB Atlas');
    }
    
    process.exit(1);
});