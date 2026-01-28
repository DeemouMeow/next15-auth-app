import { VerificationToken, Prisma } from "@prisma/client";

export type Token = VerificationToken;
export type TokenCreateArgsType = Prisma.VerificationTokenCreateArgs;

export interface TokenDelegate {
    create(args: TokenCreateArgsType): Promise<Token>,
    findUnique(args: { where: { token: string } }): Promise<Token | null>,
    findFirst(args: { where: { email: string } }): Promise<Token | null>,
    delete(args: { where: { id: string } | { token: string } }): Promise<Token>,
    deleteMany(args: { where: { email: string } }): Promise<Prisma.BatchPayload>,
};