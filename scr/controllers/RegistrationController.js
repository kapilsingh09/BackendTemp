import Registration from "../Models/RegistrationModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { log } from "console";

// REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword } =
    req.body;

  // 1. Validate required fields
  if (
    [firstName, lastName, email, phone, password, confirmPassword].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check password match
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  // 3. Check if user already exists
  const existedUser = await Registration.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  // 4. Create user in DB (password will be hashed by pre-save hook)
  const newUser = await Registration.create({
    firstName,
    lastName,
    email,
    phone,
    password,
  });
  console.log(newUser);
  

  // 5. Generate tokens using schema methods
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  // 6. Save refresh token in DB
  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  // 7. Exclude sensitive fields from response
  const createdUser = await Registration.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  // 8. Set cookies options
  const options = {
    httpOnly: true, // JS on frontend cannot access
    secure: true, // send only over HTTPS
    sameSite: "strict",
  };

  // 9. Send response with cookies + data
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );
});
