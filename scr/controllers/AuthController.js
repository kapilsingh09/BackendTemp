import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import LoginUser from '../Models/LoginModel.js'
import ApiResponse from '../utils/apiResponse.js'
const generateAccessTokenAndRefreshTokens = async(userId)=>{
    try {
        const user = await LoginUser.findOne({userId})
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
       
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while genrateing reafresh and access token")
    }
}


export const userLogin = asyncHandler(async (req,res)=>{
    
    const {email,password} = req.body;

    if(!email){
        throw new ApiError(400,"Enter vaild email")
    }

    //for when login needed by username
    // const loginUser = await LoginUser.findOne({ 
    //     $or:[{email} , {username}]
    //  });
     
    const user = await LoginUser.findOne({email});

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,
            "Invalid user credentials"
        )
    }

   const {accessToken ,refreshToken } =  await  generateAccessTokenAndRefreshTokens(user._id)

   const loggedInUser = LoginUser.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly : true,
    secure:true,
   }

   return res.status(200).cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new  ApiResponse(200,
        {
            user:loggedInUser,accessToken,
            refreshToken
        },
        "user logged in successfully"
    )
   )
    // res.status(200).json({ message: 'Login successful', userId: user._id, email: user.email });
})

export const logoutUser = asyncHandler(async (req,res)=>{
   await LoginUser.findByIdAndUpdate({
        req.user._id({
          $set:{
              refreshToken:undefined
          },
          {
            new:true
          }
        })
    })

    
   const options = {
    httpOnly : true,
    secure:true,
   }

   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(
    new  ApiResponse(200,
        {
            
        },
        "user logged out"
    )
   )
})
