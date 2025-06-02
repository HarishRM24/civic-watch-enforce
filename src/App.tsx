
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import PoliceStationsPage from "./pages/PoliceStationsPage";
import PoliceStationDetailPage from "./pages/PoliceStationDetailPage";
import CivilianDatabasePage from "./pages/CivilianDatabasePage"; 
import CriminalDatabasePage from "./pages/CriminalDatabasePage";
import CivilianProfilePage from "./pages/CivilianProfilePage";
import ComplaintPage from "./pages/ComplaintPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Layout and Auth
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="police-stations" element={<PoliceStationsPage />} />
              <Route path="police-stations/:id" element={<PoliceStationDetailPage />} />
              <Route path="civilian-database" element={
                <ProtectedRoute requiredRole="police">
                  <CivilianDatabasePage />
                </ProtectedRoute>
              } />
              <Route path="criminal-database" element={
                <ProtectedRoute requiredRole="police">
                  <CriminalDatabasePage />
                </ProtectedRoute>
              } />
              <Route path="civilian-profile" element={
                <ProtectedRoute requiredRole="civilian">
                  <CivilianProfilePage />
                </ProtectedRoute>
              } />
              <Route path="complaint/:officerId" element={
                <ProtectedRoute requiredRole="civilian">
                  <ComplaintPage />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
