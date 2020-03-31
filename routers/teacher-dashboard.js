require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');



router.get('/me', auth, async(req, res, next) => {
    const teacher = await Teacher.findById(req.user._id)
                                    .populate('courses')
                                    .select(' name username email courses department')
    res.send(teacher);
});


module.exports = router;