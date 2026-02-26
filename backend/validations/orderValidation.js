const { check } = require("express-validator");

// ✅ Place order validation
// Adapted to work with frontend Checkout component:
// expects items[], paymentMethod ('cod' etc.), and a text shippingAddress.
exports.validatePlaceOrder = [
    check("items")
        .isArray({ min: 1 }).withMessage("At least one item is required"),

    check("items.*.product")
        .notEmpty().withMessage("Product ID is required for each item")
        .isString().withMessage("Product ID must be a string"),

    check("items.*.quantity")
        .notEmpty().withMessage("Quantity is required for each item")
        .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

    check("paymentMethod")
        .notEmpty().withMessage("Payment method is required")
        .isIn(["cod", "COD", "Credit Card", "Debit Card", "UPI", "Net Banking"])
        .withMessage("Invalid payment method"),

    check("shippingAddress")
        .notEmpty().withMessage("Shipping address is required")
        .isString().withMessage("Shipping address must be text"),
];

// ✅ Order status update validation
exports.validateOrderStatus = [
    check("status")
        .optional()
        .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
        .withMessage("Invalid status. Must be 'Pending', 'Processing', 'Shipped', 'Delivered', or 'Cancelled'"),

    check("paymentStatus")
        .optional()
        .isIn(["Pending", "Paid", "Failed", "Refunded", "Cancelled"])
        .withMessage("Invalid payment status. Must be 'Pending', 'Paid', 'Failed', 'Refunded', or 'Cancelled'")
];

// ✅ Ensure at least one field is provided for update
exports.validateOrderStatusUpdate = [
    ...exports.validateOrderStatus,
    check()
        .custom((value, { req }) => {
            if (!req.body.status && !req.body.paymentStatus) {
                throw new Error("Please provide at least status or paymentStatus");
            }
            return true;
        })
];
