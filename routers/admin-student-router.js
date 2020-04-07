require('express-async-errors');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Student, validateObjectId, validateStudent, validateUpdateStudent } = require('../models/student');
const { Course } = require('../models/course');
const { Teacher } = require('../models/teacher');


// Only admin has the access to access these routers

// GET: Get all the students 
router.get('/', [auth, admin], async (req, res, next) => {
    
    const students = await Student.find(). select('firstName lastName username email, phoneNumber');
    res.send(students);
});


// GET: Get the profile of an existing student 
router.get('/:id', [auth, admin], async (req, res, next) => {

    const { error } = validateObjectId({ id: req.params.id });
    if(error) return res.status(400).send('Invalid object id');

    let student = await Student.findById(req.params.id);
    if(!student) return res.status(400).send('Invalid student id');

    student = _.pick(student, ['firstName', 'lastName', 'username', 'email', 'phoneNumber']);
    res.send(student);
});


// POST: Create a new student
router.post('/', [auth, admin], async (req, res, next) => {

    const { error } = validateStudent(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({ username: req.body.username });
    if(student) return res.status(400).send({ message: 'Username already exists' });

    student = await Student.findOne({ email: req.body.email });
    if(student) return res.status(400).send({ message: 'Email already exists' });

    student = new Student(_.pick(req.body, ['firstName', 'lastName', 'username', 'email', 'password', 'phoneNumber']));

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);

    student.save();
    res.send(_.pick(student, ['firstName', 'lastName', 'username', 'email', 'phoneNumber']));
});


// PUT: Update an existing student 
router.put('/:id', [auth, admin], async (req, res, next) => {

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


// DELETE: Delete an existing student
// Make sure the student will delete from the teacher as well as courses collection
router.delete('/:id', [auth, admin], async (req, res, next) => {

    const validateId = validateObjectId({ id: req.params.id });
    if(validateId.error) return res.status(400).send('Invalid object id');

    // Deleting the student from student collection
    let student = await Student.findByIdAndDelete({ _id: req.params.id});
    if(!student) return res.status(400).send('Invalid student id');

    if(student.enrolledCourses.length > 0){
        for(let i=0; i < student.enrolledCourses.length; i++) {

            // Deleteing the student from the courses collection
            const courseId = student.enrolledCourses[i];
            const course = await Course.findOne({ _id: courseId });
            const courseIndex = course.enrolledStudents.indexOf(student._id);
            course.enrolledStudents.splice(courseIndex, 1);
            await course.save();

            // Deleting the student from the teacher collection
            let teacher = await Teacher.findOne({ _id: course.teacher });
            if(teacher.students.includes(student._id)) {
                const studentIndex = teacher.students.indexOf(student._id);
                teacher.students.splice(studentIndex, 1);
                await teacher.save();
            }
        }
    }
    student = _.pick(student, ['firstName', 'lastName', 'username', 'email', 'phoneNumber']);
    res.send({ message: 'Student deleted successfully', student })
});


module.exports = router;