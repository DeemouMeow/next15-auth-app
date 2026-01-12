"use server";

import TokenService from "@/lib/services/token-servise";
import UserService from "@/lib/services/user-service";
import { getOperationFunctions } from "@/lib/utils";

const { success, error } = getOperationFunctions();

export default async function resetPassword(resetToken: string, newPassword: string) {
    const { data: tokenData } = await TokenService.getTokenByValue("reset", resetToken);
    const token = tokenData?.token;

    if (!token)
        return error("Invalid reset token provided!");

    const { data: userData } = await UserService.getUserByEmail(token.email);
    const tokenOwner = userData?.user;

    if (!tokenOwner)
        return error("Email is not registered!");

    if (TokenService.isExpired(token.expires))
        return error("Reset Link has been outdated!");

    const updateRes = await UserService.updateUserByEmail(token.email, {
        password: newPassword
    });

    if (!updateRes.success)
        return error(updateRes.message);

    await TokenService.deleteToken("reset", token.id);
    
    return success("Password changed successfully!");
}