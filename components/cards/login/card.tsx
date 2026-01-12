"use client";

import { useState } from "react";
import { CardWrapper, LoginForm, Social } from "@/components/index";
import routes from "@/lib/routes";

const LoginCard = () => {
    const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

    return (
        <CardWrapper
            title="Authorization"
            label="Welcome back!"
            backButtonLabel="Don't have an account" 
            backButtonHRef={routes.register}
            footerChildren={!showTwoFactor && <Social/>}
        >
            <LoginForm showTwoFactor={showTwoFactor} setShowTwoFactor={setShowTwoFactor}/>
        </CardWrapper>
    );
};

export default LoginCard;