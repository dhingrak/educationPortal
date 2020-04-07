require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Admin, validateAdmin, validateLoginCredentials, validateUpdatedPassword } = require('../models/admin');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');


// POST: Verify the admin login credentials
router.post('/login', async (req, res, next) => {
    const { error } = validateLoginCredentials(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await Admin.findOne({ username: req.body.username});
    if(!user) return res.status(400).send({ message: 'Invalid username or password'});

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    //console.log(validatePassword)

    if(!validatePassword) {
        return res.status(400).send({ message: 'Invalid username or password' });
    }

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ message: 'Logged in successfully' })
});


// POST: Upadting the password 
router.post('/updatePassword', auth, async(req, res, next) => {

    const userId = req.user._id;
    const { error } = validateUpdatedPassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await Admin.findOne({ _id: userId});
    if(!user) return res.status(400).send('Invalid username or password');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);

    await user.save();
    res.send({ message: 'Password updated successfully' });
});


module.exports = router;