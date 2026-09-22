const Payment = require("../models/payment");
const Order = require("../models/Order");
const { createCheckout } = require("./paymentGateway");

async function createPayment({
    orderId,
    userId
}) {

    // =========================
    // Find user's order
    // =========================

    const order =
        await Order.findOne({
            _id: orderId,
            user: userId
        });


    if (!order) {

        throw new Error(
            "Order not found."
        );
    }


    // =========================
    // Check payment method
    // =========================

    if (
        order.paymentMethod !==
        "Online"
    ) {

        throw new Error(
            "This order does not use online payment."
        );
    }


    // =========================
    // Check cancelled order
    // =========================

    if (
        order.status ===
        "Cancelled"
    ) {

        throw new Error(
            "Cancelled orders cannot be paid."
        );
    }


    // =========================
    // Check existing payment
    // =========================

    let payment =
        await Payment.findOne({
            order: order._id
        });


    if (
        payment &&
        payment.status === "Paid"
    ) {

        throw new Error(
            "This order has already been paid."
        );
    }


    // =========================
    // Create / update payment
    // =========================

    if (!payment) {

        payment =
            new Payment({

                order:
                    order._id,

                user:
                    userId,

                amount:
                    order.totalAmount,

                method:
                    "Online",

                status:
                    "Processing"

            });

    } else {

        payment.amount =
            order.totalAmount;

        payment.method =
            "Online";

        payment.status =
            "Processing";

    }


    await payment.save();
    
    const checkout =
    await createCheckout({

        payment

    });

    // =========================
    // Update order
    // =========================

    order.paymentStatus =
        "Processing";


    await order.save();


    return {

        payment,
        order,
        checkout

    };

}


module.exports = {
    createPayment
};