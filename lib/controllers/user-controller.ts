import { UserSettingsUpdate } from "@/lib/services/types/user";
import UserService from "@/lib/services/user-service";
import { success, error } from "@/lib/utils";

export class UserController {
    public static async updateSettings(email: string, settings: UserSettingsUpdate) {

        const res = await UserService.updateUser(email, {
            name: settings.name,
            password: settings.password
        });

        if (!res.success)
            return error(res.message);

        return success("User updated!", {
            updated: {
                name: settings.name,
            }
        });
    }
};