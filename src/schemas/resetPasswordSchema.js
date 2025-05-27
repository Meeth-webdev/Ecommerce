import { z } from "zod";


export const resetPassword=z.object({
    
    password: z.string().min(6, { message: "password must be atleast 6 charecters " })
})