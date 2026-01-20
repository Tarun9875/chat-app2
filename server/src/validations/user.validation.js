// server/validations/user.validation.js
import Joi from "joi";

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(40).optional(),
  status: Joi.string().max(120).optional(),
  photo: Joi.string().allow("").optional(),
});

export default {
  updateProfile,
};
