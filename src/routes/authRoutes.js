const express = require("express");
const router = express.Router();
const {
  login,
  validate,
  logout,
  changePassword,
} = require("../controllers/authController");
const {
  validateBody,
  validateParams,
} = require("../middlewares/validateMiddleware");
const {
  loginSchema,
  changePasswordSchema,
  validateTokenSchema,
  idParamValidator,
} = require("../validators/authValidator");

router.post("/login", validateBody(loginSchema), login);
router.post("/validate", validateBody(validateTokenSchema), validate);
router.post("/logout", validateBody(validateTokenSchema), logout);
router.patch(
  "/usuarios/:id",
  validateParams(idParamValidator),
  validateBody(changePasswordSchema),
  changePassword
);

module.exports = router;
