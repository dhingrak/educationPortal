require('express-async-errors');
const express = require('express')
const router = express.Router();
const { Teacher, validateLoginCredentials } = require('../models/teacher');
const bcrypt = require('bcrypt');


// POST: Verify the teacher login credentials

router.post('/', async (req, res, next) => {
    
    const { error } = validateLoginCredentials(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let teacher = await Teacher.findOne({username: req.body.username});
    if(!teacher) return res.status(400).send({ message: 'Invalid username or password'});

    const validatePassword = await bcrypt.compare(req.body.password, teacher.password);
    if(!validatePassword) {
        return res.status(400).send({ message: 'Invalid username or password' });
    }

    const token = teacher.generateAuthToken();
    res.header('x-auth-token', token).send({ message: 'Logged in successfully' })
});


module.exports = router;