require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Course, validateCourse } = require('../models/course');
const { Teacher } = require('../models/teacher');
const { Student } = require('../models/student');
const auth = require('../middleware/auth');
const _ = require('lodash');
const sendEmail = require("../utils/email");


// POST: Creating a new course
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
    let teacher = await Teacher.findOneAndUpdate({ _id: teacherId }, { $push: { courses: course._id }});
    await teacher.save();

    course = _.pick(course, [ 'courseName', 'category', 'contents']);
    res.send(course);
});


// PUT: Update the course created by a teacher
router.put('/updateCourse/:id', auth, async (req, res, next) => {

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
});


// DELETE: Delete an existing course and make sure the students are removed who enrolled in this course, 
// as well as delete course from teacher collection
router.delete('/deleteCourse/:id', auth, async (req, res, next) => {

    const teacherId = req.user._id;
    const courseId = req.params.id;

    // verifing the teacher cannot delete other user courses
    let course = await Course.findOneAndDelete( { $and: [ { _id: req.params.id }, { teacher: teacherId }]});
    if(!course) return res.status(400).send({ message: 'Invalid course id' });

    // Removing course from the teacher collection
    let teacher = await Teacher.findOne({ _id: teacherId });
    const courseIndex = teacher.courses.indexOf(courseId);
    teacher.courses.splice(courseIndex, 1);
    await teacher.save();

    // Removing course from student enrolledCourses array
    for(let i=0; i < course.enrolledStudents.length; i++) {

        let studentId = course.enrolledStudents[i];
        let student = await Student.findOne({ _id: studentId });
        let courseIndex = student.enrolledCourses.indexOf(courseId);
        student.enrolledCourses.splice(courseIndex, 1);
        await student.save();

        // Sending email to student for enrolling in this course
        const emailObject = {
            course: course.courseName,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            body: `Sorry to inform you, ${teacher.firstName} ${teacher.lastName} removed the ${course.courseName} course`
        }
        sendEmail(emailObject);   
    }
    res.send({ message: 'Course deleted successfully', course: course });

});


module.exports = router;