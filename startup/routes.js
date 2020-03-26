const registerUser = require('../routers/student-register-router');
const loginUser = require('../routers/student-login-router');
const userProfile = require('../routers/student-profile-router');
const express = require('express');

module.exports = function(app){

    app.use(express.json());
    app.use('/api/student/register', registerUser);
    app.use('/api/student/login', loginUser);
    app.use('/api/student/profile', userProfile);
}