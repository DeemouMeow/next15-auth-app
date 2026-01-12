import { BackButton } from "@/components/common/buttons/back-button";
import { Header } from "@/components/common/header";
import { 
    Card, 
    CardContent, 
    CardFooter
} from "@/components/ui/card";

interface CardWrapperProps {
    label: string
    title: string
    children: React.ReactNode,
    backButtonLabel?: string,
    backButtonHRef?: string,
    footerChildren?: React.ReactNode
}

const CardWrapper = ({ 
    children,
    footerChildren,
    title, 
    label, 
    backButtonLabel, 
    backButtonHRef 
} : CardWrapperProps) => {

    return (
        <Card className="w-[550px] flex flex-col items-center justify-center rounded-xl shadow-md space-y-3 mt-2">
            <Header title={title} label={label}/>
            <CardContent className="w-full">
                {children}
            </CardContent>
            {footerChildren && <CardFooter className="w-full">
                {footerChildren}
            </CardFooter>}
            {backButtonLabel && backButtonHRef && <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHRef}/>
            </CardFooter>}
        </Card>
    );
};

export default CardWrapper;