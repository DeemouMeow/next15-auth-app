import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { VerificationToken, ResetToken, TwoFactorToken, Prisma } from "@prisma/client";
import { getOperationFunctions } from "../utils";

interface TokenDelegate {
    create(args: any): Promise<any>,
    findUnique(args: any): Promise<any>,
    findFirst(args: any): Promise<any>,
    delete(args: any): Promise<any>,
    deleteMany(args: any): Promise<Prisma.BatchPayload>,
}

interface TokenMap {
    verification: VerificationToken;
    twoFactor: TwoFactorToken;
    reset: ResetToken;
}

export type TokenType = keyof TokenMap;
export type Token = VerificationToken | ResetToken | TwoFactorToken;

const { success, error } = getOperationFunctions<{ 
    token: TokenMap[TokenType] | null,
    raw?: string,
}>();

export default class TokenService {
    private static TWO_FACTOR_TOKEN_LIFETIME_MIN = 5;
    private static TOKEN_LIFETIME_MIN = 60;

    private static _modelsMap: Record<TokenType, TokenDelegate> = {
        verification: prisma.verificationToken,
        reset: prisma.resetToken,
        twoFactor: prisma.twoFactorToken
    };

    public static async generateToken<T extends TokenType>(type: T, email: string) {
        const model = this.getModel(type);

        try {
            await model.deleteMany({ where: { email } });

            const { raw, encrypted } = TokenService.generateTokenValues(type);
            const expires = TokenService.generateExpiresTime(type);

            const dbToken = await model.create({
                data: { email, token: encrypted, expires }
            });

            return success("", { 
                token: dbToken as TokenMap[T], raw 
            });
        }
        catch {
            return error("Error generating token!");
        }
    }

    public static async getTokenByEmail<T extends TokenType>(type: T, email: string) {
        try {
            const dbToken = await this.getModel(type)
            .findFirst({ where: { email }}) as TokenMap[T] | null;

            return success("Token founded!", {
                token: dbToken,
            });
        } catch {
            return error("Token not founded!", {
                token: null
            });
        }
    }

    public static async getTokenByValue<T extends TokenType>(type: T, value: string) {
        try {
            const isTwoFactor = type === "twoFactor";

            const searchValue = isTwoFactor 
                ? crypto.createHash("sha256").update(value).digest("hex") 
                : value;
                
            const dbToken = await this.getModel(type).findUnique({
                where: { token: searchValue }
            }) as TokenMap[T] | null;

            return success("Token founded by value!", {
                token: dbToken,
                raw: value
            })
        } catch (err) {
            return error("Token not found by value!");
        }
    }

    public static async deleteToken<T extends TokenType>(type: T, id: string) {
        try {
            await this.getModel(type).delete({
                where: {
                    id
                }
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    public static isExpired(expires: Date) : boolean {
        return new Date(expires) < new Date();
    }

    private static getModel(type: TokenType): TokenDelegate {
        return this._modelsMap[type];
    }

    private static generateExpiresTime(type: TokenType) : Date {
        const isTwoFactor = type === "twoFactor";
        const ms_in_minute = 60 * 1000;

        const min = isTwoFactor ? TokenService.TWO_FACTOR_TOKEN_LIFETIME_MIN : TokenService.TOKEN_LIFETIME_MIN;
        const ms = min * ms_in_minute;

        return new Date(Date.now() + ms);
    }

    private static generateTokenValues(type: TokenType) : { raw: string, encrypted: string } {
        const isTwoFactor = type === "twoFactor";

        const raw = isTwoFactor 
            ? crypto.randomInt(100_000, 1_000_000).toString() 
            : uuidv4();

        const encrypted = isTwoFactor 
            ? crypto.createHash("sha256").update(raw).digest("hex") 
            : raw;

        return { raw, encrypted };
    }
}