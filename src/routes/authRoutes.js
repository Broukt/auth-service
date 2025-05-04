const express = require("express");
const router = express.Router();
const {
  login,
  validate,
  logout,
  changePassword,
} = require("../controllers/authController");
const extractToken = require("../middlewares/tokenExtractor");
const catchAsync = require("../utils/catchAsync");

router.post("/auth/login", login);
router.post("/auth/validate", validate);
router.post("/auth/logout", extractToken, logout);
router.patch("/auth/usuarios/:id", catchAsync(changePassword));

module.exports = router;
