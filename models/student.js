const mongoose = require('mongoose');
const Joi = require('joi');
require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');
const config = require('config');
const Course = require('../models/course');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: true
    },
    contactNo: {
        type: String,
        minlength: 5,
        maxlength: 20,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }]
})

studentSchema.methods.generateAuthToken = function() {
    // Genreating web token for authorization
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const Student = mongoose.model('Student', studentSchema);

function validateStudent(student) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        contactNo: Joi.string().min(5).max(20).required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required(),

    }
    return Joi.validate(student, schema);
}

function validateLoginCredentials(student) {
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required()
    }
    return Joi.validate(student, schema);
}


module.exports.Student = Student;
module.exports.validateStudent = validateStudent;
module.exports.validateLoginCredentials = validateLoginCredentials;