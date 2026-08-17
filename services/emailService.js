const transporter = require("../config/mail");

async function sendOTPEmail(email, otp) {

    const mailOptions = {
        from: `"Password Reset" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Verification Code",

        text: `Your verification code is: ${otp}

This code will expire in 5 minutes.

If you did not request a password reset, please ignore this email.`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("OTP email sent:", info.messageId);

    return info;
}

module.exports = {
    sendOTPEmail
};