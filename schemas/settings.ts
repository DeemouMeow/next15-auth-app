import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string()).or(z.literal("")),
    email: z.optional(z.string()).or(z.literal("")),
    password: z.optional(z.string()).or(z.literal("")),
    repeatPassword: z.optional(z.string()).or(z.literal("")),
    isTwoFactorEnabled: z.boolean(),
}).refine(check => {
    if (check.password && check.password !== check.repeatPassword)
        return false;

    return true;
}, {
    message: "\"Password\" and \"Repeat Password\" must be the same!",
    path: ["repeatPassword"]
});

export type SettingsSchemaType = z.infer<typeof SettingsSchema>;