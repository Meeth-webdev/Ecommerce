import { z } from "zod";
export const reviewSchema = z.object({
    review: z.string().length(10, "Atleast 10 words should be written")
});
