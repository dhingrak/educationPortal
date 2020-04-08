require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Teacher, validateObjectId, validateUpdateTeacher, validateUpdatedPassword } = require('../models/teacher');
const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');


// GET: Get the teacher profile
router.get('/me', auth, async(req, res, next) => {
    const teacher = await Teacher.findById(req.user._id)
                                    .select(' name username email department')
    if(!teacher) return res.status(400).send({ message: 'Invalid teacher id' })
    res.send(teacher);
});

// PUT: Updating the teacher profile
router.put('/:id', auth, async (req, res, next) => {
    const validateId = validateObjectId({ id: req.params.id });
    if(validateId.error) return res.status(400).send('Invalid object id');

    const { error } = validateUpdateTeacher(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let teacher = await Teacher.findByIdAndUpdate({_id: req.params.id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        department: req.body.department,
        phoneNumber: req.body.phoneNumber
    }, {new: true} );

    if(!teacher) return res.status(400).send({ message: 'Invalid teacher id' });

    teacher = _.pick(teacher, [ 'firstName', 'lastName', 'username', 'email', 'department' ]);
    res.send(teacher);
});


// GET: Get all the courses created by a teacher 
router.get('/courses', auth, async (req, res, next) => {
    const teacherId = req.user._id;
    const teacher = await Teacher.findById(teacherId).populate('courses');

    // To check if there is any course created by this user
    if(!teacher.courses.length) return res.status(400).send({ message: 'No courses exists' });

    res.send(_.pick(teacher, ['courses']));

});


// GET: Get all the studnets enrolled under a teacher 
router.get('/students', auth, async (req, res, next) => {
    const teacherId = req.user._id;
    const teacher = await Teacher.findById(teacherId).populate('students');

    if(!teacher.students.length) return res.status(400).send({ message: 'No students enrolled' });

    // Iterating the students array and extarcting the required fields 
    res.send(_.map(teacher.students, _.partialRight(_.pick, [ 'name', 'username', 'email', 'contactNo' ])));

});


// POST: Update the password
router.post('/updatePassword', auth, async (req, res, next) => {
    const teacherId = req.user._id;
    const { error } =  validateUpdatedPassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let teacher = await Teacher.findOne({ _id: teacherId });
    if(!teacher) return res.status(400).send({ message: 'Invalid username or password'});

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(req.body.newPassword, salt);


    await teacher.save();
    res.send({ message: 'Password updated successfully' });
});


module.exports = router;