import { v2 as cloudinary } from "cloudinary";  
import fs from "fs"

cloudinary.config({ 
        cloud_name:"dgllanar3", 
        api_key:"275635841576997", 
        api_secret:"rxL-uEa6bgGv-Ks-R5R85IiZJ6Q"// Click 'View API Keys' above to copy your API secret
    });


const uploadImageOnCloudinary = async(localFilePath) => {
    try {

        if(!localFilePath) return null

        //upload the file on the cloudinary 
         const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"image"
         })

         console.log("File uploaded sucessfully on cloudinary")
         console.log(response);

         if(!response){
            return null;
         }

        //  fs.unlinkSync(localFilePath)
         return response.url
        
    } catch (error) {
        console.log(error.message)
        fs.unlinkSync(localFilePath) // remove the local file from the server if the file is not uploaded on cloudinary
        return error
    
    }
}

export default uploadImageOnCloudinary