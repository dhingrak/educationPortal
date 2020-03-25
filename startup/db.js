const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('MONGODB_URL'), {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Successfully connected to the database');
    })
    .catch((error) => {
        console.log('Unable to connect to the database');
    })