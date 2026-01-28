"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { FromSuccess, FromError } from "@/components/index";
import { Button } from "@/components/ui/button";

import resetPassword from "@/lib/services/reset-password-sevice";

import { PasswordResetSchema, PasswordResetSchemaType } from "@/schemas/password-reset";
import FormInput from "@/components/forms/common/form-input";

interface PasswordRecoveryFormProps {
    resetToken: string
};

const PasswordRecoveryForm = ({ resetToken }: PasswordRecoveryFormProps) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<PasswordResetSchemaType>({ 
        resolver: zodResolver(PasswordResetSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (values : PasswordResetSchemaType) => {
        setError("");
        setSuccess("");
        
        resetPassword(resetToken || "", values.confirmPassword)
            .then(data => {
                if (data.success)
                    setSuccess(data.message) 
                else 
                    setError(data.message);
            })
            .catch(() => setError("Unable to reset password!"));
    };

    if (!resetToken)
        return <FromError message={"Invalid link!"}/>

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <FormInput control={form.control} name="password" label="New Password" placeholder="new password" type="password"/>
                    <FormInput control={form.control} name="confirmPassword" label="Repeat New Password" placeholder="repeat new password" type="password"/>
                </div>
                
                <FromError message={error}/>
                <FromSuccess message={success}/>

                <Button
                    className="w-full"   
                    type="submit"
                >
                    Reset
                </Button>
            </form>
        </Form> 
    );
}

export default PasswordRecoveryForm;