require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Teacher, validateTeacher, validateUpdateTeacher, validateObjectId } = require('../models/teacher');
const { Course } = require('../models/course');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Only admin has the access to access these routers


// GET: Filter the teachers according to their department
router.get('/' , [auth, admin], async (req, res, next) => {

    if(Object.keys(req.query).length == 0) {
        let teachers = await Teacher.find().select('firstName lastName username email department');
        return res.send(teachers);
    }

    let teachers = await Teacher.find({ department: _.lowerCase(req.query.department) }).select('firstName lastName username email department');
    res.send(teachers);
});

// TODO: Need to add more filters on the Teacher extraction


// GET: Get the profile of an existing teacher
router.get('/:id', [auth, admin], async (req, res, next) => {

    const { error } = validateObjectId({ id: req.params.id });
    if(error) return res.status(400).send('Invalid object id');

    let teacher = await Teacher.findOne({ _id: req.params.id })
                               .populate('courses');
    teacher = _.pick(teacher, ['firstName', 'lastName', 'username', 'email', 'department', 'courses']);
    res.send(teacher);

});

// POST: Creating a new Teacher user 
router.post('/', [auth, admin], async (req, res, next) => {

    const { error } = validateTeacher(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let teacher = await Teacher.findOne({ username: req.body.username });
    if(teacher) return res.status(400).send({ message : 'Username already exits' });

    teacher = await Teacher.findOne({ email: req.body.email });
    if(teacher) return res.status(400).send({ message: 'Email already taken' });

    teacher = new Teacher(_.pick(req.body, ['firstName', 'lastName', 'username', 'email', 'password', 'department', 'phoneNumber']));

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);

    await teacher.save();
    teacher = _.pick(teacher, ['firstName', 'lastName', 'username', 'email', 'department']);
    res.send(teacher);
});

// PUT: Updating an existing Teacher user
router.put('/:id', [auth, admin], async (req, res, next) => {

    // TODO: Need to combine the URL and body validations in one function
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


// DELETE: Delete an existing teacher
// TODO: Need to check what happend to the courses if the teacher is deleted by Admin
router.delete('/:id', [auth, admin], async (req, res, next) => {

    const { error } = validateObjectId({ id: req.params.id });
    if(error) return res.status(400).send('Invalid object id');

    // Deleteing the teacher from the teacher collection
    let teacher = await Teacher.findOneAndDelete({ _id: req.params.id});
    if(!teacher) return res.status(400).send('Invalid teacher id');
   
    // Delete the teacher id from course collection but not course itself
    if(teacher.courses.length > 0){
        for(let i = 0; i < teacher.courses.length; i++ ) {
            const courseId = teacher.courses[i];
            const course = await Course.findOne({ _id: courseId });
            course.teacher = "";
            await course.save();
        }
    }
    teacher = _.pick(teacher, [ 'firstName', 'lastName', 'username', 'email', 'department' ])
    res.send({ message: 'Teacher deleted successfully', teacher });

});


module.exports = router;