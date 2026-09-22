const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Order = require("../models/Order");

const Payment = require("../models/payment");

const {createPayment} = require("../services/paymentService");

const {requireLogin, isAdmin} = require("../middleware/auth");


    //Create payment
router.post(
    "/create",
    requireLogin,
    async (req, res) => {

        try {

            const {
                orderId
            } = req.body;


            // =========================
            // Validate order ID
            // =========================

            if (
                !orderId ||
                !mongoose.Types.ObjectId.isValid(
                    orderId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });
            }

            const result =
                await createPayment({

                    orderId,

                    userId:
                        req.session.userId

                });


            return res.status(201).json({

                success: true,

                message:
                    "Payment process created successfully.",

                payment: {

                    id:
                        result.payment._id,

                    orderId:
                        result.payment.order,

                    amount:
                        result.payment.amount,

                    method:
                        result.payment.method,

                    status:
                        result.payment.status,

                    transactionId:
            result.checkout.transactionId    

                },

                redirectUrl:
        result.checkout.redirectUrl

            });


        } catch (error) {

            console.error(
                "Create payment error:",
                error
            );


            return res.status(400).json({

                success: false,

                message:
                    error.message ||
                    "Failed to create payment."

            });

        }

    }
);

/*
router.post(
    "/",
    requireLogin,
    async (req, res) => {

        try {

            const {
                orderId,
                paymentMethod
            } = req.body;


            // =========================
            // Validate Order ID
            // =========================

            if (
                !mongoose.Types.ObjectId.isValid(
                    orderId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID."

                });

            }


            // =========================
            // Validate payment method
            // =========================

            if (
                !["COD", "Online"].includes(
                    paymentMethod
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid payment method."

                });

            }


            // =========================
            // Find order
            // =========================

            const order =
                await Order.findOne({

                    _id: orderId,

                    user:
                        req.session.userId

                });


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            // =========================
            // Check order status
            // =========================

            if (
                order.status === "Cancelled"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cancelled orders cannot be paid."

                });

            }


            if (
                order.paymentStatus === "Paid"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This order has already been paid."

                });

            }


            // =========================
            // Check existing payment
            // =========================

            let payment =
                await Payment.findOne({

                    order: order._id

                });


            // =========================
            // COD
            // =========================

            if (
                paymentMethod === "COD"
            ) {

                if (!payment) {

                    payment =
                        new Payment({

                            order:
                                order._id,

                            user:
                                req.session.userId,

                            amount:
                                order.totalAmount,

                            method:
                                "COD",

                            status:
                                "Pending"

                        });

                } else {

                    payment.method =
                        "COD";

                    payment.amount =
                        order.totalAmount;

                    payment.status =
                        "Pending";

                }


                await payment.save();


                order.paymentMethod =
                    "COD";

                order.paymentStatus =
                    "Pending";


                await order.save();


                return res.status(201).json({

                    success: true,

                    message:
                        "Cash on Delivery payment created.",

                    payment

                });

            }


            // =========================
            // Online
            // =========================

            if (
                paymentMethod === "Online"
            ) {

                if (!payment) {

                    payment =
                        new Payment({

                            order:
                                order._id,

                            user:
                                req.session.userId,

                            amount:
                                order.totalAmount,

                            method:
                                "Online",

                            status:
                                "Pending"

                        });

                } else {

                    payment.method =
                        "Online";

                    payment.amount =
                        order.totalAmount;

                    payment.status =
                        "Pending";

                }


                await payment.save();


                order.paymentMethod =
                    "Online";

                order.paymentStatus =
                    "Pending";


                await order.save();


                return res.status(201).json({

                    success: true,

                    message:
                        "Online payment initialized.",

                    payment

                });

            }

        } catch (error) {

            console.error(
                "Payment creation error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to create payment."

            });

        }

    }
);
*/


// ========================================
// TEST PAYMENT - GET
// ========================================

router.get(
    "/test/:id",
    requireLogin,
    async (req, res) => {

        try {

            const paymentId =
                req.params.id;


            if (
                !mongoose.Types.ObjectId.isValid(
                    paymentId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid payment ID."

                });

            }


            const payment =
                await Payment.findOne({

                    _id:
                        paymentId,

                    user:
                        req.session.userId

                });


            if (!payment) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment not found."

                });

            }


            return res.json({

                success: true,

                payment: {

                    id:
                        payment._id,

                    orderId:
                        payment.order,

                    amount:
                        payment.amount,

                    method:
                        payment.method,

                    status:
                        payment.status

                }

            });


        } catch (error) {

            console.error(
                "Test payment load error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load payment."

            });

        }

    }
);


// ========================================
// TEST PAYMENT - VERIFY
// ========================================

