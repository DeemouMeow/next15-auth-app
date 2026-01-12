"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";
import LogoutButton from "@/components/common/buttons/logout-button";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/hooks";

const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""}/>
                    <AvatarFallback className="bg-sky-400">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40" align="end">
                <LogoutButton>
                    <DropdownMenuItem>
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;