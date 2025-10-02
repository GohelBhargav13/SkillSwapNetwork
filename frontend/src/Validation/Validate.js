import { z } from "zod"

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
