"use server";

import UserService from "@/lib/services/user-service";
import TokenService from "@/lib/services/token-servise";
import { getOperationFunctions } from "../utils";

const { success, error } = getOperationFunctions();

export const verifyEmailVerificationToken = async (tokenValue: string) => {
    const { data: tokenData } = await TokenService.getTokenByValue("verification", tokenValue);
    const token = tokenData?.token;

    if (!token)
        return error("Invalid token!");

    const { data: userData } = await UserService.getUserByEmail(token.email);
    const tokenOwner = userData?.user;
    
    if (!tokenOwner)
        return error("User does not exist!");

    if (TokenService.isExpired(token.expires))
        return error("Link has been outdated!");

    const updateRes = await UserService.updateUserByEmail(
        token.email, 
        { 
            emailVerified: new Date(), 
            email: token.email 
        });

    if (!updateRes.success) 
        return error("Something went wrong!"); 

    await TokenService.deleteToken("verification", token.id);

    return success("Email confirmed!");
};
