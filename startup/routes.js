const adminRegister = require('../routers/admin-register-router');
const adminLogin = require('../routers/admin-login-router');
const adminTeacherTasks = require('../routers/admin-teacher-router');
const adminStudnetTasks = require('../routers/admin-student-router');

const teacherLogin = require('../routers/teacher-login-router');
const teacherCourses = require('../routers/teacher-courses-router');
const teacherDashboard = require('../routers/teacher-dashboard-router');
const teacherNotification = require('../routers/teacher-notification-router');

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
    app.use('/api/admin/login', adminLogin);
    app.use('/api/admin/teachers', adminTeacherTasks);
    app.use('/api/admin/students', adminStudnetTasks);
    
    // Teacher routes
    app.use('/api/teachers/login', teacherLogin);
    app.use('/api/teachers/courses', teacherCourses);
    app.use('/api/teachers/dashboard', teacherDashboard);
    app.use('/api/teachers/notification', teacherNotification);

    // Student routes
    app.use('/api/students/login', studentLogin);
    app.use('/api/students/courses', studentCourses);
    app.use('/api/students/dashboard', studentDashboard);
    app.use(error);
}