const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    logger: true,
    debug: true
});

transporter.verify((error, success) => {

    if (error) {
        console.error("SMTP verification failed:");
        console.error(error);
    } else {
        console.log("SMTP server is ready.");
    }

});

module.exports = transporter;