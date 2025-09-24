import Registration from "../Models/RegistrationModel.js";
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Check if any required field is empty
    if ([firstName, lastName, email, phone, password, confirmPassword].some(field => !field || field.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    if (password !== confirmPassword) {
      // return res.status(400).json({ errors: ["Passwords do not match"] });
      throw new ApiError(404, "Passwords do not match")
    }

    const existedUser = registerUser.findOne({
      $or:[{email}]
      //can be more objects
    })

    if(existedUser){
      throw new ApiError(409,"User with email or username alreay exists")
    }

    // req.files? log

    

    // Create new user
    const newUser = new Registration({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    const createdUser = await newUser.findById(user._id).select(
      "-password -refreshToken"
    )
    if(!createdUser){
      throw new ApiError(500,"something went worng while registering in creating user")
    }
    await newUser.save();
    // console.log("New user:", newUser);

    return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registerd succesfully")
    )
    // res.status(201).json({
    //   message: "User created successfully",
    //   user: newUser
    // });


  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Server error"] });
  }

})