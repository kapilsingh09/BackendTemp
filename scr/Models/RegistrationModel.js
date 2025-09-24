import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

// Define schema for user registration/login
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"], // validation rule
      trim: true, // remove extra spaces
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no duplicate emails
      lowercase: true, // always save email in lowercase
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email"], // regex validation
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    refreshToken: {
      type: String, // will store the refresh token for user sessions
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt fields
);

// 🔹 Pre-save middleware → runs before saving user to DB
UserSchema.pre("save", async function (next) {
  // Only hash password if it's new or being modified
  if (!this.isModified("password")) return next();

  // Hash the password with salt rounds = 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare entered password with hashed password in DB
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Generate Access Token (short-lived, e.g. 15m–1h)
// This token is used for authenticated API requests
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, // user ID
      email: this.email, // email
      firstName: this.firstName, // extra payload info
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key from .env
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // expiry time (e.g., "15m")
  );
};

// 🔹 Generate Refresh Token (long-lived, e.g. 7d–30d)
// This token is used to request new access tokens
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
    },
    process.env.REFRESH_TOKEN_SECRET, // different secret for refresh tokens
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // longer expiry (e.g., "7d")
  );
};

// Create and export User model
const User = mongoose.model("User", UserSchema);

export default User;
