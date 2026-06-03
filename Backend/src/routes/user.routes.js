const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, deactivateUser, updateUser, resetPassword } = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const adminOnly = [authenticate, authorize(["admin"])];

router.get("/",                      ...adminOnly, getAllUsers);
router.post("/",                     ...adminOnly, createUser);
router.put("/:id",                   ...adminOnly, updateUser);
router.patch("/:id/deactivate",      ...adminOnly, deactivateUser);
router.post("/:id/reset-password",   ...adminOnly, resetPassword);

module.exports = router;