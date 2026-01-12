import { useFormContext } from "react-hook-form";

import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import TwoFactorInput from "@/components/forms/login/two-factor-input";
import { LoginSchemaType } from "@/schemas";

const TwoFactorField = () => {
    const { control } = useFormContext<LoginSchemaType>()


    return (
        <FormField
            control={control}
            name="code"
            render={
                ({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center gap-y-4">
                        <FormLabel>Two Factor Code</FormLabel>
                        <FormControl>
                            <TwoFactorInput {...field}/>
                        </FormControl>
                    </FormItem>
                )
            }
        />
    );
};

export default TwoFactorField;