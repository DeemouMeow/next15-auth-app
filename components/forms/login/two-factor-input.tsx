import { forwardRef, ComponentPropsWithoutRef } from "react";
import { 
    InputOTP, 
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator 
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

type TwoFactorInputProps = Omit<ComponentPropsWithoutRef<typeof InputOTP>, "render">;

const TwoFactorInput = forwardRef<HTMLInputElement, TwoFactorInputProps>(({ maxLength = 6, ...props }, ref) => {
    return (
        <InputOTP 
            maxLength={maxLength}
            pattern={REGEXP_ONLY_DIGITS} 
            ref={ref} 
            {...props}>
            <InputOTPGroup>
                <InputOTPSlot index={0}/>
                <InputOTPSlot index={1}/>
                <InputOTPSlot index={2}/>
            </InputOTPGroup>
            <InputOTPSeparator/>
            <InputOTPGroup>
                <InputOTPSlot index={3}/>
                <InputOTPSlot index={4}/>
                <InputOTPSlot index={5}/>
            </InputOTPGroup>
        </InputOTP>
    );
});

TwoFactorInput.displayName = "Two Factor Confirmation";

export default TwoFactorInput;