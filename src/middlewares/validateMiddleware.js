const { ZodError } = require("zod");

function validate(schema, property) {
  return (req, res, next) => {
    try {
      schema.parse(req[property]);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return res.status(400).json({
          status: "fail",
          message: "Invalid request data",
          errors: issues,
        });
      }
      return next(err);
    }
  };
}

module.exports = {
  validateBody: (schema) => validate(schema, "body"),
  validateParams: (schema) => validate(schema, "params"),
};
