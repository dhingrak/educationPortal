
const express = require('express');
const router = express.Router();
const { Notification, validateNotification, validateUpdateNotification } = require('../models/notification');
const { Teacher } = require('../models/teacher');
const auth = require('../middleware/auth');

// GET: Get all the notifcations posted by a teacher 
router.get('/', auth, async (req, res, next) => {

    const teacherId = req.user._id;
    const notifications = await Notification.find({ teacher: teacherId });
    res.send(notifications);
   
});

// TODO: Get all the notifications against a particular course 


// POST: Creating a notification against a course 
router.post('/', auth, async (req, res, next) => {

    const teacherId = req.user._id;
    const { error } = validateNotification(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const teacher = await Teacher.findById(teacherId);
    const course = teacher.courses.includes(req.body.courseId);
    if(!course) return res.status(400).send({ message: 'Invalid course id' });

    const notification = new Notification({
        teacher: teacherId,
        course: req.body.courseId,
        title: req.body.title,
        content: req.body.content
    })
    await notification.save();
    res.send(notification);
});


// PUT: Updating the course notification
router.put('/:id', auth, async (req, res, next) => {
    
    const teacherId = req.user._id;
    const { error } = validateUpdateNotification(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, teacher: teacherId }, 
                                                            { title: req.body.title, content: req.body.title },
                                                             { new: true });
    if(!notification) return res.status(400).send({ message: 'Notification does not exist or does not belongs to you' });

    res.send(notification);
});


// DELETE: Delete the course notification
router.delete('/:id', auth, async (req, res, next) => {

    const teacherId = req.user._id;

    const notification = await Notification.findOneAndDelete({ _id: req.params.id, teacher: teacherId });
    if(!notification) return res.status(400).send({ message: 'Notification does not exist or does not belongs to you' });

    res.send(notification);
});


module.exports = router;