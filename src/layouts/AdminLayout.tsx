import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useSearchParams } from "react-router-dom";

const AdminLayout = () => {
  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  return (
    <div className='dark'>
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
