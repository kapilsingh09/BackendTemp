import Registration from "../scr/Models/RegistrationModel.js";
import asyncHandler from '../utils/asyncHandler.js'


export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Check confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ errors: ["Passwords do not match"] });
    }

    // Create new user
    const newUser = new Registration({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    await newUser.save();

    console.log("New user:", newUser);

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Server error"] });
  }

})