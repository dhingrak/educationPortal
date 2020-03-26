const mongoose = require('mongoose');
const Joi = require('joi');
const { Course } = require('../models/course');
const { Student } = require('../models/student');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        trim: true,
        required: true,        
    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true,
        trim: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 50,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    courses: [Course],
    students: [Student],
    
});

const Teacher = mongoose.model('Teacher', teacherSchema);

function validateTeacher(teacher){
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required(),
        department: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(teacher, schema);
}

module.exports = {
    Teacher,
    validateTeacher
}