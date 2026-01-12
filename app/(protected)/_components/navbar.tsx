"use client";

import NavbarButton from "@/app/(protected)/_components/navbar-button";
import UserButton from "@/components/common/buttons/user-button";
import { protectedRoutes } from "@/lib/routes";

const Navbar = () => {
    return (
        <nav className="flex bg-secondary justify-between items-center rounded-xl shadow-sm p-4 w-[600px]">
            <div className="flex gap-x-2">
                <NavbarButton label="Server Profile" hRef={protectedRoutes.serverProfile}/>
                <NavbarButton label="Client Profile" hRef={protectedRoutes.clientProfile}/>
                <NavbarButton label="Settings" hRef={protectedRoutes.settings}/>
            </div>
            <UserButton/>
        </nav>
    );
};

export default Navbar;