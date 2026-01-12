"use client";

import routes from "@/lib/routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const LoginButton = () => {
    return (
        <Button variant={"default"} asChild>
            <Link href={routes.login}>Login</Link>
        </Button>
    );
};
