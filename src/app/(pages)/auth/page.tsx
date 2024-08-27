import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

import SocialLogin from "~/app/_components/socialAuth";
import PageLayout from "~/app/pageLayout";

const AuthLoginPage = () => {
    return (
        <PageLayout>
            <main className="flex items-center justify-center pt-40 min-h-full">
                <Card className={cn("w-full max-w-sm")}>
                    <CardHeader className="flex items-center justify-center text-center">
                        <CardTitle className="text-2xl font-medium ">
                            Log in
                        </CardTitle>
                        <CardDescription>
                            Choose your preferred login method
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <SocialLogin />
                    </CardContent>
                </Card>
            </main>
        </PageLayout>
    );
};

export default AuthLoginPage;
