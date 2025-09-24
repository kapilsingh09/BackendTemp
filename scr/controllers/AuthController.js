import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Registration from "../Models/RegistrationModel.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { json } from "express";

// 🔹 Helper function to generate tokens and save refreshToken in DB
const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    // find user by ID
    const user = await Registration.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // generate tokens using model methods
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// 🔹 Login user
export const userLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    console.log(email);
    

    // 1. check inputs
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // 2. find user
    const user = await Registration.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email ");
    }

    // 3. check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid  password");
    }

    // 4. generate tokens
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshTokens(user._id);

    // 5. get safe user data (exclude password & refreshToken)
    const loggedInUser = await Registration.findById(user._id).select(
        "-password -refreshToken"
    );

    // 6. cookie options
    const options = {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        secure: true, // HTTPS only in prod
        sameSite: "strict",
    };

    // 7. send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
        new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
        
        ));
// return res.status(200).json({ message: "Success" });
   
});
  

// 🔹 Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  // remove refreshToken from DB
  await LoginUser.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// 🔹 Refresh access token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  // get refreshToken from cookie or body
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request - no refresh token");
  }

  // verify refresh token
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // find user
  const user = await LoginUser.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // check refresh token matches DB
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or already used");
  }

  // generate new tokens
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessTokenAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

