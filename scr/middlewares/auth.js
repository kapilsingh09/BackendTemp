
import UserModel from "../Models/LoginModel.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async (req,res,next) =>{
try {
       const bearerHeader = req.header("Authorization") || ""
       const tokenFromHeader = bearerHeader.startsWith("Bearer ") ? bearerHeader.substring(7) : ""
       const token =  req.cookies?.accessToken || tokenFromHeader
        
        if(!token){
            throw new ApiError(401,"unauthroized request")
        }
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
        const user = await UserModel.findById(decodedToken?._id).select('-password -refreshToken')
        
        if(!user){
            throw new ApiError(401,"invalid acces toekn")
            
        }
        
        req.user = user;
        next()
} catch (error) {
    throw new ApiError(401,error.message || 'something went working on tokens ')
}

    
})