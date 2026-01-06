import {z} from "zod";

const SAFE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.?";

const email = z.email().trim().toLowerCase().max(100);
const password = z.coerce.string().min(6).max(25)
.regex( 
    new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d${SAFE_CHARS.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]+$`),
    `Password must include uppercase, lowercase and a number. It must not include special characters except for: ${SAFE_CHARS}`
);
const confirmPassword = password;
const name = z.coerce.string().trim().min(3).max(20).optional();
const refreshToken = z.string();

const signUpSchema = z.object({
    email,
    password,
    confirmPassword,
    name
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
})
.strict();

const signInSchema = z.object({
    email,
    password
})
.strict();

const tokenSchema = z.object({
    refreshToken
})
.strict();

const logOutSchema = z.object({
    refreshToken
})
.strict();

export default {signUpSchema, signInSchema, tokenSchema, logOutSchema}