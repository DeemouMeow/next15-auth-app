"use client";

import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleLoader } from "react-spinners";
import { authRoutes } from "@/lib/routes";
import { verifyEmailVerificationToken } from "@/lib/services/verification-service";
import { CardWrapper, FromError, FromSuccess } from "@/components/index";

const EmailVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("No token founded!");

            return;
        }

        verifyEmailVerificationToken(token)
            .then(data => {
                data.success ? setSuccess(data.message) : setError(data.message);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, []);

    return (
        <CardWrapper
            title="Confirm your email"
            label="Just to be protected!"
            backButtonLabel="Back to login"
            backButtonHRef={authRoutes.login}
        >
            <div className="flex items-center justify-center w-full">
                {
                    !success && !error && <CircleLoader/>
                }
            </div>

            <FromError message={error}/>
            <FromSuccess message={success}/>
        </CardWrapper>
    );
}

export default EmailVerificationForm;