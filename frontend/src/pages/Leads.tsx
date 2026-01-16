import { useState } from "react";
import { Search, Filter, SortAsc, Grid, List, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "@/components/leads/LeadCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { leadsApi, Lead, LeadQueryParams } from "@/lib/api/leads.api";
import { formatDistanceToNow } from "date-fns";

export default function Leads() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const navigate = useNavigate();

  const queryParams: LeadQueryParams = {
    page: 1,
    limit: 50,
  };

  if (search) queryParams.search = search;
  if (statusFilter !== "all") queryParams.status = statusFilter as any;
  if (intentFilter !== "all") queryParams.intentRange = intentFilter;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", queryParams],
    queryFn: () => leadsApi.getAll(queryParams),
  });

  const formatLastInteraction = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const leads: Lead[] = data?.data || [];

  return (
    <AppLayout title="Leads" subtitle="Manage and track all your leads">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, email, or company..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="nurturing">Nurturing</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={intentFilter} onValueChange={setIntentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intent</SelectItem>
              <SelectItem value="hot">Hot (85%+)</SelectItem>
              <SelectItem value="warm">Warm (70-84%)</SelectItem>
              <SelectItem value="cool">Cool (50-69%)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Summary Bar */}
      {leads.length > 0 && (
        <div className="ai-card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-ai/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-ai" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">AI Summary:</span>{" "}
                <span className="text-muted-foreground">
                  {leads.filter(l => l.intentScore >= 85).length} hot leads need attention today. 
                  Showing {leads.length} of {data?.total || 0} total leads.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading leads. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Leads Grid */}
      {!isLoading && !error && (
        <>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No leads found. Create your first lead!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={{
                    ...lead,
                    lastInteraction: formatLastInteraction(lead.lastInteractionAt),
                  }}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
