import * as z from "zod";

export const PasswordResetSchema = z
    .object({
        password: z.string().min(8, {
            message: "Password must be at least 8 characters!"
        }),
        confirmPassword: z.string().min(8, {
            message: "Confirm password must be at least 8 characters!!"
        })
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match!",
        path: ["confirmPassword"]
    });

export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;