import { prisma } from "@/lib/db";
import { TwoFactorConfirmation } from "@prisma/client";

export const generateConfirmation = async (userId: string) => {
    try {
        await tryDeleteExistingConfirmationByUserID(userId);

        await prisma.twoFactorConfirmation.create({
            data: {
                userId
            }
        });
    } catch (error) {
        throw error;
    }
}

export const getConfirmationByUserId = async (userId: string) : Promise<TwoFactorConfirmation | null> => {
    try {
        const dbConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: { userId }
        });

        return dbConfirmation;
    } catch {
        return null;
    }
}

export const tryDeleteExistingConfirmationByUserID = async (id: string) : Promise<boolean> => {
    try {
        await prisma.twoFactorConfirmation.delete({
            where: {
                userId: id
            }
        });

        return true;
    } catch (error) {
        console.error("[Two Factor Service]: tryDeleteExistingConfirmationByUserId error");

        return false;
    }
}

export const tryDeleteExistingConfirmationByID = async (id: string) : Promise<boolean> => {
    try {
        await prisma.twoFactorConfirmation.delete({
            where: {
                id
            }
        });
        
        return true;
    } catch (error) {
        console.error("[Two Factor Service]: tryDeleteExistingConfirmationByID error");

        return false;
    }

}