"use client";

import { CardWrapper, RegisterForm, Social } from "@/components/index";
import routes from "@/lib/routes";

const RegisterCard = () => {
    return (
        <CardWrapper
            title="Registration"
            label="Create new account"
            backButtonLabel="Already have an account?" 
            backButtonHRef={routes.login}
            footerChildren={<Social/>}
        >
            <RegisterForm/>
        </CardWrapper>
    );
};

export default RegisterCard;