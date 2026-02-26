const ErrorResponse = require('../utils/errorResponse');

/**
 * Async handler to eliminate try-catch blocks in controllers
 * @param {Function} fn - The async controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // Log error for server-side debugging
    console.error(`[Error] ${error.name}: ${error.message}`);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    // Handle Mongoose duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(new ErrorResponse(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, 400));
    }
    
    // Handle Mongoose cast errors (invalid IDs)
    if (error.name === 'CastError') {
      return next(new ErrorResponse(`Invalid ${error.path}: ${error.value}`, 400));
    }
    
    // Pass other errors to the error handler
    next(error);
  }
};

module.exports = asyncHandler;
