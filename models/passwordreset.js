const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    email: {
        type: String,
        required: true
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
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema);