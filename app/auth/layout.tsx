interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({ children } : AuthLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-sky-500">
            {children}
        </div>
    );
};

export default AuthLayout;