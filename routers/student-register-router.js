console.log('Inside the user router');

const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Student, validateStudent } = require('../models/student');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    const students = await Student.find().sort('name');
    res.send(students);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({ username: req.body.username });
    if(student) return res.status(400).send({ message: 'Username already exists. Please try with a different username' });

    student = await Student.findOne({email: req.body.email});
    if(student) return res.status(400).send({ message: 'Email already exists. Please try with a different email' });

    student = new User(_.pick(req.body, ['name', 'username', 'email', 'password', 'contactNo', 'category']));

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);

    const token = student.generateAuthToken();
    student.save();
    res.header('x-auth-token', token).send(_.pick(student, ['name', 'username', 'email']));
})

module.exports = router;
