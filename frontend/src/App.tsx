import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Appointments from "./pages/Appointments";
import AIConfig from "./pages/AIConfig";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Conversations from "./pages/Conversations";
import BrandingSettings from "./pages/BrandingSettings";
import Tenants from "./pages/Tenants";
import NotFound from "./pages/NotFound";
import ProductAdmin from "./pages/ProductAdmin";
import MyProducts from "./pages/MyProducts";
import ProductPrompt from "./pages/ProductPrompt";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}


// Organisation-only Protected Route
function OrganisationRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only ORGANISATION can access
  if (user?.role !== 'organisation') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Access Denied</p>
          <p className="text-gray-600 mt-2">Only organisation admins can access this page</p>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TenantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/products"
                element={
                  <OrganisationRoute>
                    <ProductAdmin />
                  </OrganisationRoute>
                }
              />
              <Route
                path="/admin/myproducts"
                element={
                  <OrganisationRoute>
                    <MyProducts />
                  </OrganisationRoute>
                }
              />
              <Route
                path="/admin/product-prompt"
                element={
                  <OrganisationRoute>
                    <ProductPrompt />
                  </OrganisationRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <Leads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads/:id"
                element={
                  <ProtectedRoute>
                    <LeadDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-config"
                element={
                  <ProtectedRoute>
                    <AIConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conversations"
                element={
                  <ProtectedRoute>
                    <Conversations />
                  </ProtectedRoute>
                }
              />
              <Route
  path="/admin/products"
  element={
    <OrganisationRoute>
      <ProductAdmin />
    </OrganisationRoute>
  }
/>

              <Route
                path="/branding"
                element={
                  <ProtectedRoute>
                    <BrandingSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenants"
                element={
                  <ProtectedRoute>
                    <Tenants />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TenantProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
