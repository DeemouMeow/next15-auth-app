import { CardWrapper } from "@/components/index";
import { authRoutes } from "@/lib/routes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const AuthErrorPage = () => {
    return (
        <CardWrapper 
            title="Authorization Error" 
            label="Something went wrong while authorization!" 
            backButtonLabel="Return to log in page" 
            backButtonHRef={authRoutes.login}>
            <div className="w-full flex justify-center items-center text-destructive">
                <ExclamationTriangleIcon/>
            </div>
        </CardWrapper>
    );
}

export default AuthErrorPage;