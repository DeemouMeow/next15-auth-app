import { auth } from "@/auth"

export const getSessionUser = async () => {
    const session = await auth();

    return session?.user;
}