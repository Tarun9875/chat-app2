// server/validations/group.validation.js
import Joi from "joi";

const createGroup = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

const addMember = Joi.object({
  memberId: Joi.string().required(),
});

const memberAction = Joi.object({
  memberId: Joi.string().required(),
});

const uploadAvatar = Joi.object({
  groupId: Joi.string().required(),
});

export default {
  createGroup,
  addMember,
  memberAction,
  uploadAvatar,
};
