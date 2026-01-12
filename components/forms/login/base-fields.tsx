import { useFormContext } from "react-hook-form";
import ForgotPasswordModal from "@/components/modals/forgot-password-modal";
import { LoginSchemaType } from "@/schemas";
import FormInput from "@/components/forms/common/form-input";

const FormFields = () => {
    const { control } = useFormContext<LoginSchemaType>();

    return (
        <>
            <FormInput control={control} name="email" label="Email" placeholder="mail@example.com" type="email"/>
            <FormInput control={control} name="password" label="Password" placeholder="password" type="password"/>
            
            <ForgotPasswordModal/>
        </>
    );
};

export default FormFields;