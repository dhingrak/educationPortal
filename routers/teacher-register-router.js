require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Teacher, validateTeacher } = require('../models/teacher');
const bcrypt = require('bcrypt');
const _ = require('lodash');


router.post('/', async(req, res, next) => {

    const { error } = validateTeacher(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let teacher = await Teacher.findOne({ username: req.body.username });
    if(teacher) return res.status(400).send({ message : 'Username already exits' });

    teacher = await Teacher.findOne({ email: req.body.email });
    if(teacher) return res.status(400).send({ message: 'Email already taken' });

    teacher = new Teacher(_.pick(req.body, ['name', 'username', 'email', 'password', 'department']));

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);

    const token = teacher.generateAuthToken();
    teacher.save();
    res.header('x-auth-token', token).send(_.pick(teacher, ['name', 'username', 'email']));
});

module.exports = router;