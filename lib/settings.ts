"use server";

import { update } from "@/auth";
import { getSessionUser } from "@/lib/auth";
import UserService from "@/lib/services/user-service";
import { type SettingsSchemaType } from "@/schemas/settings";
import { success, error } from "@/lib/utils";
import { sendVerificationEmail, generateEmailChangeRequest } from "@/lib/mail";
import { UserSettingsUpdate } from "@/lib/services/types/user";

export const settings = async (values: SettingsSchemaType) => {
    const user = await getSessionUser();

    if (!user || !user.email)
        return error("Unauthorized");
    
    const payload: Partial<UserSettingsUpdate> = { };

    if (values.email && values.email !== user.email) {
        const userGetRes = await UserService.getUserByEmail(values.email);
        const userGetData = userGetRes.data;
        const user = userGetData?.user;

        if (user)
            return error("Email is already in use");
    }

    if (values.name && values.name !== user.name)
        payload.name = values.name;

    const password = values.password;

    if (password) {
        const { success: isEquals } = await UserService.comparePassword(user.email, password);

        if (isEquals)
            return error("Password must be different!");

        payload.password = values.password;
    }

    if (values.isTwoFactorEnabled !== user.isTwoFactorEnabled) {
        payload.isTwoFactorEnabled = values.isTwoFactorEnabled;
    }

    if (Object.keys(payload).length === 0)
        return success("You have change nothing!");

    
    let mailMessage = '';

    const settingsEmail = values.email;

    if (settingsEmail && settingsEmail !== user.email) {
        const mailSendRes = await sendVerificationEmail(settingsEmail);

        if (!mailSendRes.success)
            return error("Unable to send verification email!");

        const mailRequestGenerationRes = await generateEmailChangeRequest(user.id, user.email, settingsEmail);

        if (!mailRequestGenerationRes.data)
            return error("Unable to send email change request!");

        mailMessage = "Confiramtion mail send to your new mailbox!";
    }

    const updateRes = await UserService.updateUser(user.email, {
        ...payload
    });

    if (!updateRes.success)
        return error("Unable to upadte user data!\n", updateRes.message);
    
    await update({
        user: {
            name: payload.name || user.name,
            isTwoFactorEnabled: payload.isTwoFactorEnabled !== undefined 
                ? payload.isTwoFactorEnabled 
                : user.isTwoFactorEnabled,
        }
    });

    const successMessage = "Info Updated Successfully!" + (mailMessage ? `\n${mailMessage}` : "");

    return success(successMessage, {
        updated: {
            payload
        }
    });
};