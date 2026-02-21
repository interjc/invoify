import { useMemo } from "react";

// Next
import Link from "next/link";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex h-14 items-center px-4 lg:px-6">
                <div className="flex flex-1 items-center justify-between">
                    <Link href={"/"} className="flex items-center">
                        <span className="text-xl font-bold tracking-tight">Invoice</span>
                    </Link>
                    
                    <div className="flex items-center gap-2">
                        {/* ? DEV Only */}
                        {devEnv && <DevDebug />}
                        <LanguageSelector />
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default BaseNavbar;
