import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Participants from "@/pages/Participants";
import Trainings from "@/pages/Trainings";
import TrainingDetail from "@/pages/TrainingDetail";
import Statistics from "@/pages/Statistics";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const RoleBasedRoutes = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  const role = currentUser.role;

  if (role === "ADMIN") {
    // Admin has access to all routes
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/trainings/:id" element={<TrainingDetail />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else if (role === "MANAGER") {
    // Manager has access only to profile and statistics
    return (
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else if (role === "USER") {
    // User has access to dashboard, participants, trainings, trainingDetail, profile
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/trainings/:id" element={<TrainingDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else {
    // Unknown role, redirect to NotFound
    return (
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<RoleBasedRoutes />} />
              <Route path="/" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
