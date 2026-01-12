"use server";

import { Resend } from "resend";

import UserService from "@/lib/services/user-service";
import TokenService from "@/lib/services/token-servise";

import { generateConfirmationLink, generateResetLink } from "@/lib/routes";
import { getOperationFunctions } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

const { success, error } = getOperationFunctions();

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = generateConfirmationLink(token);

    const mailSendResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email!",
        html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email!</p>`
    });

    if (mailSendResult.error)
        return { success: false, message: "Verification email sending error!" };
    
    return success("Verification email were sent to your mailbox!");
};

export const sentPasswordResetEmail = async (email: string) => {
    const { data: userData } = await UserService.getUserByEmail(email);
    const existingUser = userData?.user;

    if (!existingUser)
        return error("Email does not registered!");

    const { data: tokenData } = await TokenService.generateToken("reset", email);
    const raw = tokenData ? tokenData.raw : undefined;

    if (!raw) {
        return error("Something went wrong on reset token generation");
    }

    const resetLink = generateResetLink(raw);

    const mailSendResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`
    });

    if (mailSendResult.error)
        return error("Reset email sending error!");
    
    return success("Instrunctions were sent to your mailbox!");
};

export const send2FAMail = async (email: string, code: string = "") => {
    if (code.length == 0) {
        const { data } = await TokenService.generateToken("twoFactor", email);
        const raw = data?.raw || "";

        if (!raw)
            return error("2FA Code sending error!");

        code = raw;
    }

    if (code.length == 0)
        return error("Unable to sent empty code!");

    const mailSendResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2 FA Code",
        html: `<p>Your 2FA Code: ${code}</p>`
    });

    if (mailSendResult.error)
        return error("2FA Code sending error!");
    
    return success("2FA Code sending success!");
};