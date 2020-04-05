require('express-async-errors');
const nodemailer = require('nodemailer')
const config = require('config')
const logger = require('../utils/logger');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.get('email'),
        pass: config.get('password')
    }
})

const sendEmail = (emailObject) => {
    var mailOptions = {
        from: config.get('email'),
        to: emailObject.email,
        subject: `${emailObject.course}`,
        text: `Hi ${emailObject.name} \n\nCongratulations you are successfully enrolled in ${emailObject.course} course. Let us know if you have any concers.
                    \n\nRegards \nuauthentication Team`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            logger.error(error)
        }
        else{
            logger.info('Email sent successfully ' + info.response)
        }
    })
}

module.exports = sendEmail
