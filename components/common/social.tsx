"use client";

import React, { FC } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export const Social : FC = () => {
    const onClick = async (provider: "google" | "github") => {
        signIn(provider, {
            redirect: true,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                className="flex-1"
                size="lg"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <FcGoogle className="w-5 h-5"/>
            </Button>
            <Button
                className="flex-1"
                size="lg"
                variant="outline"
                onClick={() => onClick("github")}
            >
                <FaGithub className="w-5 h-5"/>
            </Button>
        </div>
    );
}