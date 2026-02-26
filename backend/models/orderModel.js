const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },

        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: [true, "Cart reference is required"],
        },

        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0, "Total price cannot be negative"],
        },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"],
            required: [true, "Payment method is required"],
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },

        shippingAddress: {
            type: String,
            required: [true, "Shipping address is required"],
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
