import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-sidebar-foreground">Disha AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground mb-3 truncate px-3">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default DashboardLayout;
