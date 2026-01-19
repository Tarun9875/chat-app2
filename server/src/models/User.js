// server/src/models/User.js
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

    // WhatsApp-like status text
    status: {
      type: String,
      default: "Hey there! I am using Chat Web",
    },

    // Last seen timestamp
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
   🔐 AUTO HASH PASSWORD BEFORE SAVE
====================================================== */
userSchema.pre("save", async function (next) {
  try {
    // Only hash if password is new or modified
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // ✅ IMPORTANT: forward error to mongoose
  }
});

/* ======================================================
   🔑 PASSWORD COMPARE METHOD
====================================================== */
userSchema.methods.matchPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
