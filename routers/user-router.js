console.log('Inside the user router');

const { User, validateUser } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('User router is working');
})

module.exports = router;
