
const express = require('express');
const router = express.Router();
const { Student } = require('../models/student');
const { Course, validateCourseId } = require('../models/course');
const { Teacher } = require('../models/teacher'); 
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');


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

    // Enrolling a student in a course. Make sure the student is not already enrolled 
    // Add the course in student collection
    // Add the student in teacher collection
    // Note: Need to add the transaction
  
    const enrolled = course.enrolledStudents.includes(studentId);
    const session = await mongoose.startSession();
    if(!enrolled){
       
        try {
            session.startTransaction();
            const opts = { session, new: true };
            course.enrolledStudents.push(req.user._id);
            await course.save(opts);
            
            //throw new error('Exception occoured');
            const student = await Student.findById(req.user._id);
            student.enrolledCourses.push(course._id);
            await student.save(opts); 

            const teacher = await Teacher.findById(course.teacher);
            // console.log(teacher.students);
            if(!teacher.students.includes(studentId)){
                teacher.students.push(studentId);
            }
            await teacher.save(opts);

            await session.commitTransaction();
            session.endSession();
            res.send(_.pick(course, [ 'courseName', 'category', 'contents' ]));
        }catch(error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
        
    }
    else {
        res.status(400).send({ message: 'Student already registered in this course' });
    }
    
    
})
module.exports = router;