require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Teacher } = require('../models/teacher');
const { Student } = require('../models/student');
const { Notification } = require('../models/notification');
const auth = require('../middleware/auth');
const _ = require('lodash');

/* GET: Get the profile information of a student */

router.get('/me', auth, async (req, res, next) => {

    const studentId = req.user._id;
    const me = await Student.findById(studentId)
                            .select('name username email contactNo');

    res.send(me);
});

/* GET: Get the list of enrolled courses */

router.get('/me/enrolledCourses', auth, async (req, res, next) => {
    const studentId = req.user._id;
    const courses = await Student.findById(studentId)
                                 .populate('enrolledCourses')
                                 .select('enrolledCourses');

    res.send(courses);
});

/* GET: Get the notifications from enrolled courses */

router.get('/me/notifications', auth, async (req, res, next) => {
    
    const studentId = req.user._id;
    const student = await Student.findById(studentId);
    console.log(student.enrolledCourses);
    const notifications = await Notification.find({ course: student.enrolledCourses});

    // Iterating the notifications array and extarcting the required fields 
    res.send(_.map(notifications, _.partialRight(_.pick, [ 'course', 'title', 'content' ])));
})

module.exports = router;