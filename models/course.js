const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Student } = require('../models/student');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'networks', 'programming', 'business', 'political', 'database']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    courseContent: {
        type: String
    }

})

const Course = mongoose.model('Course', courseSchema);
 
function validateCourse(course){
    const schema = {
        courseName: Joi.string().min(5).max(255).required(),
        category: Joi.string().valid(['web', 'mobile', 'networks', 'programming', 'business', 'political', 'database']).required()
    }
    return Joi.validate(course, schema);
}

function validateCourseId(course) {
    const schema = {
        courseId: Joi.objectId().required()
    }
    return Joi.validate(course, schema);
}

module.exports = {
    Course,
    validateCourse,
    validateCourseId
}