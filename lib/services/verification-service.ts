"use server";

import UserService from "@/lib/services/user-service";
import TokenService from "@/lib/services/token-servise";
import { success, error } from "@/lib/utils";
import { update } from "@/auth";
import { deleteEmailChangeRequest, getEmailChangeRequestByEmail } from "@/lib/mail";

export const verifyEmailVerificationToken = async (tokenValue: string) => {
    const { data: tokenData } = await TokenService.getTokenByValue("EMAIL_VERIFICATION", tokenValue);
    const token = tokenData?.token;
    
    if (!token)
        return error("Invalid token!");

    const emailChangeRequest = (await getEmailChangeRequestByEmail(token.email)).data?.request;

    if (!emailChangeRequest) {
        return error("Unable to verify email!");
    }

    const { data: candidateData } = await UserService.getUserByEmail(emailChangeRequest.new_email);
    const candidate = candidateData?.user;

    if (candidate && candidate.email !== emailChangeRequest.old_email)
        return error("Email is already in use!");

    const { data: userData } = await UserService.getUserByEmail(emailChangeRequest.old_email);
    const tokenOwner = userData?.user;

    if (!tokenOwner)
        return error("User does not exist!");

    if (TokenService.isExpired(token.expires) || TokenService.isExpired(emailChangeRequest.expires_at))
        return error("Link has been outdated!");

    const updateRes = await UserService.updateUser(
        tokenOwner.email, 
        { 
            emailVerified: new Date(), 
            email: emailChangeRequest.new_email
        });
    
    if (!updateRes.success)
        return error(updateRes.message);

    await deleteEmailChangeRequest(emailChangeRequest.user_id);

    await update({
        user: {
            email: emailChangeRequest.new_email,
            emailVerified: updateRes.data?.user.emailVerified || new Date()
        }
    });

    return success("Email confirmed!", {
        email: token.email
    });
};