router.post(
    "/test/verify",
    requireLogin,
    async (req, res) => {

        try {

            const {
                paymentId
            } = req.body;


            if (
                !paymentId ||
                !mongoose.Types.ObjectId.isValid(
                    paymentId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid payment ID."

                });

            }


            const payment =
                await Payment.findOne({

                    _id:
                        paymentId,

                    user:
                        req.session.userId

                });


            if (!payment) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment not found."

                });

            }


            if (
                payment.status ===
                "Paid"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment is already completed."

                });

            }


            if (
                payment.status ===
                "Cancelled"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cancelled payment cannot be verified."

                });

            }


            if (
                payment.status ===
                "Failed"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Failed payment cannot be verified."

                });

            }


            // =========================
            // Generate test transaction
            // =========================

            const transactionId =
                `TEST-${Date.now()}-${Math.floor(
                    Math.random() * 100000
                )}`;


            payment.status =
                "Paid";


            payment.transactionId =
                transactionId;


            payment.paidAt =
                new Date();


            payment.failureReason =
                null;


            await payment.save();


            // =========================
            // Update Order
            // =========================

            const order =
                await Order.findOne({

                    _id:
                        payment.order,

                    user:
                        req.session.userId

                });


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            order.paymentStatus =
                "Paid";


            await order.save();


            return res.json({

                success: true,

                message:
                    "Test payment verified successfully.",

                payment: {

                    id:
                        payment._id,

                    orderId:
                        payment.order,

                    amount:
                        payment.amount,

                    status:
                        payment.status,

                    transactionId:
                        payment.transactionId,

                    paidAt:
                        payment.paidAt

                }

            });


        } catch (error) {

            console.error(
                "Test payment verification error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Payment verification failed."

            });

        }

    }
);


// ========================================
// TEST PAYMENT - FAIL
// ========================================

router.patch(
    "/test/fail",
    requireLogin,
    async (req, res) => {

        try {

            const {
                paymentId
            } = req.body;


            const payment =
                await Payment.findOne({

                    _id:
                        paymentId,

                    user:
                        req.session.userId

                });


            if (!payment) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment not found."

                });

            }


            if (
                payment.status ===
                "Paid"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Paid payment cannot be failed."

                });

            }


            payment.status =
                "Failed";


            payment.failureReason =
                "Test payment failure";


            await payment.save();


            const order =
                await Order.findOne({

                    _id:
                        payment.order,

                    user:
                        req.session.userId

                });


            if (order) {

                order.paymentStatus =
                    "Failed";

                await order.save();

            }


            return res.json({

                success: true,

                message:
                    "Test payment failed.",

                payment: {

                    id:
                        payment._id,

                    orderId:
                        payment.order,

                    status:
                        payment.status,

                    failureReason:
                        payment.failureReason

                }

            });


        } catch (error) {

            console.error(
                "Test payment fail error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update payment."

            });

        }

    }
);


// ========================================
// TEST PAYMENT - CANCEL
// ========================================

router.patch(
    "/test/cancel",
    requireLogin,
    async (req, res) => {

        try {

            const {
                paymentId
            } = req.body;


            const payment =
                await Payment.findOne({

                    _id:
                        paymentId,

                    user:
                        req.session.userId

                });


            if (!payment) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment not found."

                });

            }


            if (
                payment.status ===
                "Paid"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Paid payment cannot be cancelled."

                });

            }


            payment.status =
                "Cancelled";


            payment.failureReason =
                "Payment cancelled by user";


            await payment.save();


            const order =
                await Order.findOne({

                    _id:
                        payment.order,

                    user:
                        req.session.userId

                });


            if (order) {

                order.paymentStatus =
                    "Cancelled";

                await order.save();

            }


            return res.json({

                success: true,

                message:
                    "Payment cancelled.",

                payment: {

                    id:
                        payment._id,

                    orderId:
                        payment.order,

                    status:
                        payment.status

                }

            });


        } catch (error) {

            console.error(
                "Test payment cancel error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to cancel payment."

                });

        }

    }
);


// ======================================
// Get payment information
// ======================================

router.get("/:orderId", requireLogin, async (req, res) => {

    try {

        const order =
            await Order.findById(
                req.params.orderId
            );

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }


        // User can only see own order

        if (
            order.user &&
            order.user.toString() !==
            req.session.userId.toString()
        ) {

            return res.status(403).json({
                message: "Access denied."
            });

        }


        res.json({

            success: true,

            payment: {

                orderId: order._id,

                amount: order.totalAmount,

                method: order.paymentMethod,

                status: order.paymentStatus,

                transactionId:
                    order.payment?.transactionId || null,

                paidAt:
                    order.payment?.paidAt || null

            }

        });

    } catch (error) {

        console.error(
            "Payment error:",
            error
        );

        res.status(500).json({
            message: "Failed to load payment."
        });

    }

});

module.exports = router;