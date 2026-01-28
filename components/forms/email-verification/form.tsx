"use client";

import { useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleLoader } from "react-spinners";
import { authRoutes } from "@/lib/routes";
import { verifyEmailVerificationToken } from "@/lib/services/verification-service";
import { CardWrapper, FromError, FromSuccess } from "@/components/index";
import { useSession } from "next-auth/react";

const EmailVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(async () => {
        if (!token) {
            setError("No token founded!");

            return;
        }

        const verificationRes = await verifyEmailVerificationToken(token);
            // .then(data => {
            //     if (data.success) {
            //         setSuccess(data.message) 

            //     }
            //     else 
            //         setError(data.message);
            // })
            // .catch((reason) => {
            //     setError(reason);
            // });

        if (verificationRes.success) {
            setSuccess(verificationRes.message);

            await update();
        }
        else
            setError(verificationRes.message);
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

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