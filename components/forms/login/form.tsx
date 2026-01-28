"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { useRouter, useSearchParams } from "next/navigation";

import { LoginSchema, type LoginSchemaType } from "@/schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FromSuccess, FromError } from "@/components/index";

import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { credentialsLogin } from "@/lib/services/server-auth-service";

import TwoFactorField from "@/components/forms/login/two-factor-field";
import LoginFields from "@/components/forms/login/base-fields";

interface LoginFormProps {
    showTwoFactor: boolean,
    setShowTwoFactor: (value: boolean) => void;
};

export const LoginForm = ({ showTwoFactor, setShowTwoFactor } : LoginFormProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { update } = useSession();

    const OAuthError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email is already used by different provider!" : ""; 

    const [error, setError] = useState<string | undefined>(OAuthError);
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<LoginSchemaType>({ 
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values : LoginSchemaType) => {
        setError("");
        setSuccess("");

        const result = await credentialsLogin(values);

        if (result.success && !result.data?.twoFactor) {
            form.reset();
            setSuccess(result.message);

            await update();

            router.refresh();
            router.push(result.data?.redirectUrl || DEFAULT_LOGIN_REDIRECT);

            return;
        }

        setShowTwoFactor(result.data?.twoFactor || false);

        if (result.success)
            setSuccess(result.message)
        else
            setError(result.message);
    };

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    {showTwoFactor ? <TwoFactorField/> : <LoginFields/>}
                </div>
                
                <FromError message={error}/>
                <FromSuccess message={success}/>
                <Button
                    className="w-full"   
                    type="submit"
                >
                    {showTwoFactor ? "Confirm" : "Login"}
                </Button>
            </form>
        </Form>
    );
};