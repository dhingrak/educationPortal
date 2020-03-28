require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Student } = require('../models/student');
const { Course, validateCourseId } = require('../models/course');
const auth = require('../middleware/auth');


router.get('/me', auth, async (req, res, next) => {
    const info = await Student
                        .findById(req.user._id)
                        .select([ 'name', 'username', 'email', 'enrolledCourses' ]);
    res.send(info);
});

/* POST - Register a student to a course created by a Professor */

router.post('/registerCourse', auth, async (req, res, next) => {
    const studentId = req.user._id;
    const { error } = validateCourseId(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let course = await Course.findById(req.body.courseId);
    if(!course) return res.status(400).send({ message: 'Invalid course id' });

    /* Students enrolled to the course, if the student is not already enrolled */ 
    // Note: Need to add the transaction
  
    const enrolled = course.enrolledStudents.includes(studentId);
    if(enrolled){
        res.status(400).send({ message: 'Student already registered in this course' });
    }
    else {
        course.enrolledStudents.push(req.user._id);
        await course.save();
        const student = await Student.findById(req.user._id);
        student.enrolledCourses.push(course._id);
        await student.save();
        res.send(course);
    }
    

    
   
    
})
module.exports = router;