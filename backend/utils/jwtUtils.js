const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token
 * @param {string} id - User ID to include in token
 * @returns {string} Signed JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - Token to verify
 * @returns {Object} Decoded token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Send token response with cookie
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Generate token directly using the user ID
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Prepare user data for response (remove password)
  let userData;
  if (user.toObject) {
    // If it's a Mongoose document
    userData = user.toObject();
    delete userData.password;
  } else {
    // If it's a plain object
    userData = { ...user };
    delete userData.password;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message: message || "Success",
      token,
      data: userData
    });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse
};
