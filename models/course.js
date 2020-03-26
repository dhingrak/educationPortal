const mongoose = require('mongoose');
const Joi = require('joi');
const { Student } = require('../models/student');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'networks', 'programming', 'business', 'political']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    enrolledStudents: [Student],
    courseContent: {
        type: String
    }

})

const Course = mongoose.model('Course', courseSchema);
 
function validateCourse(course){
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        category: Joi.string().valid(['web', 'mobile', 'networks', 'programming', 'business', 'political']),
        authorId: Joi.ObjectId(),
    }
    return Joi.validate(course, schema);
}

module.exports = {
    Course,
    validateCourse
}