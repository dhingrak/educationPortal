const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
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
    category: ['student', 'professor', 'head'],
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().required(),
        contactNo: Joi.string().min(5).max(20).required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required(),
        category: Joi.string().valid('student', 'professor', 'head')

    }

    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;