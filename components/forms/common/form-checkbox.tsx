import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    disabled: boolean;
};

const FormCheckbox = <T extends FieldValues>({ 
    control, 
    name, 
    label, 
    disabled 
}: FormCheckboxProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

    );
};

export default FormCheckbox;