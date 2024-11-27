const mongoose = require('mongoose');

const connectDB = async (url) => {
    try {
        const connection = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        })
        console.log('Connected to main database');
        return connection;
    } catch (error) {
        console.error('Error connecting to main database:', error);
        throw error;
    }
};



module.exports = connectDB 
