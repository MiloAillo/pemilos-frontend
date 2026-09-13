import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useSearchParams } from "react-router-dom";
import CurtainTransition from "@/components/CurtainTransition";

const AdminLayout = () => {
  const [showCurtainOpen, setShowCurtainOpen] = useState(true);

  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  return (
    <div className='dark'>
      {showCurtainOpen && (
        <CurtainTransition mode="open" onClosed={() => setShowCurtainOpen(false)} />
      )}
      <SidebarProvider>
        {!isFullscreen && <AdminSidebar />}
        <SidebarInset className={isFullscreen ? '!m-0 !ml-0' : ''}>
          <main className="overflow-hidden text-foreground p-8">
            <Outlet />
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
