require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Course } = require('../models/course');
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');

router.get('/', (req, res, next) => {
    res.send('Teacher-student router is working');
})

module.exports = router;


