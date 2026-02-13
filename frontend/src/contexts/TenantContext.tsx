import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { tenantsApi, TenantBranding } from "@/lib/api/tenants.api";
import { useAuth } from "./AuthContext";

interface TenantContextType {
  tenant: TenantBranding;
  setTenant: (tenant: TenantBranding) => void;
  isLoading: boolean;
  updateTenant: (data: Partial<TenantBranding>) => Promise<void>;
}

// Default tenant fallback
const defaultTenant: TenantBranding = {
  id: "default",
  name: "DEXTRUS",
  primaryColor: "222 47% 20%",
  accentColor: "173 80% 40%",
  welcomeMessage: "Hi! I'm your AI assistant. How can I help you today?",
  chatbotName: "AI Assistant",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [tenant, setTenant] = useState<TenantBranding>(defaultTenant);

  const { data: tenantData, isLoading, refetch } = useQuery({
    queryKey: ["tenant"],
    queryFn: () => tenantsApi.getCurrent(),
    enabled: isAuthenticated,
    retry: 1,
  });

  useEffect(() => {
    if (tenantData) {
      setTenant(tenantData);
    }
  }, [tenantData]);

  const updateTenant = async (data: Partial<TenantBranding>) => {
    if (!isAuthenticated) {
      setTenant({ ...tenant, ...data } as TenantBranding);
      return;
    }

    const updated = await tenantsApi.update(data);
    setTenant(updated);
    refetch();
  };

  // Apply tenant theming to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Set tenant-specific CSS variables
    root.style.setProperty("--tenant-primary", tenant.primaryColor);
    root.style.setProperty("--tenant-accent", tenant.accentColor);
    
    // Override AI colors with tenant accent
    root.style.setProperty("--ai", tenant.accentColor);
    
    if (tenant.fontFamily) {
      root.style.setProperty("--font-sans", tenant.fontFamily);
    }
  }, [tenant]);

  return (
    <TenantContext.Provider value={{ tenant, setTenant, isLoading, updateTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
