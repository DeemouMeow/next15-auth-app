import { Control, FieldPath, FieldValues } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps<T extends FieldValues> {
    control: Control<T>
    name: FieldPath<T>
    label: string
    type?: string
    placeholder?: string
    disabled?: boolean
};

const FormInput = <T extends FieldValues>({ 
    control, 
    label, 
    name, 
    disabled, 
    placeholder, 
    type = "text" 
}: FormInputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            type={type}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};

export default FormInput;