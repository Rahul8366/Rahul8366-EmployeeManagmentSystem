const mongoose = require('mongoose');
const config = require('./default.json');

const connectDB = async () => {
    try {
        const db = config.mongoURI;  // Access the MongoDB URI directly from the JSON file

        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
