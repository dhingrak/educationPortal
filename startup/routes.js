const adminRegister = require('../routers/admin-register-router');
const adminLogin = require('../routers/admin-login-router');
const adminTasks = require('../routers/admin-tasks-router');

const registerTeacher = require('../routers/teacher-register-router');
const teacherCourses = require('../routers/teacher-courses-router');
const teacherStudnet = require('../routers/teacher-student-router');
const teacherDashboard = require('../routers/teacher-dashboard-router');
const teacherLogin = require('../routers/teacher-login-router');
const teacherNotification = require('../routers/teacher-notification-router');

const studentRegister = require('../routers/student-register-router');
const studentLogin = require('../routers/student-login-router');
const studentCourses = require('../routers/student-courses-router');
const studentDashboard = require('../routers/student-dashboard-router');

const express = require('express');
const error  = require('../middleware/error');
require('express-async-errors');

module.exports = function(app){

    app.use(express.json());

    // Admin routes
    app.use('/api/admin/register', adminRegister);
    app.use('/api/admin', adminLogin);
    app.use('/api/admin/tasks', adminTasks);
    
    // Teacher routes
    app.use('/api/teachers/register', registerTeacher);
    app.use('/api/teachers/courses', teacherCourses);
    app.use('/api/teachers/students', teacherStudnet);
    app.use('/api/teachers/login', teacherLogin);
    app.use('/api/teachers', teacherDashboard);
    app.use('/api/teachers/notification', teacherNotification);

    // Student routes
    app.use('/api/students/register', studentRegister);
    app.use('/api/students/login', studentLogin);
    app.use('/api/students/courses', studentCourses);
    app.use('/api/students/dashboard', studentDashboard);
    app.use(error);
}