const mongoose = require('mongoose');

function connectToDb () {  // connecting to mongoDB
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
        });
}

module.exports = connectToDb;