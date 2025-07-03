const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z.string().min(1, { message: "New password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
  });

const validateTokenSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});

const idParamValidator = z.object({
  id: z
    .string({ required_error: "Id is required" })
    .uuid({ message: "Id must be a valid UUID" }),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
  validateTokenSchema,
  idParamValidator,
};
