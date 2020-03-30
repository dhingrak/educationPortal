const mongoose = require('mongoose');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);

const notificationSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        trim: true,
        required: true
    },
    content: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
        trim: true
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

function validateNotification(notification){
    const schema = {
        courseId: Joi.ObjectId().required(),
        title: Joi.string().min(5).max(255).required(),
        content: Joi.string().min(5).max(1024).required()
    }

    return Joi.validate(notification, schema);
}

function validateUpdateNotification(notification) {
    const schema  = {
        title: Joi.string().min(5).max(255).required(),
        content: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(notification, schema);
}

module.exports = {
    Notification,
    validateNotification,
    validateUpdateNotification
}