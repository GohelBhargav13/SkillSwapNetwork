import { validationResult } from "express-validator"
import ApiError from "../utills/api-error.js";

export const validate = (req,res,next) => {
    const error = validationResult(req);
    console.log(typeof error);
    console.log(error);

    if(error.isEmpty()) return next()

    
    const extractedArray = [];
    error.array().map((err) => extractedArray.push({
        [err.path] : err.msg
    }))

    console.log(extractedArray);

    return res.status(400).json(new ApiError(400,"Error in Validation",extractedArray))
}
