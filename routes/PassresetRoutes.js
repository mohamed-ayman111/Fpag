//respass post.
const express = require("express"); 

const router = express.Router();

const crypto = require("crypto");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const requirePasswordResetVerification = require("../middleware/reset");

const PasswordReset = require("../models/passwordreset");

const { sendOTPEmail } = require("../services/emailService");

const rateLimit = require("express-rate-limit");

const resetRequestLimiter = rateLimit({ windowMs: 15 * 60 * 1000, // 15 minutes 
max: 5, 
standardHeaders: true, 
legacyHeaders: false, 
message: "Too many password reset requests. Please try again later." 
});
router.post('/respass',resetRequestLimiter,async(req,res)=>{
    try{
    console.log(`Reset email:`,req.body);
    const {email} = req.body;
    if (!email || typeof email !== "string") { 
        return res.status(400).json({
             success: false, 
             message: "Invalid email." 
            }); 
        }
    const cleanemail = email.trim().toLowerCase();
    const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailpattern.test(cleanemail)){
        return res.status(400).json({ 
            success: false, 
            message: "Invalid email." 
        }); 
    }
//Check if the email exists
    const Searchuser = await User.findOne({ email: cleanemail });
//    
if ( !Searchuser ){
        console.log("Email not found.");
        return res.status(200).json({ 
            success: true, 
            message: "If an account with that email exists, we have sent a verification code." 
        }); 
    }
        console.log("Email exists.");

        //Delete previous otp
        await PasswordReset.deleteMany({
    userId: Searchuser._id
});

        //Generate the OTP
const otp = crypto
            .randomInt(100000, 1000000)
            .toString();
            console.log("OTP generated.");

            //Hash the OTP
const otpHash = await bcrypt.hash(otp, 10);

//Calculate expiration
const ExpiresAt = new Date(
    Date.now() + 5 * 60 * 1000
);

//Create passwordreset document
const reset = new PasswordReset({
    userId: Searchuser._id, 
    email: Searchuser.email, 
    otpHash, 
    expiresAt : ExpiresAt, 
    attempts: 0, 
    verified: false, 
    used: false

});

//Save to MongoDB
await reset.save();
console.log("OTP information saved.");
req.session.passwordResetId = reset._id.toString();
//

//const transporter = require("./config/mail");
/*
transporter.verify()
    .then(() => {
        console.log("SMTP connection successful.");
    })
    .catch((err) => {
        console.error("SMTP connection failed:", err);
    });
    */
   try {
//Send otp to email
await sendOTPEmail(
            Searchuser.email,
            otp
        );
        } catch (mailError) {
        await PasswordReset.deleteOne({ _id: reset._id });
        throw mailError;
    }
        console.log("OTP email sent.");
    return res.status(200).json({ 
        success: true, 
        message: "If an account with that email exists, we have sent a verification code." 
    });
    }catch(err){
    console.error("Password reset error:",err);

    return res.status(500).json({ 
        success: false, 
        message: "Server error." 
    }); 
}
});


router.post(
    "/verify-otp",
    async (req, res) => {

        try {

            const { otp } = req.body;

            /*
             * التحقق من وجود reset session
             */
            if (!req.session.passwordResetId) {

                return res.status(400).json({
                    message:
                        "Password reset session expired. Please request a new code."
                });
            }

            /*
             * OTP يجب أن يكون 6 أرقام
             */
            if (
                typeof otp !== "string" ||
                !/^\d{6}$/.test(otp)
            ) {

                return res.status(400).json({
                    message:
                        "Invalid verification code."
                });
            }

            /*
             * جلب reset request
             */
            const reset = await PasswordReset.findById(
                req.session.passwordResetId
            );

            if (!reset) {

                return res.status(400).json({
                    message:
                        "Verification request expired."
                });
            }

            /*
             * تم استخدام الطلب مسبقاً
             */
            if (reset.used) {

                return res.status(400).json({
                    message:
                        "This verification request is no longer valid."
                });
            }

            /*
             * تم التحقق مسبقاً
             */
            if (reset.verified) {

                return res.status(400).json({
                    message:
                        "OTP has already been verified."
                });
            }

            /*
             * انتهاء صلاحية OTP
             */
            if (reset.expiresAt <= new Date()) {

                await PasswordReset.deleteOne({
                    _id: reset._id
                });

                delete req.session.passwordResetId;

                return res.status(400).json({
                    message:
                        "Verification code expired. Please request a new code."
                });
            }

            /*
             * الحد الأقصى للمحاولات
             */
            if (reset.attempts >= 5) {

                await PasswordReset.deleteOne({
                    _id: reset._id
                });

                delete req.session.passwordResetId;

                return res.status(429).json({
                    message:
                        "Too many invalid attempts. Please request a new code."
                });
            }

            /*
             * مقارنة OTP مع bcrypt hash
             */
            const validOTP =
                await bcrypt.compare(
                    otp,
                    reset.otpHash
                );

            if (!validOTP) {

                reset.attempts += 1;

                await reset.save();

                return res.status(400).json({
                    message:
                        "Invalid verification code."
                });
            }

            /*
             * OTP صحيح
             */
            reset.verified = true;

            /*
             * حفظ التغيير
             */
            await reset.save();

            /*
             * إنشاء restricted reset session
             */
            req.session.passwordResetVerified = true;

            req.session.passwordResetUserId =
                reset.userId.toString();

            /*
             * لا نحتاج OTP مرة أخرى
             * لكنه سيبقى hashed فقط حتى نحذف reset
             */

            return res.status(200).json({
                success: true,
                message:
                    "OTP verified successfully."
            });

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            return res.status(500).json({
                message:
                    "Server error."
            });
        }
    }
);



