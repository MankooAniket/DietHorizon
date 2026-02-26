// controllers/orderController.js
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Private
 *
 * Adapted to work with the frontend Checkout component:
 * - Expects items[], paymentMethod ('cod' etc.) and shippingAddress (text)
 * - Creates a Cart document on the fly from the payload
 */
const placeOrder = asyncHandler(async (req, res, next) => {
  const { items, paymentMethod, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || !paymentMethod || !shippingAddress) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
  }

  // Normalize payment method to match Order model enum
  let normalizedPaymentMethod = paymentMethod;
  if (paymentMethod.toLowerCase() === 'cod') {
    normalizedPaymentMethod = 'COD';
  }

  // Create a cart from the incoming items so existing order logic can still
  // rely on the Cart + virtual totalPrice.
  const cart = await Cart.create({
    user: req.user.id,
    items: items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  // Reload cart to get virtuals
  const populatedCart = await Cart.findById(cart._id);

  if (!populatedCart || populatedCart.items.length === 0) {
    return next(new ErrorResponse(errorMessages.CART_EMPTY || 'Cannot place order with empty cart', 400));
  }

  // Create new order using cart's virtual totalPrice
  const order = await Order.create({
    user: req.user.id,
    cart: populatedCart._id,
    totalPrice: populatedCart.totalPrice,
    paymentMethod: normalizedPaymentMethod,
    shippingAddress,
    status: 'Pending',
    paymentStatus: 'Pending',
    orderDate: Date.now(),
  });

  // Return populated order (user + cart only; items are stored directly on cart)
  const populatedOrder = await Order.findById(order._id)
    .populate('user', 'name email')
    .populate('cart');

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: populatedOrder,
  });
});

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('cart')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("cart");

  if (!order) {
    return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
  }

  // Users can only access their own orders
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Cancel an order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
  }

  // Users can only cancel their own orders
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 403));
  }

  // Only allow cancellation if the order is in Pending or Processing state
  if (!["Pending", "Processing"].includes(order.status)) {
    return next(new ErrorResponse(errorMessages.CANNOT_CANCEL_ORDER || "Order cannot be cancelled in its current state", 400));
  }

  order.status = "Cancelled";

  // If the order was paid, set payment status to Refunded
  if (order.paymentStatus === "Paid") {
    order.paymentStatus = "Refunded";
  } else {
    order.paymentStatus = "Cancelled";
  }

  await order.save();

  // Reload with user + cart details
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("cart");

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: populatedOrder
  });
});

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("cart")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/admin/orders/:id
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  if (!status && !paymentStatus) {
    return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS || "Please provide at least status or paymentStatus", 400));
  }

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorResponse(errorMessages.ORDER_NOT_FOUND, 404));
  }

  // Validate status if provided
  if (status) {
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse(errorMessages.INVALID_STATUS, 400));
    }
    order.status = status;
  }

  // Validate payment status if provided
  if (paymentStatus) {
    const validPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded", "Cancelled"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return next(new ErrorResponse(errorMessages.INVALID_PAYMENT_STATUS, 400));
    }
    order.paymentStatus = paymentStatus;
  }

  await order.save();

  // Reload with user + cart details
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("cart");

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: populatedOrder
  });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};
