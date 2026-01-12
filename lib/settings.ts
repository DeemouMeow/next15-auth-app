"use server";

import { update } from "@/auth";
import { getSessionUser } from "@/lib/auth";
import UserService from "@/lib/services/user-service";
import { type SettingsSchemaType } from "@/schemas/settings";
import { success, error } from "@/lib/utils";
import { sendVerificationEmail } from "./mail";
import TokenService from "./services/token-servise";

export const settings = async (values: SettingsSchemaType) => {
    const user = await getSessionUser();

    if (!user)
        return error("Unauthorized");
    
    const payload: any = { };

    Object.keys(values).forEach(key  => {
        const typedSettingsKey = key as keyof SettingsSchemaType;
        const typedUserKey = key as keyof typeof user;

        const settingsValue = values[typedSettingsKey];
        const userValue = user[typedUserKey];
        
        if (typedSettingsKey === "repeatPassword")
            return;

        if (typedSettingsKey === "password") {
            if (!user.isOAuth && settingsValue) {
                payload[typedSettingsKey] = settingsValue;
            }
        }

        const updateCondition = userValue !== undefined && userValue !== settingsValue;

        if (updateCondition) {
            payload[typedSettingsKey] = settingsValue;
        }
    });

    if (Object.keys(payload).length === 0)
        return success("You have change nothing!");

    const res = await UserService.updateUserByID(user.id, payload);

    if (!res.success) {
        return error(res.message);
    }

    const { password, ...sessionUpdate } = payload;

    await update({
        user: {
            ...sessionUpdate
        }
    });

    if (sessionUpdate.email) {
        const email = sessionUpdate.email;

        const tokenGenerationRes = await TokenService.generateToken("verification", email);
        const generationData = tokenGenerationRes.data;

        if (!tokenGenerationRes.success || !generationData)
            return error(tokenGenerationRes.message);

        await sendVerificationEmail(sessionUpdate.email, generationData.raw || "");

        return success("Verification Mail was sent to your mailbox!", {
            updated: {
                ...sessionUpdate
            }
        });
    }

    return success("Info Updated Successfully!", {
        updated: {
            ...sessionUpdate
        }
    });
}