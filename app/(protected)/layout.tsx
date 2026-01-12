import Navbar from "@/app/(protected)/_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode
};

const ProtectedLayout = ({ children } : ProtectedLayoutProps) => {
    return (
        <div className="flex flex-col h-screen w-full items-center align-center bg-sky-400 gap-y-10 pt-5">
            <Navbar/>
            {children}
        </div>
    );
};

export default ProtectedLayout;