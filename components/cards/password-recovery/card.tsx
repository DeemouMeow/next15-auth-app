"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper} from "@/components/index";
import routes from "@/lib/routes";
import PasswordRecoveryForm from "@/components/forms/password-recovery/form";

const PasswordRecoveryCard = () => {
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("reset-token");

    return (
        <CardWrapper
            title="Reset your password"
            label=""
            backButtonLabel="Back to login page"
            backButtonHRef={routes.login}
        >
            <PasswordRecoveryForm resetToken={resetToken || ""}/>
        </CardWrapper>
    );
}

export default PasswordRecoveryCard;