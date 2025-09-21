import { registerUser } from "./RegistrationController.js";

export const loginUser = async () =>{
    const {email,password} = req.body;

    const user = await registerUser.findOne({ email });

    res.status(200).json({ message: 'Login successful', userId: user._id, email: user.email });

}