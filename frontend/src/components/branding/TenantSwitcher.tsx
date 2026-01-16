import { useState } from "react";
import { Check, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant, sampleTenants, TenantBranding } from "@/contexts/TenantContext";
import { cn } from "@/lib/utils";

export function TenantSwitcher() {
  const { tenant, setTenant } = useTenant();
  const [open, setOpen] = useState(false);

  const handleSelectTenant = (newTenant: TenantBranding) => {
    setTenant(newTenant);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            <div 
              className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: `hsl(${tenant.accentColor})` }}
            >
              {tenant.name.charAt(0)}
            </div>
            <span className="truncate">{tenant.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Switch Organization
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sampleTenants.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => handleSelectTenant(t)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div 
                className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: `hsl(${t.accentColor})` }}
              >
                {t.name.charAt(0)}
              </div>
              <span>{t.name}</span>
            </div>
            {tenant.id === t.id && (
              <Check className="h-4 w-4 text-ai" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
