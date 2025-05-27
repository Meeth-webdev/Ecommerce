import { z } from "zod";


export const Email=z.object({
    
    email: z.string().email({ message: "Invalid email" }),
})