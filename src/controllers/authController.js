const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const roleService = require("../services/roleService");
const tokenBlacklistService = require("../services/tokenBlacklistService");
const { signToken, verifyToken } = require("../utils/jwtUtils");

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 401));
  }
  if (user.deletedAt) return next(new AppError("User inactive", 403));
  const role = await roleService.getRoleById(user.roleId);
  if (!role) return next(new AppError("User role not found", 404));
  const token = signToken(user.id, user.email, role.name);
  res.status(200).json({
    status: "success",
    token,
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: role.name,
    },
  });
});

const validate = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  console.log("Token received for validation:", token);
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
  const black = await tokenBlacklistService.getTokenByValue(token);
  if (black) return next(new AppError("Token revoked", 401));
  const user = await userService.getUserById(payload.userId);
  if (!user) return next(new AppError("User not found", 404));
  if (user.deletedAt) return next(new AppError("User inactive", 403));
  const role = await roleService.getRoleByName(payload.role);
  if (!role) return next(new AppError("Role not found", 404));
  res.status(200).json({
    status: "success",
    user: {
      id: user.id,
      email: user.email,
      role: role.name,
    },
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword, requestorRole, requestorId } = req.body;
  if (requestorRole !== "Administrador" && requestorId !== id) {
    return next(new AppError("Unauthorized to change this password", 403));
  }
  const user = await userService.getUserById(id);
  if (!user) return next(new AppError("User not found", 404));
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  await userService.updateUserPassword(id, hashed);
  res.status(201).json({ status: "success", message: "Password updated" });
});

const logout = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const createdToken = await tokenBlacklistService.createToken(token);
  if (!createdToken) {
    return next(new AppError("Failed to log out, try again later", 500));
  }
  res
    .status(204)
    .json({ status: "success", message: "Logged out successfully" });
});

module.exports = {
  login,
  validate,
  changePassword,
  logout,
};
