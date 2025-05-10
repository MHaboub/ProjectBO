import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const allMenuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "layout-dashboard" },
  { name: "Trainings", path: "/trainings", icon: "layout-dashboard" },
  { name: "Users", path: "/users", icon: "user" },
  { name: "Participants", path: "/participants", icon: "user" },
  { name: "Statistics", path: "/statistics", icon: "chart-bar" },
  { name: "Profile", path: "/profile", icon: "user-round" },
];

export function SidebarNav() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const { currentUser, logout } = useAuth();

  const toggleSidebar = () => setExpanded(!expanded);

  // Filter menu items based on role
  let menuItems = [];

  if (!currentUser) {
    menuItems = [];
  } else if (currentUser.role === "ADMIN") {
    menuItems = allMenuItems;
  } else if (currentUser.role === "MANAGER") {
    menuItems = allMenuItems.filter(item =>
      ["/profile", "/statistics"].includes(item.path)
    );
  } else if (currentUser.role === "USER") {
    menuItems = allMenuItems.filter(item =>
      ["/dashboard", "/participants", "/trainings", "/profile"].includes(item.path)
    );
  } else {
    menuItems = [];
  }

  return (
    <div className={cn(
      "sticky h-screen left-0 top-0 inset-y-0 mb-0 z-40 flex flex-col transition-width duration-500 ease-in-out bg-sidebar shadow-lg",
      expanded ? "w-64" : "w-20"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", expanded ? "justify-between w-full" : "justify-center")}>
          {expanded && (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-sidebar-foreground" />
              <span className="font-bold text-xl text-sidebar-foreground">TrainHub</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {expanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !expanded && "justify-center px-0"
                )}
              >
                <IconComponent name={item.icon} className={cn("h-5 w-5", expanded && "mr-2")} />
                {expanded && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {expanded ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-accent-foreground font-medium">
                {currentUser?.firstName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {currentUser?.firstName + " " + currentUser?.lastName}
              </p>
              <p className="text-xs text-sidebar-foreground truncate">
                {currentUser?.role}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-accent-foreground font-medium">
                {currentUser?.firstName.charAt(0)}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component to render icons
const IconComponent = ({ name, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {name === "layout-dashboard" && (
        <>
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </>
      )}
      {name === "user" && (
        <>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )}
      {name === "chart-bar" && (
        <>
          <line x1="12" x2="12" y1="20" y2="10" />
          <line x1="18" x2="18" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="16" />
        </>
      )}
      {name === "user-round" && (
        <>
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </>
      )}
    </svg>
  );
};
