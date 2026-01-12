"use client";

import { Dialog, DialogContent, 
         DialogTrigger, DialogHeader, 
         DialogTitle, DialogDescription, 
         DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FromSuccess } from "@/components/form-messages/form-success";
import { FromError } from "@/components/form-messages/form-error";

import { sentPasswordResetEmail } from "@/lib/mail";

import { useState } from "react";

const ForgotPasswordModal = () => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const onEmailSendClicked = () => {
        setSuccess("");
        setError("");

        sentPasswordResetEmail(email)
            .then(data => {
                data.success ? setSuccess(data.message) : setError(data.message);
            })
            .catch(() => {
                setError("Unable to sent email! Check provided email address");
            })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link">Fogot password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Password Recovery</DialogTitle>
                    <DialogDescription>
                        Enter your account email
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="email"
                            placeholder="mail@example.com"
                            onChange={event => setEmail(event.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <FromSuccess message={success}/>
                    <FromError message={error}/>
                </DialogFooter>
                <DialogFooter className="sm:justify-start">
                    
                    <Button type="button" variant="default" onClick={() => onEmailSendClicked()}>
                        Send Email
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ForgotPasswordModal;