"use server";

import UserInfoCard from "@/components/cards/user-info/card";
import { getSessionUser } from "@/lib/auth";

const ServerProfilePage = async () => {
    const currentUser = await getSessionUser();

    return (
        <div className="flex flex-col items-center justify-center space-y-5 w-[400px] rounded-xl shadow-sm">
            <UserInfoCard title="Server Profile Info" user={currentUser}/>
        </div>
    );
};

export default ServerProfilePage;