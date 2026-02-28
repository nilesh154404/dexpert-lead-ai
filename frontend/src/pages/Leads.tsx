import { useState } from "react";
import { 
  Search, 
  Grid, 
  List, 
  Sparkles, 
  Building2, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Upload 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IntentIndicator } from "@/components/leads/IntentIndicator";
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
  const navigate = useNavigate();
  
  // Existing States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  
  // Single Create States
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({ 
    name: "", 
    email: "", 
    company: "", 
    phone: "", 
    aiSummary: "Interested in enterprise plan",
    createdAt: new Date().toISOString().split('T')[0] 
  });

  // Bulk Import States
  const [importOpen, setImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, errors: 0 });

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

  const filteredLeads = leads.filter((lead) => {
    if (timeFilter === "all") return true;
    
    const dateToCompare = lead.createdAt || lead.lastInteractionAt;
    if (!dateToCompare) return true;

    const leadDate = new Date(dateToCompare);
    const today = new Date();
    
    const diffTime = Math.abs(today.getTime() - leadDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (timeFilter === "1") return diffDays <= 1;
    if (timeFilter === "7") return diffDays <= 7;
    if (timeFilter === "30") return diffDays <= 30;
    
    return true;
  });

  // 🔥 FRONTEND BULK IMPORTER LOGIC
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        alert("File must contain headers and at least one row of data.");
        setIsImporting(false);
        return;
      }

      // Parse headers to lowercase and trim spaces
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const totalLeads = lines.length - 1;
      setImportProgress({ current: 0, total: totalLeads, errors: 0 });

      let errorCount = 0;

      // Loop through data rows sequentially
      for (let i = 1; i < lines.length; i++) {
        // Safer CSV split that ignores commas inside quotes
        const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/^"|"$/g, '').trim());
        
        const parsedLead = {
          name: currentLine[headers.indexOf('name')] || "Unknown",
          email: currentLine[headers.indexOf('email')] || `unknown-import-${Date.now()}-${i}@placeholder.com`,
          phone: headers.includes('phone') ? currentLine[headers.indexOf('phone')] : "",
          company: headers.includes('company') ? currentLine[headers.indexOf('company')] : "",
          createdAt: headers.includes('date') && currentLine[headers.indexOf('date')] 
            ? currentLine[headers.indexOf('date')] 
            : new Date().toISOString().split('T')[0],
          source: "Bulk Import",
          status: "new",
          aiSummary: "Imported from historical CSV data"
        };

        try {
          await leadsApi.create(parsedLead);
        } catch (err) {
          console.error(`Failed to import lead row ${i}:`, err);
          errorCount++;
        }

        setImportProgress({ current: i, total: totalLeads, errors: errorCount });
      }

      setIsImporting(false);
      refetch();
      setTimeout(() => {
        setImportOpen(false);
        setImportProgress({ current: 0, total: 0, errors: 0 }); // reset
      }, 2000);
    };

    reader.readAsText(file);
  };

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
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1">Last 1 Day</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* 🔥 NEW: Import Button */}
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>

          <Button variant="ai" onClick={() => setCreateOpen(true)}>
            + Create Lead
          </Button>
          
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

      {/* CSV Import Dialog */}
      <Dialog open={importOpen} onOpenChange={(open) => !isImporting && setImportOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import Historical Leads</DialogTitle>
            <DialogDescription>
              Upload a CSV file. The first row must contain these exact headers: <br/>
              <strong className="text-foreground">Name, Email, Phone, Company, Date</strong><br/>
              <span className="text-xs text-muted-foreground">(Date format should be YYYY-MM-DD)</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isImporting && importProgress.total === 0 && (
              <Input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="cursor-pointer border-ai/50 focus:ring-ai"
              />
            )}

            {(isImporting || importProgress.total > 0) && (
              <div className="space-y-2 p-4 rounded-lg border bg-slate-50">
                <div className="flex justify-between text-sm font-medium">
                  <span>{isImporting ? "Importing..." : "Finished"}</span>
                  <span>{importProgress.current} / {importProgress.total}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-ai transition-all duration-300" 
                    style={{ width: importProgress.total > 0 ? `${(importProgress.current / importProgress.total) * 100}%` : '0%' }}
                  />
                </div>
                {importProgress.errors > 0 && (
                  <p className="text-xs text-destructive mt-2">Failed to import {importProgress.errors} rows. Check required fields.</p>
                )}
                {importProgress.current === importProgress.total && importProgress.total > 0 && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">Import Complete! Closing...</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)} disabled={isImporting}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Single Lead Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreateLoading(true);
              setCreateError(null);
              try {
                await leadsApi.create(leadForm);
                setCreateOpen(false);
                setLeadForm({ 
                  name: "", 
                  email: "", 
                  company: "", 
                  phone: "", 
                  aiSummary: "Interested in enterprise plan",
                  createdAt: new Date().toISOString().split('T')[0] 
                });
                refetch();
              } catch (err: any) {
                setCreateError(err?.message || "Failed to create lead");
              } finally {
                setCreateLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label>Name</Label>
              <Input
                required
                value={leadForm.name}
                onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Lead Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                required
                type="email"
                value={leadForm.email}
                onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Lead Email"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={leadForm.company}
                onChange={e => setLeadForm(f => ({ ...f, company: e.target.value }))}
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={leadForm.phone}
                onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="createdAt">Lead Creation Date (Historical)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="createdAt" 
                  type="date" 
                  className="pl-10"
                  value={leadForm.createdAt}
                  onChange={(e) => setLeadForm(f => ({ ...f, createdAt: e.target.value }))}
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Leave as today for live leads, or select a past date for historical data.
              </p>
            </div>
            <div>
              <Label>Message</Label>
              <Input
                value={leadForm.aiSummary}
                onChange={e => setLeadForm(f => ({ ...f, aiSummary: e.target.value }))}
                placeholder="Message for this lead"
              />
            </div>
            {createError && <div className="text-destructive text-sm">{createError}</div>}
            <DialogFooter>
              <Button type="submit" loading={createLoading} disabled={createLoading}>
                Create Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Summary Bar */}
      {filteredLeads.length > 0 && (
        <div className="ai-card p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-ai/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-ai" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">AI Summary:</span>{" "}
                <span className="text-muted-foreground">
                  Showing {filteredLeads.length} leads matching your filters.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading leads. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Leads Grid with Inlined Cards */}
      {!isLoading && !error && (
        <>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No leads found for these filters.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border bg-card p-5 hover:shadow-card-hover transition-all cursor-pointer group"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                        {lead.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-medium">{lead.name}</h3>
                        {lead.company && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {lead.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <IntentIndicator lead={lead} appointmentsCount={(lead.status === 'qualified' || lead.status === 'converted' || lead.status === 'new') ? 1 : 0}/>
                  </div>

                  <div className="mt-4 ai-card p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-ai shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80 line-clamp-2">{lead.aiSummary}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant={lead.status as any}>{lead.status}</Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastInteraction(lead.lastInteractionAt || lead.createdAt)}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}