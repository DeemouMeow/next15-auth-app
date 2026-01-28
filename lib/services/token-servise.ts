import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getOperationFunctions } from "@/lib/utils";
import { VerificationToken, TokenType, Prisma } from "@prisma/client";

const { success, error } = getOperationFunctions<{ 
    token: VerificationToken,
    raw?: string,
}>();

export default class TokenService {
    private static TWO_FACTOR_TOKEN_LIFETIME_MIN = 5;
    private static TOKEN_LIFETIME_MIN = 60;

    public static async generateToken(
        type: TokenType, 
        email: string, 
        payload: Record<string, unknown> | null = null) {
            try {
                const existingToken = await this.getTokenByEmail(type, email);

                if (existingToken.data?.token)
                    await prisma.verificationToken.deleteMany({
                        where: { email, type }
                    });
                
                const { raw, encrypted } = this.generateTokenValues(type);
                const expires = this.generateExpiresTime(type);
                const dbToken = await prisma.verificationToken.create({
                    data: {
                        email,
                        token: encrypted,
                        expires,
                        type,
                        payload: payload as Prisma.InputJsonValue
                    }
                });

                console.log("Token generation", { raw, encrypted, expires });

                return success("Token created", {
                    token: dbToken,
                    raw
                });
            } catch(e) {
                console.error(`FULL ERROR: ${e}`);
                return error("Failed to generate token");
            }
    }

    public static async getTokenByEmail(type: TokenType, email: string) {
        try {
            const dbToken = await prisma.verificationToken
                .findFirst({ where: { type, email }});

            if (!dbToken || dbToken.type !== type)
                return error("Token not found!");

            return success("Token found by email!", {
                token: dbToken,
            });
        } catch {
            return error("Token not founded!");
        }
    }

    public static async getTokenByValue(type: TokenType, value: string) {
        try {
            const isTwoFactor = type === "TWO_FACTOR_AUTH";

            const searchValue = isTwoFactor 
                ? crypto.createHash("sha256").update(value).digest("hex") 
                : value;
                
            const dbToken = await prisma.verificationToken.findUnique({
                where: { token: searchValue }
            });

            if (!dbToken || dbToken.type !== type)
                return error("Token not found");

            return success("Token founded by value!", {
                token: dbToken,
                raw: value
            });
        } catch {
            return error("Token lookup error!");
        }
    }

    public static async deleteToken(id: string) {
        try {
            await prisma.verificationToken.delete({
                where: {
                    id
                }
            });

            return success(`${id} token deleted successfully`);
        } catch {
            return error(`${id} token deletion error`);
        }
    }

    public static isExpired(expires: Date) : boolean {
        return new Date(expires) < new Date();
    }

    private static generateExpiresTime(type: TokenType) : Date {
        const isTwoFactor = type === "TWO_FACTOR_AUTH";
        const ms_in_minute = 60 * 1000;

        const min = isTwoFactor ? this.TWO_FACTOR_TOKEN_LIFETIME_MIN : this.TOKEN_LIFETIME_MIN;
        const ms = min * ms_in_minute;

        return new Date(Date.now() + ms);
    }

    private static generateTokenValues(type: TokenType) : { raw: string, encrypted: string } {
        const isTwoFactor = type === "TWO_FACTOR_AUTH";

        const raw = isTwoFactor 
            ? crypto.randomInt(100_000, 1_000_000).toString() 
            : uuidv4();

        const encrypted = isTwoFactor 
            ? crypto.createHash("sha256").update(raw).digest("hex") 
            : raw;

        return { raw, encrypted };
    }
}