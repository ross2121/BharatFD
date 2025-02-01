import {z} from "zod" 
export const FAQ=z.object({
    question: z.string(),
    answer: z.string(),
   language:z.string().optional(),
})