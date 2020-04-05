require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');
const _ = require('lodash');


/* GET: Get the teacher profile */

router.get('/me', auth, async(req, res, next) => {
    const teacher = await Teacher.findById(req.user._id)
                                    .select(' name username email department')
    res.send(teacher);
});

/* GET: Get all the courses created by a teacher */

router.get('/me/courses', auth, async (req, res, next) => {
    const teacherId = req.user._id;
    const teacher = await Teacher.findById(teacherId).populate('courses');
    
    // 
    if(!teacher.courses.length) return res.status(400).send({ message: 'No courses exists' });

    res.send(_.pick(teacher, ['courses']));

})

/* GET: Get all the studnets enrolled under a teacher */

router.get('/me/students', auth, async (req, res, next) => {
    const teacherId = req.user._id;
    const teacher = await Teacher.findById(teacherId).populate('students');

    if(!teacher.students.length) return res.status(400).send({ message: 'No students enrolled' });

    // Iterating the students array and extarcting the required fields 
    res.send(_.map(teacher.students, _.partialRight(_.pick, [ 'name', 'username', 'email', 'contactNo' ])));

})



module.exports = router;