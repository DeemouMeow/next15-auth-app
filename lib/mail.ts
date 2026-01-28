"use server";

import { Resend } from "resend";

import UserService from "@/lib/services/user-service";
import TokenService from "@/lib/services/token-servise";

import { generateConfirmationLink, generateResetLink, generateSettingsUpdateConfirmationLink } from "@/lib/routes";
import { success, error } from "@/lib/utils";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string = "") => {
    if (!token || token.length === 0) {
        const generationRes = await TokenService.generateToken("EMAIL_VERIFICATION", email);
        const generationData = generationRes.data;

        if (!generationData)
            return error(generationRes.message);

        token = generationData.raw || "";
    }

    if (token.length === 0)
        return error("Unable to sent empty token!");

    const confirmationLink = generateConfirmationLink(token);

    const mailSendResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email!",
        html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email!</p>`
    });

    if (mailSendResult.error)
        return { success: false, message: "Verification email sending error!" };
    
    return success("Verification email was sent to your mailbox!");
};

export const sendPasswordResetEmail = async (email: string) => {
    const { data: userData } = await UserService.getUserByEmail(email);
    const existingUser = userData?.user;

    if (!existingUser)
        return error("Email does not registered!");

    const { data: tokenData } = await TokenService.generateToken("PASSWORD_RESET", email);
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
        const { data } = await TokenService.generateToken("TWO_FACTOR_AUTH", email);
        const raw = data?.raw || "";

        console.log({ data });

        if (!raw)
            return error("2FA Code sending error!");

        code = raw;
    }

    console.log("2FA code", code);

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

export const generateEmailChangeRequest = async (userId: string, oldEmail: string, newEmail: string) => {
    try {
        const existingRequestGetRes = await getEmailChangeRequest(userId);
        const existingRequest = existingRequestGetRes.data?.request;

        if (existingRequest) {
            await deleteEmailChangeRequest(userId);
        }

        const hourMs = 3600 * 1000;
        const expires = new Date(Date.now() + hourMs);

        const request = await prisma.emailChangeRequest.create({
            data: {
                user_id: userId,
                old_email: oldEmail,
                new_email: newEmail,
                expires_at: expires
            }
        });

        return success("Request created!", {
            request
        })
    } catch {
        return error("Unable to create request");
    }
}

export const getEmailChangeRequest = async (userId: string) => {
    try {
        const emailRequest = await prisma.emailChangeRequest.findFirst({
            where: {
                user_id: userId
            }
        });

        return success("EmailChangeRequest found!", {
            request: emailRequest
        });
    } catch (e) {
        console.error("mail::getEmailChangeRequest error:", e);
        return error("Have no requests to change/verify email");
    }
};

export const getEmailChangeRequestByEmail = async (newEmail: string) => {
    try {
        const emailRequest = await prisma.emailChangeRequest.findFirst({
            where: {
                new_email: newEmail
            }
        });

        return success("EmailChangeRequest found!", {
            request: emailRequest
        });
    } catch (e) {
        console.error("mail::getEmailChangeRequest error:", e);
        return error("Have no requests to change/verify email");
    }
};

export const deleteEmailChangeRequest = async (userId: string) => {
    try {
        await prisma.emailChangeRequest.deleteMany({
                where: {
                    user_id: userId
                }
            });
        
        return success("");
    } catch {
        return error("Unable to delete email change request!");
    }
}