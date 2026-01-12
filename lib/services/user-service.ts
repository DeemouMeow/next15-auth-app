import { type DatabaseUser } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { error, success } from "@/lib/utils";

export interface UserCreationParams
{
    name: string,
    password: string,
    email: string
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
                user: candidate as DatabaseUser
            });
        } 
        catch 
        {
            return error("User not found by email!", {
                user: null
            })
        }
    }

    public static async updateUserByID(id: string, data: any) {
        try {
            const finalPayload = { ...data };

            if (data.password) 
            {
                const hashedPassword = await UserService.hashPassword(data.password)

                finalPayload.password = hashedPassword;
            }

            if (data.email) {
                const hasCandidate = !!(await UserService.getUserByEmail(data.email)).data?.user;

                if (hasCandidate)
                    return error("Email is already in use!");

                finalPayload.emailVerified = null;
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: finalPayload
            });

            return success("User updated successfully!", {
                user: updatedUser
            });
        }
        catch (err)
        {
            return error("Error occured while updating user!");
        }
    }

    public static async updateUserByEmail(email: string, data: any) 
    {
        try {
            const finalPayload = { ...data };

            if (data.password) 
            {
                const hashedPassword = await UserService.hashPassword(data.password)
                
                finalPayload.password = hashedPassword;
            }

            const updatedUser = await prisma.user.update({
                where: { email },
                data: finalPayload
            });

            return success("User data Updated!", {
                user: updatedUser
            });
        }
        catch (err)
        {
            return error("Error occured while updating user!");
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

    private static async hashPassword(password: string)
    {
        const hashedPassword = await bcrypt.hash(password, UserService._hashSaltRounds);

        return hashedPassword;
    }
}