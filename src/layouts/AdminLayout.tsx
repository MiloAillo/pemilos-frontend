import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import CurtainTransition from "@/components/CurtainTransition";
import { ThemeProvider } from "@/components/ui/theme-provider";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/user": "User",
  "/admin/vote": "Suara",
  "/admin/gettoken": "Get Token",
};

const AdminLayout = () => {
  const [showCurtainOpen, setShowCurtainOpen] = useState(true);

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const location = useLocation();
  // For sub-routes like /admin/user, show "User"; for /admin?fullscreen=true, show "Dashboard".
  const basePath = location.pathname;
  const pageTitle =
    PAGE_TITLES[basePath] ??
    (basePath.startsWith("/admin") ? "Admin" : "Admin");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="admin-theme">
      {showCurtainOpen && (
        <CurtainTransition mode="open" onClosed={() => setShowCurtainOpen(false)} />
      )}
      <SidebarProvider>
        {!isFullscreen && <AdminSidebar />}
        <SidebarInset className={isFullscreen ? '!m-0 !ml-0' : ''}>
          {/* Mobile-only top bar with hamburger + page title */}
          {!isFullscreen && (
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-background/80 px-4 backdrop-blur-md md:hidden">
              <SidebarTrigger className="size-9 [&_svg]:size-5" />
              <h1 className="text-base font-semibold tracking-tight truncate">
                {pageTitle}
              </h1>
            </header>
          )}
          <main
            className={
              isFullscreen
                ? "overflow-hidden text-foreground p-4 md:p-6 lg:p-8"
                : "overflow-hidden text-foreground p-4 md:p-6 lg:p-8 pt-4 md:pt-6 lg:pt-8"
            }
          >
            <Outlet />
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;
