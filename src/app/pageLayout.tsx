import type { FC, ReactNode } from 'react';
import { TRPCReactProvider } from '~/trpc/react';

type PageLayoutProperties = {
    readonly children: ReactNode;
};

const PageLayout: FC<PageLayoutProperties> = ({ children }) => (
    <main className="px-4 pt-16 pb-32 sm:pt-32">
        <div className="prose prose-neutral prose-orange dark:prose-invert mx-auto space-y-12">
            <TRPCReactProvider>
                {children}
            </TRPCReactProvider>
        </div>
    </main>
);

export default PageLayout;
