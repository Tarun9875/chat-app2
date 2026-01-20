// server/validations/message.validation.js
import Joi from "joi";

const privateHistory = Joi.object({
  currentUserId: Joi.string().required(),
  otherUserId: Joi.string().required(),
});

const groupHistory = Joi.object({
  groupId: Joi.string().required(),
});

const markRead = Joi.object({
  groupId: Joi.string().optional(),
  privateRoom: Joi.string().optional(),
}).xor("groupId", "privateRoom"); // ✅ exactly one required

export default {
  privateHistory,
  groupHistory,
  markRead,
};
