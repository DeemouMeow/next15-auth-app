import { SessionUser } from "next-auth";
import UserInfoCardItem from "@/components/cards/user-info/card-item";
import { CardWrapper } from "@/components/index";

interface UserInfoCardProps 
{
    user?: SessionUser,
    title?: string,
    label?: string
}

const UserInfoCard = ({ user, title, label } : UserInfoCardProps) => {
    return (
        <CardWrapper title={title || ""} label={label || ""}>
            <div className="space-y-4">
                <UserInfoCardItem name="Name" info={user?.name || ""}/>
                <UserInfoCardItem name="Email" info={user?.email || ""}/>
                <UserInfoCardItem name="Role" info={user?.role}/>
                <UserInfoCardItem name="ID" info={user?.id}/>
                <UserInfoCardItem name="Two Factor" info={user?.isTwoFactorEnabled ? "On" : "Off"}/>
            </div>
        </CardWrapper>
    );
}

export default UserInfoCard;