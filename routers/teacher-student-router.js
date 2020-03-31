require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Course } = require('../models/course');
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');

// To this course, the teacher is
//able to add his/her students. The teacher can then add assignments, conduct online
//exams, facilitate discussions, upload handouts, post updates.
router.get('/', (req, res, next) => {
    res.send('Teacher-student router is working');
})

module.exports = router;


