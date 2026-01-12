import FormCheckbox from "@/components/forms/common/form-checkbox";
import FormInput from "@/components/forms/common/form-input"
import { SettingsSchemaType } from "@/schemas/settings";
import { useFormContext } from "react-hook-form";

interface CredentialsFieldsProps {
    isPending?: boolean,
    isCredentials: boolean
};

const CredentialsFields = ({ isPending = false, isCredentials }: CredentialsFieldsProps) => {
    const { control } = useFormContext<SettingsSchemaType>();

    if (!isCredentials)
        return null;

    return (
        <>
            <FormInput control={control} name="email" label="Email" placeholder="mail@example.com" type="email" disabled={isPending}/>
            <FormInput control={control} name="password" label="Password" placeholder="password" type="password" disabled={isPending}/>
            <FormInput control={control} name="repeatPassword" label="Repeat Password" placeholder="repeat password" type="password" disabled={isPending}/>
            <FormCheckbox control={control} name={"isTwoFactorEnabled"} label="Two Factor Authentication" disabled={isPending}/>
        </>
    );
};

export default CredentialsFields;