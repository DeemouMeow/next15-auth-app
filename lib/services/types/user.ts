import { Prisma } from "@prisma/client";

export type UserFullUpdateInput = Prisma.UserUpdateInput;

export interface SensitiveData {
    email?: string;
    isTwoFactorEnabled?: boolean;
    [key: string]: unknown;
};

export interface UserCreationParams
{
    name: string,
    password: string,
    email: string
};

export interface UserSettingsUpdate {
    name?: string;
    password?: string;
    isTwoFactorEnabled?: boolean;
};