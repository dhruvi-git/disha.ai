import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  FileText,
  BriefcaseBusiness,
  Map,
  Search,
  FileEdit,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/chat", icon: MessageSquare, label: "AI Coach" },
  { to: "/dashboard/interview", icon: BriefcaseBusiness, label: "Interview Prep" },
  { to: "/dashboard/resume", icon: FileText, label: "Resume Builder" },
  { to: "/dashboard/cover-letter", icon: FileEdit, label: "Cover Letter" },
  { to: "/dashboard/roadmap", icon: Map, label: "Career Roadmap" },
  { to: "/dashboard/jobs", icon: Search, label: "Job Finder" },
  { to: "/dashboard/profile", icon: UserCircle, label: "Profile" },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 border-r bg-sidebar flex flex-col transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 p-6 border-b">
          <Sparkles className="h-5 w-5" />
          <span className="font-bold">Disha AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded",
                  active && "bg-sidebar-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs mb-3 truncate">
            {user?.primaryEmailAddress?.emailAddress}
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;