router.post(
    "/reset-password",requirePasswordResetVerification,
    async (req, res) => {

        try {

            /*
             * يجب أن يكون OTP verified
             */
            if (
                !req.session.passwordResetVerified ||
                !req.session.passwordResetUserId
            ) {

                return res.status(403).json({
                    message:
                        "Password reset authorization required."
                });
            }


            const {
                password,
                confirmPassword
            } = req.body;


            /*
             * التأكد من وجود القيم
             */
            if (
                typeof password !== "string" ||
                typeof confirmPassword !== "string"
            ) {

                return res.status(400).json({
                    message:
                        "Invalid password data."
                });
            }


            /*
             * طول password
             */
            if (
                password.length < 8 ||
                password.length > 64
            ) {

                return res.status(400).json({
                    message:
                        "Password must be between 8 and 64 characters."
                });
            }


            /*
             * Password policy
             */
            const hasUpper =
                /[A-Z]/.test(password);

            const hasLower =
                /[a-z]/.test(password);

            const hasNumber =
                /\d/.test(password);


            if (
                !hasUpper ||
                !hasLower ||
                !hasNumber
            ) {

                return res.status(400).json({
                    message:
                        "Password must contain uppercase, lowercase and a number."
                });
            }


            /*
             * تأكيد password
             */
            if (
                password !== confirmPassword
            ) {

                return res.status(400).json({
                    message:
                        "Passwords do not match."
                });
            }


            /*
             * جلب المستخدم
             */
            const user =
                await User.findById(
                    req.session.passwordResetUserId
                );


            if (!user) {

                return res.status(400).json({
                    message:
                        "Unable to reset password."
                });
            }


            /*
             * التأكد أن reset request
             * ما زال صالحاً
             */
            const reset =
                await PasswordReset.findOne({
                    _id: req.session.passwordResetId,
                    userId: user._id,
                    verified: true,
                    used: false
                });


            if (!reset) {

                return res.status(400).json({
                    message:
                        "Password reset authorization expired."
                });
            }


            /*
             * التأكد من عدم انتهاء صلاحية reset
             */
            if (
                reset.expiresAt <= new Date()
            ) {

                await PasswordReset.deleteOne({
                    _id: reset._id
                });

                return res.status(400).json({
                    message:
                        "Password reset authorization expired."
                });
            }


            /*
             * منع إعادة استخدام نفس password
             */
            const samePassword =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (samePassword) {

                return res.status(400).json({
                    message:
                        "New password must be different from the old password."
                });
            }


            /*
             * Hash password
             */
            const newPasswordHash =
                await bcrypt.hash(
                    password,
                    12
                );


            /*
             * تحديث password
             */
            user.password =
                newPasswordHash;


            await user.save();


            /*
             * استخدام reset request
             */
            reset.used = true;

            await reset.save();


            /*
             * حذف reset record
             */
            await PasswordReset.deleteOne({
                _id: reset._id
            });


            /*
             * حذف reset state من session
             */
            delete req.session.passwordResetId;

            delete req.session.passwordResetVerified;

            delete req.session.passwordResetUserId;


            /*
             * مهم:
             * لا نسجل المستخدم دخولاً تلقائياً.
             *
             * المستخدم يجب أن يذهب إلى login.
             */
            return res.status(200).json({

                success: true,

                message:
                    "Password changed successfully."
            });


        } catch (error) {

            console.error(
                "Password reset error:",
                error
            );

            return res.status(500).json({
                message:
                    "Server error."
            });
        }
    }
);
module.exports = router;