const mongoose = require("mongoose");


// =========================
// Order Item Schema
// =========================

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);


// =========================
// Order Schema
// =========================

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        items: {
            type: [orderItemSchema],
            required: true,

            validate: {
                validator: function (items) {
                    return items.length > 0;
                },

                message: "Order must contain at least one item."
            }
        },


        customer: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            postalCode: {
                type: String,
                required: true,
                trim: true
            },

            notes: {
                type: String,
                default: "",
                trim: true
            }
        },


        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },


        status: {
            type: String,

            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],

            default: "Pending"
        },


        paymentStatus: {
            type: String,

            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded"
            ],

            default: "Pending"
        },


        paymentMethod: {
            type: String,

            enum: [
                "COD",
                "Online"
            ],

            default: "COD"
        }
    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model("Order", orderSchema);