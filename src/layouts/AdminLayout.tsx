import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import CurtainTransition from "@/components/CurtainTransition";

const AdminLayout = () => {
  const [showCurtainOpen, setShowCurtainOpen] = useState(true);

  return (
    <div className='dark'>
      {showCurtainOpen && (
        <CurtainTransition mode="open" onClosed={() => setShowCurtainOpen(false)} />
      )}
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
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
