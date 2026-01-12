import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";
import { authRoutes } from "@/lib/routes";

import UserService from "@/lib/services/user-service";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth, unstable_update: update } = NextAuth({
  pages: {
    signIn: authRoutes.login,
    error: authRoutes.error
  },
  events: {
    async linkAccount({ user }) {
      await UserService.updateUserByID(user.id, { emailVerified: new Date() });
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials")
        return true;

      if (!user?.emailVerified)
        return false;

      return true;
    },

    async session({ token, session }) {
      if (!session.user)
        return session;

      

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          isTwoFactorEnabled: token.isTwoFactorEnabled,
          isOAuth: token.isOAuth,
          role: token.role,
          emailVerified: token.emailVerified,
        }
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user)
        return { ...token, ...session.user };

      if (!user)
        return token;

      token.id = user.id;
      token.role = user.role;
      token.email = user.email || "";
      token.image = user.image || "";
      token.name = user.name || "";
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;
      token.emailVerified = user?.emailVerified || undefined;

      const res = await UserService.getUserAccontByUserID(user.id);
      const { data: accountData } = res;

      token.isOAuth = !!accountData?.account;
      
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});