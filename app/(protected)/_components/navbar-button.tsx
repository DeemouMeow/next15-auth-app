"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarButtonProps {
    label: string,
    hRef: string
};

const NavbarButton = ({ label, hRef } : NavbarButtonProps) => {
    const pathname = usePathname();

    return (
        <Button
            asChild
            variant={pathname == hRef ? "default" : "outline"}
        >
            <Link href={hRef}>{label}</Link>
        </Button>
    );
};

export default NavbarButton;