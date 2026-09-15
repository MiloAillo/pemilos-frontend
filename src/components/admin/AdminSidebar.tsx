import { ClipboardList, Home, LogOut, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Link } from "react-router-dom";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "User",
    url: "/admin/user",
    icon: User,
  },
  {
    title: "Suara",
    url: "/admin/vote",
    icon: ClipboardList,
  },
];

const AdminSidebar = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const getToggle = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/vote/status`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });
      setChecked(res.data.data.vote_status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToggle();
  }, []);

  const handleToggle = async (newVal: boolean) => {
    setChecked(newVal);
    try {
      await axios.put(
        `${apiUrl}/admin/vote/status`,
        { status: newVal },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      setChecked((prev) => !prev);
    }
  };

  const Logouthandle = async () => {
    localStorage.removeItem("Authorization");
    window.location.href = "/login";
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/admin" onClick={handleNavClick}>
                <span className="text-base font-semibold">Pemilom Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} onClick={handleNavClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="flex flex-col gap-2">
          <SidebarMenuItem className="mb-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="toggle-vote"
                checked={checked}
                onCheckedChange={handleToggle}
              />
              <Label htmlFor="toggle-vote">Toggle Vote</Label>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center space-x-2">
              <ModeToggle />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="">
              <Button
                onClick={() => Logouthandle()}
                className="bg-red-500 text-white w-full"
              >
                <LogOut />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
