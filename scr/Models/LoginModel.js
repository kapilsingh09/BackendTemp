import mongoose from "mongoose";
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    },
    refreshToken:{
        type:String,
    }
})

const UserModel = mongoose.model("User",userSchema)
export  default UserModel
 