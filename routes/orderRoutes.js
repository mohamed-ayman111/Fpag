const express = require("express");

const mongoose = require("mongoose");

const router = express.Router();

const Product = require("../models/Product");

const Order = require("../models/Order");

const { requireLogin, isAdmin } = require("../middleware/auth");


router.post("/", requireLogin, async (req, res) => {
    console.log("ORDER ROUTE REACHED");

    const session = await mongoose.startSession();


    try {

        const {
            customer,
            items,
            paymentMethod = "COD"
        } = req.body;


        // =========================
        // Validate request
        // =========================

        if (!customer) {

            return res.status(400).json({
                message: "Customer information is required."
            });
        }


        if (!Array.isArray(items) || items.length === 0) {

            return res.status(400).json({
                message: "Cart is empty."
            });
        }


        // =========================
        // Validate customer
        // =========================

        const requiredFields = [
            "name",
            "email",
            "phone",
            "address",
            "city",
            "postalCode"
        ];


        for (const field of requiredFields) {

            if (
                typeof customer[field] !== "string" ||
                !customer[field].trim()
            ) {

                return res.status(400).json({
                    message: `${field} is required.`
                });
            }
        }


        // =========================
        // Validate payment method
        // =========================

        if (!["COD", "Online"].includes(paymentMethod)) {

            return res.status(400).json({
                message: "Invalid payment method."
            });
        }


        // =========================
        // Start transaction
        // =========================

        session.startTransaction();


        const productIds = items.map(item => item.product);


        // =========================
        // Get products from DB
        // =========================

        const products = await Product.find({

            _id: {
                $in: productIds
            }

        }).session(session);


        // =========================
        // Check products
        // =========================

        if (products.length !== items.length) {

            throw new Error(
                "One or more products are unavailable."
            );
        }


        let totalAmount = 0;

        const orderItems = [];


        // =========================
        // Process items
        // =========================

        for (const item of items) {

            const product = products.find(
                p =>
                    p._id.toString() ===
                    item.product.toString()
            );


            if (!product) {

                throw new Error(
                    "Product not found."
                );
            }


            const quantity =
                Number(item.quantity);


            // Validate quantity

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                throw new Error(
                    `Invalid quantity for ${product.name}.`
                );
            }


            // =========================
            // Check stock
            // =========================

            if (product.stock < quantity) {

                throw new Error(
                    `Insufficient stock for ${product.name}.`
                );
            }


            // =========================
            // Server-side price
            // =========================

            const itemTotal =
                product.price * quantity;


            totalAmount += itemTotal;


            orderItems.push({

                product: product._id,

                name: product.name,

                image: product.image,

                price: product.price,

                quantity: quantity
            });
        }


        // =========================
        // Create order
        // =========================

        const order = new Order({

            user: req.session.userId,

            items: orderItems,

            customer: {

                name: customer.name.trim(),

                email: customer.email.trim(),

                phone: customer.phone.trim(),

                address: customer.address.trim(),

                city: customer.city.trim(),

                postalCode:
                    customer.postalCode.trim(),

                notes:
                    customer.notes
                        ? customer.notes.trim()
                        : ""
            },

            totalAmount: totalAmount,

            paymentMethod: paymentMethod,

            paymentStatus: "Pending",

            status: "Pending"
        });


        await order.save({
            session
        });


        // =========================
        // Decrease stock
        // =========================

        for (const item of items) {

            const quantity =
                Number(item.quantity);


            const updatedProduct =
                await Product.findOneAndUpdate(

                    {
                        _id: item.product,

                        stock: {
                            $gte: quantity
                        }
                    },

                    {
                        $inc: {
                            stock: -quantity
                        }
                    },

                    {
                        new: true,

                        session
                    }
                );


            if (!updatedProduct) {

                throw new Error(
                    "Stock changed. Please try again."
                );
            }
        }


        // =========================
        // Commit transaction
        // =========================

        await session.commitTransaction();


        res.status(201).json({

            success: true,

            message:
                "Order created successfully.",

            orderId:
                order._id

        });


    } catch (error) {

        // =========================
        // Rollback
        // =========================

        await session.abortTransaction();


        console.error(
            "Order creation error:",
            error
        );


        res.status(400).json({

            success: false,

            message: error.message ||
                "Failed to create order."
        });


    } finally {

        await session.endSession();
    }

});




router.get("/", requireLogin, async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.session.userId
        })
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load orders."
        });
    }
});

router.get("/:id", requireLogin, async (req, res) => {

    try {

        const orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID."
            });
        }

        console.log("ORDER ID:", orderId);
console.log("SESSION USER:", req.session.userId);
        const order = await Order.findOne({
            _id: orderId,
            user: req.session.userId
        });
        console.log("ORDER FOUND:", order);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.error(
            "Get order details error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load order."
        });
    }
});

//ID to admin
/*router.get(
    "/admin/:id",
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

//Git all status
router.get( "/admin/all", requireLogin, isAdmin, async (req, res) => { try { 
    console.log("ORDER FOUND:", order);
    const orders = await Order.find() .populate( "user", "username email" ) .sort({ createdAt: -1 }); res.status(200).json({ success: true, orders: orders }); } catch (error) { console.error( "Admin orders error:", error ); res.status(500).json({ success: false, message: "Failed to load orders." }); } } );

//Upload order status
router.patch( "/admin/:id/status", requireLogin, isAdmin, async (req, res) => { try { const { status } = req.body; const allowedStatuses = [ "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled" ]; if ( !allowedStatuses.includes(status) ) { return res.status(400).json({ success: false, message: "Invalid order status." }); } const order = await Order.findById( req.params.id ); if (!order) { return res.status(404).json({ success: false, message: "Order not found." }); } order.status = status; await order.save(); res.status(200).json({ success: true, message: "Order status updated successfully.", order: order }); } catch (error) { console.error( "Update order status error:", error ); res.status(500).json({ success: false, message: "Failed to update order status." }); } } );

//Update payment status
router.patch( "/admin/:id/payment-status", requireLogin, isAdmin, async (req, res) => { try { const { paymentStatus } = req.body; const allowedStatuses = [ "Pending", "Paid", "Failed", "Refunded" ]; if ( !allowedStatuses.includes( paymentStatus ) ) { return res.status(400).json({ success: false, message: "Invalid payment status." }); } const order = await Order.findById( req.params.id ); if (!order) { return res.status(404).json({ success: false, message: "Order not found." }); } order.paymentStatus = paymentStatus; await order.save(); res.status(200).json({ success: true, message: "Payment status updated successfully.", order: order }); } catch (error) { console.error( "Payment status error:", error ); res.status(500).json({ success: false, message: "Failed to update payment status." }); } } );
*/
router.patch(
    "/:id/cancel",
    requireLogin,
    async (req, res) => {

        const session =
            await mongoose.startSession();

        try {

            session.startTransaction();

            const order =
                await Order.findOne({
                    _id: req.params.id,
                    user: req.session.userId
                }).session(session);


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
);

module.exports = router;