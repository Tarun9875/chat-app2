// server/src/middleware/validate.js
export default function validate(schema) {
  return (req, res, next) => {
   const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
     // console.error("VALIDATION ERROR:", error.details[0].message);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    next();
  };
}
