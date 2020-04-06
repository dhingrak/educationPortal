require('express-async-errors');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');
const config = require('config');

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        trim: true,
        required: true,        
    },
    lastName: {
        type: String,
        minlength: 5,
        maxlength: 255,
        trim: true,
        required: true
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
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    department: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});

teacherSchema.methods.generateAuthToken = function() {
    // Genreating web token for authorization
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const Teacher = mongoose.model('Teacher', teacherSchema);

function validateTeacher(teacher){
    const schema = {
        firstName: Joi.string().min(5).max(255).required(),
        lastName: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required(),
        department: Joi.string().min(5).max(255).required(),
        phoneNumber: Joi.string().regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/).required()
    }
    return Joi.validate(teacher, schema);
}

function validateLoginCredentials(teacher) {
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(teacher, schema);
}

function validateUpdateTeacher(teacher) {
    const schema = {
        firstName: Joi.string().min(5).max(255).required(),
        lastName: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        department: Joi.string().min(5).max(255).required(),
        phoneNumber: Joi.string().regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/).required()
    }
    return Joi.validate(teacher, schema);
}

function validateObjectId(id) {
    const schema = {
        id: Joi.objectId()
    }
    return Joi.validate(id, schema);
}

module.exports = {
    Teacher,
    validateTeacher,
    validateLoginCredentials,
    validateUpdateTeacher,
    validateObjectId
}