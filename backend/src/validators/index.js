import { body } from "express-validator"
import User from "../models/user.model.js"
import ApiError from "../utills/api-error.js"

//Register User validator
export const registerUserValidation = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is not valid")
            .custom(async(value) => {
                const email = await User.findOne({ email:value });
                if(email){
                    throw new ApiError(400,"This is Email is already Exist")
                }
            }),
        body("name")
            .trim()
            .notEmpty().withMessage("Name is required")
            .isLength({ min:3,max:50 }).withMessage("Name is with length between 3 to 50"),
        body("password")
                .trim()
                .notEmpty().withMessage("Password is Required")
                .isLength({ min:8,max:8 }).withMessage("Password is must with length 8")
    ]
}

export const loginUserValidation = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is not valid"),
        body("password")
                .trim()
                .notEmpty().withMessage("Password is required")
                .isLength({ min:8,max:8 }).withMessage("password is must with 8 characters" )
    ]
}

export const changePasswordValidation = () => {
    return [
        body("password")
                    .trim()
                    .notEmpty().withMessage("password is required")
                    .isLength({min:8,max:8}).withMessage("password is must with 8 characters")
    ]
}

export const createPostValidation = () => {
    return [
        body("title")
            .trim()
            .notEmpty().withMessage("Title is required")
            .isLength({ min:3,max:50 }).withMessage("Title is with Length between 3 to 50"),
        body("description")
            .trim()
            .notEmpty().withMessage("Description is Required")
            .isLength({ min:3,max:100 }).withMessage("Descripotion is Required"),
    ]
}

export const commentPostValidation = () => {
    return [
        body("comment")
            .trim()
    ]
}

export const requestPostValidation = () => {
    return [
         body("title")
                .trim()
                .notEmpty().withMessage("Title is required")
                .isLength({ min:3,max:50 }).withMessage("Title is with Length between 3 to 50"),
        body("wantSkills")
                .trim()
                .custom((value) => {
                    if(value.length === 0){
                        throw new ApiError(400,"At least one skill is required")
                    }
                }),
        body("offerSkills")
                .trim()
                .custom((value) => {
                    if(value.length === 0){
                        throw new ApiError(400,"At least one skill is required")
                    }
                })
                
    ]
}