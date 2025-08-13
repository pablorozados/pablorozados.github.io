// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

import Header from "@/components/Header";
import Index from "./pages/Index";
import About from "./pages/About";
import Propagandas from "./pages/Propagandas";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  const handleAdminClick = () => {
    window.location.href = '/#/admin/login';
  };

  return (
    <>
      {/* Só passa onAdminClick se NÃO estiver na página de Propagandas */}
      <Header onAdminClick={location.pathname === '/propagandas' ? undefined : handleAdminClick} />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/propagandas" element={<Propagandas />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <HashRouter>
          <AppContent />
        </HashRouter>

        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;