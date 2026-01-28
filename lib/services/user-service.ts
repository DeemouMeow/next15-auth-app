import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { error, success } from "@/lib/utils";
import { UserCreationParams, UserFullUpdateInput } from "@/lib/services/types/user";

function normalizeUpdatePayload<T extends object>(data: T) : Partial<T> {
    const accumulator: Partial<T> = {};

    const normalized = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== null && value !== "")
            return { ...acc, [key]: value };
        
        return acc;
    }, accumulator);

    return normalized;
};

export default class UserService 
{
    private static _hashSaltRounds = 10;

    public static async createUser(data: UserCreationParams, isPasswordHashed: boolean = false)
    {
        try 
        {
            const { name, email, password } = data;

            const { data: candidateData } = await UserService.getUserByEmail(email);

            if (candidateData?.user)
                return error("Email is already in use!");

            const hashedPassword = isPasswordHashed ? password : await this.hashPassword(password);

            const user = await prisma.user.create(
                {
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                    }
                });
            
            return success("", {
                user
            });
        }
        catch 
        {   
            return error("User creation error occur!");
        }
    }
    
    public static async getUserAccontByUserID(id: string) {
        try {
            const account = await prisma.account.findFirst({
                where: {
                    userId: id
                }
            });

            return success("User Accont not founded!", {
                account
            });
        } catch {
            return error("User Accont not founded!");
        }
    }

    public static async getUserById(id: string)
    {
        try 
        {
            const candidate = await prisma.user.findUnique({
                where: {
                    id,
                }
            });

            return success("User found by email!", {
                user: candidate
            });
        } 
        catch 
        {
            return error("User not found by email!", {
                user: null
            })
        }
    }

    public static async getUserByEmail(email: string)
    {
        try 
        {
            const candidate = await prisma.user.findUnique({
                where: {
                    email,
                }
            });

            return success("User found by email!", {
                user: candidate
            });
        } 
        catch 
        {
            return error("User not found by email!", {
                user: null
            })
        }
    }

    public static async updateUser(email: string, data: UserFullUpdateInput, dataEmailChecked: boolean = false) {
        try {
            const normalized = normalizeUpdatePayload(data);

            if (normalized.email && typeof normalized.email === "string") {
                const emailVerified = data.emailVerified;

                normalized.emailVerified = emailVerified 
                    && (emailVerified instanceof Date 
                    || typeof emailVerified === "string") ? data.emailVerified : null;
            }

            if (normalized.password && typeof normalized.password === "string")
            {
                const unhashed = normalized.password;
                const hashed = await UserService.hashPassword(unhashed);

                normalized.password = hashed;
            }

            const updated = await prisma.user.update({
                where: { email },
                data: normalized
            });

            return success("User updated successfully!", {
                user: updated
            });
        } catch {
            return error("User update failed!");
        }
    }

    public static async validateUserCredentials(userEmail: string, password: string)
    {
        try 
        {
            const { data } = await UserService.getUserByEmail(userEmail);
            const candidate = data?.user;

            if (!candidate)
                return error("Email isn't in use!");

            if (!candidate.password)
                return error("Unable to find user creadentials! Please, try to login another way!");

            const isPasswordsEquals = await bcrypt.compare(password, candidate.password);

            if (isPasswordsEquals)
                return success("Success validation!", { user: candidate });
            else 
                return error("Invalid password!");
        }
        catch
        {
            return error("Validation error occured!");
        }
    }

    public static async comparePassword(email: string, password: string) {
        if (!email)
            return error("Email is not provided");
        
        const res = await UserService.getUserByEmail(email);

        if (!res.success || !res?.data?.user?.password)
            return error(res.message);

        const hashed = res.data.user.password;
        const compareRes = await bcrypt.compare(password, hashed);

        if (compareRes)
            return success("Passwords match!");
        else
            return error("Pusswords do not match!");
    }

    private static async hashPassword(password: string)
    {
        const hashedPassword = await bcrypt.hash(password, UserService._hashSaltRounds);

        return hashedPassword;
    }
}