require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Admin, validateAdmin, validateLoginCredentials } = require('../models/admin');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');

/* Only admin user can create another admin as per requirements */
// TODO: Need to add the auth and admin middleware to restrict the router to admin only
router.post('/',  async (req, res, next) => {

    const { error } = validateAdmin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await Admin.findOne({ username: req.body.username });
    if(user) return res.status(400).send({ message : 'Username already exits' });

    user = await Admin.findOne({ email: req.body.email });
    if(user) return res.status(400).send({ message: 'Email already taken' });

    user = new Admin(_.pick(req.body, ['name', 'username', 'email', 'password', 'isAdmin']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Generating JWT token for the admin user for further communication
    const token = user.generateAuthToken();
    user.save();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'username', 'email', 'isAdmin']));
})


module.exports = router;