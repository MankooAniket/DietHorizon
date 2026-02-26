// controllers/trainerController.js
const User = require('../models/userModel');
const DietPlan = require('../models/dietPlanModel');
const WorkoutPlan = require('../models/workoutPlanModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Get all clients for a trainer
 * @route   GET /api/trainer/clients
 * @access  Private/Trainer
 */
exports.getTrainerClients = asyncHandler(async (req, res, next) => {
    // Find all users who have diet plans or workout plans created by this trainer
    const clientIds = await Promise.all([
        // Get unique user IDs from diet plans
        DietPlan.distinct('user', { trainer: req.user.id }),
        // Get unique user IDs from workout plans
        WorkoutPlan.distinct('user', { trainer: req.user.id })
    ]);

    // Merge and deduplicate client IDs
    const uniqueClientIds = [...new Set([...clientIds[0], ...clientIds[1]])];

    // Get the client details
    const clients = await User.find({
        _id: { $in: uniqueClientIds },
        role: 'user'
    }).select('name email');

    res.status(200).json({
        success: true,
        count: clients.length,
        data: clients
    });
});

/**
 * @desc    Get single client details
 * @route   GET /api/trainer/clients/:id
 * @access  Private/Trainer
 */
exports.getClientDetails = asyncHandler(async (req, res, next) => {
    const client = await User.findById(req.params.id).select('name email');

    if (!client) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Get client's diet and workout plans created by this trainer
    const [dietPlans, workoutPlans] = await Promise.all([
        DietPlan.find({ user: req.params.id, trainer: req.user.id }),
        WorkoutPlan.find({ user: req.params.id, trainer: req.user.id })
    ]);

    res.status(200).json({
        success: true,
        data: {
            client,
            dietPlans,
            workoutPlans
        }
    });
});
