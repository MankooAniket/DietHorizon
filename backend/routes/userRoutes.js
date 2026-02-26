const express = require("express");
const { 
  getAllUsers,
  getUser,  // Note this is 'getUser', not 'getUserById'
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  changePassword,
  getAllClients
} = require("../controllers/userController");
const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateMiddleware");
const {
  validateUserProfileUpdate,
  validateChangePassword,
  validateAssignRole
} = require("../validations/userValidation");

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectMiddleware);

// Admin-only routes
router.get("/", authorizeRoles("admin"), getAllUsers);
router.get("/:id", authorizeRoles("admin"), getUser);  // Use getUser instead of getUserById
router.post("/", authorizeRoles("admin"), createUser);
router.put("/:id", authorizeRoles("admin"), updateUser);
router.delete("/:id", authorizeRoles("admin"), deleteUser);
router.put("/:id/role", authorizeRoles("admin"), validateAssignRole, validateRequest, updateUserRole);
router.put("/:id/password", authorizeRoles("admin"), changePassword);
router.get("/clients", authorizeRoles("trainer", "admin"), getAllClients);

module.exports = router;
