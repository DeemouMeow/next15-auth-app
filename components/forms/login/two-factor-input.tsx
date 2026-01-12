import { forwardRef } from "react";
import { 
    InputOTP, 
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator 
} from "@/components/ui/input-otp";

const TwoFactorInput = forwardRef<HTMLInputElement, any>((props, ref) => {
    return (
        <InputOTP maxLength={6} ref={ref} {...props}>
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