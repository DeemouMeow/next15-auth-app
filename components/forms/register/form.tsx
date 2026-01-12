"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema, type RegisterSchemaType } from "@/schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FromSuccess, FromError } from "@/components/index";
import { register } from "@/lib/services/server-auth-service";
import FormInput from "@/components/forms/common/form-input";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<RegisterSchemaType>({ 
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = (values : RegisterSchemaType) => {
        setError("");
        setSuccess("");

        register(values)
            .then(data => data.success 
                ? setSuccess(data.message) 
                : setError(data.message)
            );
    };

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <FormInput control={form.control} name="username" label="Username" placeholder="username"/>
                    <FormInput control={form.control} name="email" label="Email" placeholder="mail@example.com" type="email"/>
                    <FormInput control={form.control} name="password" label="Password" placeholder="password" type="password"/>
                </div>

                <FromError message={error}/>
                <FromSuccess message={success}/>
                
                <Button
                    className="w-full"   
                    type="submit"
                >
                    Register Now
                </Button>
            </form>
        </Form>
    );
};