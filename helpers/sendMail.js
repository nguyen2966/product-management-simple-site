// Import the Nodemailer library
const nodemailer = require('nodemailer');

module.exports.sendMail = (email,subject,html) => {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // Configure the mailoptions object
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error:" ,error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}