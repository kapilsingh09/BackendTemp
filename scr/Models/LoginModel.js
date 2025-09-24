import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const authUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   // make sure email is unique
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

const AuthUser = mongoose.model("AuthUser", authUserSchema);

export default AuthUser;
