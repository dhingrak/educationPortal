require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Course, validateCourse } = require('../models/course');
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');

/* GET all the courses created by a teacher */

// router.get('/', auth, async (req, res, next) => {
//    const courses = await Teacher.findById(req.user._id)
//                                 .populate('courses')
//                                 .select('courses')
//    res.send(courses);

// })

/* POST a new course by a teacher for students */

router.post('/createCourse', auth, async(req, res, next) => {

    const teacherId = req.user._id;
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let course = await Course.findOne({ courseName: req.body.courseName });
    if(course) return res.status(400).send({ message: 'Course with the given name already exists' });

    course = await new Course({
        courseName: req.body.courseName,
        category: req.body.category,
        teacher: req.user._id,
        contents: req.body.contents
    });

    await course.save();

    // Updating the teacher collection with the new course added
    const teacher = await Teacher.findOneAndUpdate({ _id: teacherId }, { $push: { courses: course._id }});
    await teacher.save();

    res.send(course);
})

/* UPDATE the course created by a teacher */ 

router.post('/updateCourse/:id', auth, async (req, res, next) => {

    const teacherId =  req.user._id;
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let course = await Course.findById(req.params.id);
    if(!course) return res.status(400).send('Invalid course');

    if(course.teacher != teacherId){
        res.status(400).send({ message: 'Do not have permisions to udpate the course' });
    }

    course = await Course.findOneAndUpdate({ _id: course._id }, {courseName: req.body.courseName, category: req.body.category, 
                                                    contents: req.body.contents}, {new: true});

    res.send(course);
})
router.post('/deleteCourse/:id', auth, async (req, res, next) => {

    const teacherId = req.user._id;

    // verifing the teacher can delete only their own course
    const course = await Course.findOne( { $and: [ { _id: req.params.id }, { teacher: teacherId }]});
    if(!course) return res.status(400).send({ message: 'Invalid course id' });

    // Delete the course as per their ID and 
    // make sure the course is removed from the students collection as well as teacher collection


})

module.exports = router;