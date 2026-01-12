const all = {
    home: "/",
    login: "/auth/login",
    register: "/auth/register",
};

export default all;

export const basePath = process.env.NEXT_PUBLIC_APP_URL;

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";

export const publicRoutes = 
{
    home: "/",
    verification: "/auth/email-verification",
    passwordRecovery: "/auth/password-recovery"
};

export const protectedRoutes = {
    serverProfile: "/server-profile",
    clientProfile: "/client-profile",
    settings: "/settings",
    admin: "/admin"
};

export const authRoutes = 
{
    login: "/auth/login",
    register: "/auth/register",
    error: "/auth/error"
}

export const generateConfirmationLink = (token: string) => {
    return basePath + `${publicRoutes.verification}?token=${token}`;
}

export const generateResetLink = (resetToken: string) => {
    return basePath + `${publicRoutes.passwordRecovery}?reset-token=${resetToken}`;
}