"use client";

import SettingsCard from "@/components/cards/settings/card";
import { useCurrentUser } from "@/hooks/hooks";

const SettingsPage = () => {
    const currentUser = useCurrentUser();


    return (
        <SettingsCard key={currentUser?.id}/>
    );
};

export default SettingsPage;