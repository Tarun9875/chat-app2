// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Avatar photo (URL or Base64)
    photo: {
      type: String,
      default: "",
    },
    //
    // WhatsApp-like status text
    status: {
      type: String,
      default: "Hey there! I am using Chat Web",
    },
    //last seen timestamp
   lastSeen: { type: Date, default: null },

  },
  {
    timestamps: true,
  }
);

/* ------------------------------------------------------
   🔐 AUTO HASH PASSWORD BEFORE SAVE
------------------------------------------------------ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if unchanged

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ------------------------------------------------------
   🔑 PASSWORD CHECK METHOD
------------------------------------------------------ */
userSchema.methods.matchPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
