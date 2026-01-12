import * as z from "zod";

const MIN_PASSWORD_LENGTH = 6

export const RegisterSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!"
    }),
    email: z.string().email({
        message: "Email is not valid"
    }),
    password: z.string().min(MIN_PASSWORD_LENGTH, {
        message: `Minimum ${MIN_PASSWORD_LENGTH} characters required!`
    })
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;