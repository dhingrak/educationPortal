require('express-async-errors');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Student, validateLoginCredentials } = require('../models/student');


router.post('/', async (req, res, next) => {

    const { error } = validateLoginCredentials(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({username: req.body.username});
    if(!student) return res.status(400).send({ message: 'Invalid username or password'});

    const validatePassword = bcrypt.compare(req.body.password, student.password);
    if(!validatePassword) {
        return res.status(400).send({ message: 'Invalid username or password' });
    }

    const token = student.generateAuthToken();
    res.header('x-auth-token', token).send({ message: 'Logged in successfully' })
})
module.exports = router;