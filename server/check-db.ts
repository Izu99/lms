import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const checkDb = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        // Check users collection if it exists
        if (collections.find(c => c.name === 'users')) {
            const count = await mongoose.connection.db.collection('users').countDocuments();
            console.log(`✅ Users found: ${count}`);
        } else {
            console.log('⚠️ Users collection not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Database check failed:', error);
        process.exit(1);
    }
};

checkDb();
