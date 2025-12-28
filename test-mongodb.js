// Quick MongoDB Connection Test
require('dotenv').config({ path: './api/.env' });
const { MongoClient } = require('mongodb');

async function testMongoDB() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost/xscorts';
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    try {
        const client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000
        });
        
        await client.connect();
        console.log('✓ MongoDB connection successful!');
        
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log(`✓ Database has ${collections.length} collections`);
        
        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('✗ MongoDB connection failed!');
        console.error('Error:', error.message);
        console.error('\nMake sure MongoDB is running:');
        console.error('  - Check Windows Services for MongoDB');
        console.error('  - Or run: mongod');
        process.exit(1);
    }
}

testMongoDB();

