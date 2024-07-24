import {z} from 'zod';

export const usernameValidation = z.string()
.min(3,"username must be atleast 3 charachters long")
.max(20, "usernme must be atleast no longer than 20 characters");

export const signupValidation = z.object({
    username : usernameValidation,
    email: z.string().email({message:"Invalid email adress"}),
    password: z.string().min(5,{message:"Password must be atleast 5 charaters long"})
})

export type UserInput = z.infer<typeof signupValidation>;