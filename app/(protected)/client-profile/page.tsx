"use client";

import UserInfoCard from "@/components/cards/user-info/card";
import { useCurrentUser } from "@/hooks/hooks";

const ClientProfilePage = () => {
    const currentUser = useCurrentUser()

    return (
        <div className="flex flex-col items-center justify-center space-y-5 w-[400px] rounded-xl shadow-sm">
            <UserInfoCard title="Client Profile Info" user={currentUser}/>
        </div>
    );
};

export default ClientProfilePage;