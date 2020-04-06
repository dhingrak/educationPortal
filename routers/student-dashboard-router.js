require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Student, validateUpdateStudent, validateObjectId, validateUpdatedPassword } = require('../models/student');
const { Notification } = require('../models/notification');
const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// GET: Get the profile information of a student
router.get('/me', auth, async (req, res, next) => {

    const studentId = req.user._id;
    const me = await Student.findById(studentId)
                            .select('name username email contactNo');

    res.send(me);
});

// PUT: Update the student profile 
router.put('/:id', auth, async (req, res, next) => {

    const validateId = validateObjectId({ id: req.params.id });
    if(validateId.error) return res.status(400).send('Invalid object id');

    const { error } = validateUpdateStudent(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let student = await Student.findByIdAndUpdate({_id: req.params.id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }, {new: true} );

    if(!student) return res.status(400).send({ message: 'Invalid student id' });

    student = _.pick(student, [ 'firstName', 'lastName', 'username', 'email', 'phoneNumber' ]);
    res.send(student);
});


// GET: Get the list of enrolled courses 
router.get('/enrolledCourses', auth, async (req, res, next) => {

    const studentId = req.user._id;
    const courses = await Student.findById(studentId)
                                 .populate('enrolledCourses')
                                 .select('enrolledCourses');

    res.send(courses);
});


// GET: Get the notifications from enrolled courses 
router.get('/notifications', auth, async (req, res, next) => {
    
    const studentId = req.user._id;
    const student = await Student.findById(studentId);
    const notifications = await Notification.find({ course: student.enrolledCourses});

    // Iterating the notifications array and extarcting the required fields 
    console.log(notifications);
    res.send(_.map(notifications, _.partialRight(_.pick, [ 'course', 'title', 'content' ])));
});


// POST: Update password router
router.post('/updatePassword', auth, async (req, res, next) => {

    const studentId = req.user._id;
    const { error } = validateUpdatedPassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await Student.findOne({ _id: studentId});
    if(!user) return res.status(400).send('Invalid username or password');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);

    await user.save();
    res.send({ message: 'Password updated successfully' });
});


module.exports = router;