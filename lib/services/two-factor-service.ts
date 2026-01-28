import { prisma } from "@/lib/db";
import { TwoFactorConfirmation } from "@prisma/client";
import { getOperationFunctions } from "@/lib/utils";

const { success, error } = getOperationFunctions<{
    confirmation?: TwoFactorConfirmation
}>();

export const generateConfirmation = async (userId: string) => {
    try {
        await tryDeleteExistingConfirmationByUserID(userId);

        const res = await prisma.twoFactorConfirmation.create({
            data: {
                userId
            }
        });

        return success("Confirmation created successfully!", {
            confirmation: res
        });
    } catch {
        error("Error occured while generating two factor confirmation!");
    }
}

export const tryDeleteExistingConfirmationByUserID = async (id: string) => {
    try {
        await prisma.twoFactorConfirmation.delete({
            where: {
                userId: id
            }
        });

        return success("Successfully deleting two factor confirmation!");
    } catch {
        return error("Error while deleting two factor confirmation!");
    }
}