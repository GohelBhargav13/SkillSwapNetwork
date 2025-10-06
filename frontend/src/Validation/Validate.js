import { file, z } from "zod"

const ValidateValues = {
    email:z.string().email("Email is Required"),
    password:z.string().min(8,"Password must be at least 8 characters long"),
    name:z.string().min(3,"Name must be at Least 3 characters long"),
}

export const RegisterSchema = z.object({
    email:ValidateValues.email,
    password:ValidateValues.password
})

export const LoginSchema = z.object({
    email:ValidateValues.email,
    password:ValidateValues.password
})

// post form validation
const FormValidation = {
    title:z.string().min(3,"Title must be at least 3 characters long"),
    description:z.string().min(10,"Description must be at least 10 characters long"),
    post_image:z.array(z.instanceof(file)).min(1,"At least one image is required")
}

export const postSchema = z.object({
    title:FormValidation.title,
    description:FormValidation.description,
    post_image:FormValidation.post_image
})
