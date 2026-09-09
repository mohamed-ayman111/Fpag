const express = require("express");

const mongoose = require("mongoose");

const router = express.Router();

const Product = require("../models/Product");

const Order = require("../models/Order");

const requireLogin = require("../middleware/auth");


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


module.exports = router;