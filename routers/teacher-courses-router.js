
const express = require('express');
const router = express.Router();
const { Course, validateCourse } = require('../models/course');
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
   const courses = await Course.find().sort('name');
   res.send(courses);

})

router.post('/createCourse', auth, async (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let course = await Course.findOne({ courseName: req.body.courseName });
   // console.log(course);
    if(course) return res.status(400).send({ message: 'Course with the given name already exists' });

    course = await new Course({
        courseName: req.body.courseName,
        category: req.body.category,
        author: req.user._id
    });

    course.save();
    res.send(course);
})

router.post('/updateCourse/:id', (req, res) => {
    // First of all check whether the user is authorized 
    // Secondly verify the teacher can only update their own course
    // Update the course as per required

})
router.post('/deleteCourse/:id', (req, res) => {
    // First of all check whether the user is authorized 
    // Secondly verify the teacher can only delete their own course
    // Delete the course as per their ID and 
    // make sure the course is removed from the students collection as well.


})

module.exports = router;