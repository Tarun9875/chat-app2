// server/models/Group.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true },

  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  admins: [{ type: Schema.Types.ObjectId, ref: "User" }],

  avatar: { type: String, default: "" },

  members: [{ type: Schema.Types.ObjectId, ref: "User" }],

  isPrivate: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Group", groupSchema);
