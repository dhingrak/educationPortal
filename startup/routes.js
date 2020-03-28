const registerUser = require('../routers/student-register-router');
const loginUser = require('../routers/student-login-router');
const userProfile = require('../routers/student-courses-router');
const registerTeacher = require('../routers/teacher-register-router');
const teacherCourses = require('../routers/teacher-courses-router');
const express = require('express');
const error  = require('../middleware/error');
require('express-async-errors');

module.exports = function(app){

    app.use(express.json());
    app.use('/api/students/register', registerUser);
    app.use('/api/students/login', loginUser);
    app.use('/api/students/courses', userProfile);
    app.use('/api/teachers/register', registerTeacher);
    app.use('/api/teachers/courses', teacherCourses);
    app.use(error);
}