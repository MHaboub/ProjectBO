
import React from "react";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Layout = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/"];

  // While auth state is loading, render nothing or a loading indicator
  if (isLoading) {
    return null; // or a spinner component
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // For public routes, don't show sidebar
  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto">
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
