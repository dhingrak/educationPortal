const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken');
const config = require('config');

const adminSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    username: {
        type:String,
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
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

adminSchema.methods.generateAuthToken = function() {
    // Genreating web token for admin authorization
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
const Admin = mongoose.model('Admin', adminSchema);


function validateAdmin(admin){
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required(),
        isAdmin: Joi.boolean().required()
    }
    return Joi.validate(admin, schema);
}

function validateLoginCredentials(admin) {
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(admin, schema);
}

function validateUpdatedPassword(password) {
    const schema = {
        oldPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required(),
        newPassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?])[a-zA-Z\d~!@#$%^&*?]{6,}$/).required()
    }

    return Joi.validate(password, schema);
}

module.exports = {
    Admin,
    validateAdmin,
    validateLoginCredentials,
    validateUpdatedPassword
}