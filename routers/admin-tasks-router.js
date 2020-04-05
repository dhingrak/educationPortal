require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Admin } = require('../models/admin');
const { Teacher, validateTeacher, validateUpdateTeacher, validateObjectId } = require('../models/teacher');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Only admin has the access to access these routers

// POST: Creating a new Teacher user 

router.post('/registerTeacher', [auth, admin], async (req, res, next) => {

    const { error } = validateTeacher(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let teacher = await Teacher.findOne({ username: req.body.username });
    if(teacher) return res.status(400).send({ message : 'Username already exits' });

    teacher = await Teacher.findOne({ email: req.body.email });
    if(teacher) return res.status(400).send({ message: 'Email already taken' });

    teacher = new Teacher(_.pick(req.body, ['firstName', 'lastName', 'username', 'email', 'password', 'department']));

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);

    await teacher.save();
    teacher = _.pick(teacher, ['name', 'username', 'email']);
    res.send(teacher);
})

// PUT: Updating an existing Teacher user

router.put('/updateTeacher/:id', [auth, admin], async (req, res, next) => {

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
        department: req.body.department
    }, {new: true} );

    if(!teacher) return res.status(400).send({ message: 'Invalid teacher id' });

    teacher = _.pick(teacher, [ 'firstName', 'lastName', 'username', 'email', 'department' ]);
    res.send(teacher);
});

// DELETE: Delete an existing teacher
// TODO: Need to check what happend to the courses if the teacher is deleted by Admin

router.delete('/deleteTeacher/:id', [auth, admin], async (req, res, next) => {

    const { error } = validateObjectId({ id: req.params.id });
    if(error) return res.status(400).send('Invalid object id');

    let teacher = await Teacher.findOneAndDelete({ _id: req.params.id});
    if(!teacher) return res.status(400).send('Invalid teacher id');

    teacher = _.pick(teacher, [ 'firstName', 'lastName', 'username', 'email', 'department' ])
    res.send(teacher);

});


module.exports = router;