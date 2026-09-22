const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    email: {
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true, 
        index: true
    },

    otpHash: {
        type: String,
        required: true
    },

    verified: {
        type: Boolean,
        default: false
    },

    attempts: {
        type: Number,
        default: 0
    },

    expiresAt: {
        type: Date, 
        required: true, 
        index: true
    },
    used: { 
        type: Boolean, 
        default: false 
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema);