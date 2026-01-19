// server/src/validations/auth.validation.js
import Joi from "joi";

const register = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).unknown(true);


const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default {
  register,
  login,
};
