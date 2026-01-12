"use client";

import SettingsForm from "@/components/forms/settings/form";
import { CardWrapper } from "@/components/index";

const SettingsCard = () => {
    return (
        <CardWrapper
            title="Settings"
            label=""
        >
            <SettingsForm/>
        </CardWrapper>
    );
};

export default SettingsCard;