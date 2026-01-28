import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
 
import { LoginSchema } from "@/schemas";
import UserService from "@/lib/services/user-service";

export default { 
    providers: [
        GitHub,
        Google,
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const { data } = await UserService.validateUserCredentials(email, password);
                    const user = data?.user;
                    
                    if (!user || !user.password)
                        return null;
                    
                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        emailVerified: user.emailVerified ?? undefined,
                        name: user.name ?? undefined,
                        image: user.image ?? undefined,
                        isTwoFactorEnabled: user.isTwoFactorEnabled,
                        isOAuth: false,
                    };
                }

                return null;
            }
        }) 
    ]
} satisfies NextAuthConfig