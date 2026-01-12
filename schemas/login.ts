import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is not valid"
    }),
    password: z.string().min(1, {
        message: "Password is required!"
    }),
    code: z.string().optional()
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;