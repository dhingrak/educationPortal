const express = require('express');
const router = express.Router();
const { Student } = require('../models/student');


router.get('/', (req,res) => {
    res.send('User profile router is working');
})
module.exports = router;