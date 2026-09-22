const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        method: {
            type: String,
            enum: ["COD", "Online"],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
        "Processing",
        "Paid",
        "Failed",
        "Cancelled"
            ],
            default: "Pending"
        },

        transactionId: {
            type: String,
            default: null
        },

        gatewayPaymentId: { 
            type: String,
             default: null 
        },
                
        paidAt: {
            type: Date,
            default: null
        },

        failureReason: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Payment", paymentSchema);