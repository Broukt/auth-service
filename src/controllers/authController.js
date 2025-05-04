const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const prisma = require("../database/prisma");
const bcrypt = require("bcrypt");
const { signToken, verifyToken } = require("../utils/jwtUtils");

const register = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password required", 400));
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
  res.status(201).json({
    status: "success",
    data: { user: { id: user.id, email: user.email } },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email and password required", 400));
  const user = await prisma.authUser.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 401));
  }
  if (!user.isActive) return next(new AppError("User inactive", 403));
  const token = signToken(user.id);
  res.json({ status: "success", token });
});

const validate = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new AppError("Token required", 400));
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
  const black = await prisma.blacklistedToken.findUnique({ where: { token } });
  if (black) return next(new AppError("Token revoked", 401));
  res.json({ valid: true, userId: payload.id });
});

const changePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("Passwords required", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }
  const user = await prisma.authUser.findUnique({ where: { id } });
  if (!user) return next(new AppError("User not found", 404));
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.authUser.update({ where: { id }, data: { password: hashed } });
  res.json({ status: "success", message: "Password updated" });
});

const logout = catchAsync(async (req, res, next) => {
  const token = req.token || req.body.token;
  if (!token) return next(new AppError("Token required", 400));
  const { exp } = verifyToken(token);
  await prisma.blacklistedToken.create({
    data: { token, expiresAt: new Date(exp * 1000) },
  });
  res.json({ status: "success", message: "Logged out successfully" });
});

module.exports = {
  register,
  login,
  validate,
  changePassword,
  logout,
};
