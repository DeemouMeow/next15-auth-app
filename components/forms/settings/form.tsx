"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/forms/common/form-input";
import FormCheckbox from "@/components/forms/common/form-checkbox";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "@/lib/settings";
import { SettingsSchema, SettingsSchemaType } from "@/schemas/settings";
import { FromSuccess, FromError } from "@/components/index";
import CredentialsFields from "@/components/forms/settings/credentials-fields";

const SettingsForm = () => {
    const { data: session, update } = useSession();
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<string>();
    const router = useRouter();
    
    const user = session?.user;
    const isOAuth = user?.isOAuth || false;

    const form = useForm<SettingsSchemaType>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            isTwoFactorEnabled: !!user?.isTwoFactorEnabled,
            password: "",
            repeatPassword: "",
        }
    });

    const onClick = (values: SettingsSchemaType) => {
        startTransition(async () => {
            setSuccess("");
            setError("");

            const res = await settings(values);

            if (res.success) {
                await update();

                router.refresh() 

                form.resetField("password")
                form.resetField("repeatPassword");
            }

            res.success ? setSuccess(res.message) : setError(res.message);
        });
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onClick)} className="space-y-6">
                <div className="space-y-4">
                    <FormInput control={form.control} name="name" label="Name" placeholder="name" disabled={isPending}/>
                    <CredentialsFields isCredentials={!isOAuth} isPending={isPending}/>
                </div>
                
                <FromSuccess message={success}/>
                <FromError message={error}/>

                <Button disabled={isPending} type="submit">
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
};

export default SettingsForm;