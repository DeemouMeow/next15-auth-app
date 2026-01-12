interface UserInfoCardItemProps {
    name: string;
    info?: string;
}

const UserInfoCardItem = ({ name, info }: UserInfoCardItemProps) => {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
            <p className="text-sm font-medium">
                {name}
            </p>
            <p className="truncate">
                {info || "Info does not provided"}
            </p>
        </div>
    );
};

export default UserInfoCardItem;