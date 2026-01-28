import JWT from "next-auth/jwt";
import NextAuth, { DefaultSession, User } from "next-auth";
import { User as PrismaUserModel, UserRole } from "@prisma/client";

declare module "next-auth" {
    type SessionUser = User & DefaultSession["user"] | null;
    type DatabaseUser = PrismaUserModel | null;

    
    interface Session {
        user: SessionUser
    }

    interface User {
        id: string;
        isTwoFactorEnabled: boolean;
        role: UserRole;
        isOAuth?: boolean;
        emailVerified?: Date;
        name?: string | null;
        image?: string;
        email?: string;
    }
};

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        isTwoFactorEnabled: boolean;
        email: string;
        image: string;
        isOAuth: boolean;
        emailVerified?: Date;
    }
}