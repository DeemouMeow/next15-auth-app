"use client";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface HeaderProps {
    title: string,
    label: string,
};

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

export const Header : FC<HeaderProps> = ({ label = "", title = "" }) => {
    const h1ClassName = cn("text-3xl font-semibold drop-shadow-md", font.className);

    return (
        <div className="flex flex-col gap-y-4 w-full items-center justify-center">
            <h1 className={h1ClassName}>
                {title}
            </h1>
            <p className="text-muted-foreground text-sm">
                {label}
            </p>
        </div>
    );
}