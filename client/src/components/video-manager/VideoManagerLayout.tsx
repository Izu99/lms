"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoManagerSidebar } from "./VideoManagerSidebar";
import { AnimatedBackground } from "../common/AnimatedBackground";
import { Toaster } from "sonner";
import { GlobalFooter } from "@/components/common/GlobalFooter";

interface VideoManagerLayoutProps {
    children: ReactNode;
}

function VideoManagerLayoutContent({ children }: VideoManagerLayoutProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const { isCollapsed } = useSidebar();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden theme-bg-secondary">
            <VideoManagerSidebar user={user} onLogout={handleLogout} />
            <main
                className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? "ml-20" : "ml-72"
                    } flex flex-col h-screen overflow-y-auto relative`}
            >
                <AnimatedBackground variant="default" />
                <div className="p-6 lg:p-8 max-w-[1600px] flex-grow relative z-10">
                    {children}
                </div>
                <Toaster />
                <GlobalFooter />
            </main>
        </div>
    );
}

export function VideoManagerLayout({ children }: VideoManagerLayoutProps) {
    return (
        <SidebarProvider defaultCollapsed={false}>
            <VideoManagerLayoutContent>{children}</VideoManagerLayoutContent>
        </SidebarProvider>
    );
}
