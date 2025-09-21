import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // e.g. "mycloudname"
  api_key: process.env.CLOUDINARY_API_KEY,        // e.g. "123456789"
  api_secret: process.env.CLOUDINARY_API_SECRET   // e.g. "abcxyz123"
});


const uploadCloud = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
      const uploadedImg =  await cloudinary.uploader.upload(localFilePath,{
            resource_type:'image' //auto also
        })
        console.log("file is uploaded on cloudinary " ,uploadedImg.url);

        return uploadedImg;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporay file as teh upload
        return null;
    }
}

export default uploadCloud