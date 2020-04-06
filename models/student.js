const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');
const config = require('config');
const Course = require('../models/course');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    lastName: {
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
    phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 20,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }]
});

studentSchema.methods.generateAuthToken = function() {
    // Genreating web token for authorization
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const Student = mongoose.model('Student', studentSchema);

function validateStudent(student) {
    const schema = {
        firstName: Joi.string().min(5).max(255).required(),
        lastName: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/).required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required()

    }
    return Joi.validate(student, schema);
}

function validateLoginCredentials(student) {
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(student, schema);
}

function validateObjectId(id) {
    const schema = {
        id: Joi.objectId()
    }
    return Joi.validate(id, schema);
}

function validateUpdateStudent(student) {
    const schema = {
        firstName: Joi.string().min(5).max(255).required(),
        lastName: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/).required()

    }
    return Joi.validate(student, schema);
}
module.exports = {
    Student,
    validateStudent,
    validateLoginCredentials,
    validateObjectId,
    validateUpdateStudent
}
