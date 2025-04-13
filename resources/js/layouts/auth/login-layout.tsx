import { PropsWithChildren } from 'react';

export default function LoginLayout({ children }: PropsWithChildren) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
