const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

const {isAdmin,requireLogin} = require("../middleware/auth");


/*
========================================
Admin middleware
========================================
*/
/*
async function isAdmin(req, res, next) {

    try {

        if (!req.session.userId) {

            return res.status(401).json({
                message: "Login required."
            });

        }

        const User = require("../models/user");

        const user = await User.findById(
            req.session.userId
        );

        if (!user) {

            return res.status(401).json({
                message: "User not found."
            });

        }

        if (user.role !== "admin") {

            return res.status(403).json({
                message: "Admin access required."
            });

        }

        req.admin = user;

        next();

    } catch (error) {

        console.error(
            "Admin authentication error:",
            error
        );

        res.status(500).json({
            message: "Server error."
        });
    }
}

*/
/*
========================================
Dashboard statistics
========================================
*/


//Git all status
router.get( "/orders/all", requireLogin, isAdmin, async (req, res) => { try { 
console.log("ADMIN ORDERS ROUTE REACHED");    
    const orders = await Order.find() .populate( "user", "username email" ) .sort({ createdAt: -1 }); res.status(200).json({ success: true, orders: orders }); } catch (error) { console.error( "Admin orders error:", error ); res.status(500).json({ success: false, message: "Failed to load orders." }); } } );

router.get(
    "/dashboard",
    isAdmin,
    async (req, res) => {

        try {

            /*
            ================================
            Product statistics
            ================================
            */

            const totalProducts =
                await Product.countDocuments();


            const outOfStock =
                await Product.countDocuments({
                    stock: 0
                });


            const lowStock =
                await Product.countDocuments({
                    stock: {
                        $gt: 0,
                        $lte: 10
                    }
                });


            /*
            ================================
            Order statistics
            ================================
            */

            const totalOrders =
                await Order.countDocuments();


            const pendingOrders =
                await Order.countDocuments({
                    status: "Pending"
                });


            const processingOrders =
                await Order.countDocuments({
                    status: "Processing"
                });


            const shippedOrders =
                await Order.countDocuments({
                    status: "Shipped"
                });


            const deliveredOrders =
                await Order.countDocuments({
                    status: "Delivered"
                });


            /*
            ================================
            Sales
            ================================
            */

            const salesResult =
                await Order.aggregate([

                    {
                        $match: {

                            status: {
                                $ne: "Cancelled"
                            },

                            paymentStatus: {
                                $ne: "Failed"
                            }

                        }
                    },

                    {
                        $group: {

                            _id: null,

                            totalSales: {
                                $sum: "$totalAmount"
                            }

                        }
                    }

                ]);


            const totalSales =
                salesResult.length > 0
                    ? salesResult[0].totalSales
                    : 0;


            /*
            ================================
            Response
            ================================
            */

            res.json({

                success: true,

                statistics: {

                    products: {

                        total: totalProducts,

                        lowStock: lowStock,

                        outOfStock: outOfStock

                    },

                    orders: {

                        total: totalOrders,

                        pending: pendingOrders,

                        processing: processingOrders,

                        shipped: shippedOrders,

                        delivered: deliveredOrders

                    },

                    sales: {

                        total: totalSales

                    }

                }

            });

        } catch (error) {

            console.error(
                "Dashboard statistics error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load dashboard statistics."

            });

        }

    }
);


module.exports = router;

router.get(
    "/orders/:id",
    requireLogin,
    isAdmin,
    async (req, res) => {

        try {

            const orderId = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(orderId)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid order ID."
                });
            }

            const order = await Order.findById(orderId);

            if (!order) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });
            }

            return res.json({
                success: true,
                order
            });

        } catch (error) {

            console.error(
                "Admin order details error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load order."
            });
        }
    }
);


//Upload order status
router.patch( "/orders/:id/status", requireLogin, isAdmin, async (req, res) => { try { const { status } = req.body; const allowedStatuses = [ "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled" ]; if ( !allowedStatuses.includes(status) ) { return res.status(400).json({ success: false, message: "Invalid order status." }); } const order = await Order.findById( req.params.id ); if (!order) { return res.status(404).json({ success: false, message: "Order not found." }); } order.status = status; await order.save(); res.status(200).json({ success: true, message: "Order status updated successfully.", order: order }); } catch (error) { console.error( "Update order status error:", error ); res.status(500).json({ success: false, message: "Failed to update order status." }); } } );

//Update payment status
router.patch( "/orders/:id/payment-status", requireLogin, isAdmin, async (req, res) => { try { const { paymentStatus } = req.body; const allowedStatuses = [ "Pending", "Paid", "Failed", "Refunded" ]; if ( !allowedStatuses.includes( paymentStatus ) ) { return res.status(400).json({ success: false, message: "Invalid payment status." }); } const order = await Order.findById( req.params.id ); if (!order) { return res.status(404).json({ success: false, message: "Order not found." }); } order.paymentStatus = paymentStatus; await order.save(); res.status(200).json({ success: true, message: "Payment status updated successfully.", order: order }); } catch (error) { console.error( "Payment status error:", error ); res.status(500).json({ success: false, message: "Failed to update payment status." }); } } );

//Cancel order function
/*router.patch(
    "/orders/:id/cancel",
    requireLogin,isAdmin,
    async (req, res) => {

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            const order =
                await Order.findOne({_id: req.params.id});/*{
                    _id: req.params.id,
                    user: req.session.userId
                }).session(session);/


            if (!order) {

                await session.abortTransaction();

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }


            // Only Pending or Confirmed
            // orders can be cancelled

            if (
                order.status !== "Pending" &&
                order.status !== "Confirmed"
            ) {

                await session.abortTransaction();

                return res.status(400).json({

                    success: false,

                    message:
                        "This order cannot be cancelled."

                });

            }


            // Restore product stock

            for (const item of order.items) {

                await Product.findByIdAndUpdate(

                    item.product,

                    {
                        $inc: {
                            stock: item.quantity
                        }
                    },

                    {
                        session
                    }

                );

            }


            order.status =
                "Cancelled";


            await order.save({
                session
            });


            await session.commitTransaction();


            res.json({

                success: true,

                message:
                    "Order cancelled successfully.",

                order

            });


        } catch (error) {

            await session.abortTransaction();

            console.error(
                "Cancel order error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to cancel order."

            });


        } finally {

            await session.endSession();

        }

    }
);*/