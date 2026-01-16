import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  MessageSquare,
  Clock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
  Edit,
  User,
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntentIndicator } from "@/components/leads/IntentIndicator";
import { cn } from "@/lib/utils";
import { leadsApi } from "@/lib/api/leads.api";
import { conversationsApi } from "@/lib/api/conversations.api";
import { appointmentsApi } from "@/lib/api/appointments.api";
import { format, formatDistanceToNow } from "date-fns";

const insightIcons = {
  interest: Target,
  pain: AlertCircle,
  objection: AlertCircle,
  opportunity: CheckCircle,
};

const insightColors = {
  interest: "text-blue-600 bg-blue-50",
  pain: "text-red-600 bg-red-50",
  objection: "text-amber-600 bg-amber-50",
  opportunity: "text-emerald-600 bg-emerald-50",
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);

  const { data: lead, isLoading: leadLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsApi.getById(id!),
    enabled: !!id,
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations", id],
    queryFn: () => conversationsApi.getAll(id),
    enabled: !!id,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["appointments", "lead", id],
    queryFn: () => appointmentsApi.getByLead(id!),
    enabled: !!id,
  });

  const updateLeadMutation = useMutation({
    mutationFn: (data: any) => leadsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return dateString;
    }
  };

  const formatRelative = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (leadLoading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading lead details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!lead) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-destructive">Lead not found</p>
          <Button onClick={() => navigate("/leads")} className="mt-4">
            Back to Leads
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/leads")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-xl font-medium">
              {lead.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{lead.name}</h1>
                <Badge variant={lead.status as any}>{lead.status}</Badge>
              </div>
              {lead.role && <p className="text-muted-foreground">{lead.role}</p>}
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {lead.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {lead.company}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {lead.email}
                </span>
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IntentIndicator score={lead.intentScore} size="lg" />
            <div className="flex gap-2">
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="ai">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Actions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {lead.aiSummary && (
        <div className="ai-card p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-ai/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-ai" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  AI Summary
                  {lead.confidenceScore && (
                    <Badge variant="ai" className="text-xs">
                      {lead.confidenceScore}% confidence
                    </Badge>
                  )}
                </h3>
              </div>
              <p className="text-muted-foreground">{lead.aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations ({conversations?.length || 0})</TabsTrigger>
          <TabsTrigger value="appointments">Appointments ({appointments?.length || 0})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Info */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="font-medium mt-1">{lead.source || "Unknown"}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium mt-1">{formatDate(lead.createdAt)}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Last Interaction</p>
              <p className="font-medium mt-1">{formatRelative(lead.lastInteractionAt)}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">Intent Score</p>
              <p className="font-medium mt-1">{lead.intentScore}%</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          {conversationsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((conv) => (
              <div key={conv.id} className="rounded-xl border bg-card overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  onClick={() => setExpandedConversation(
                    expandedConversation === conv.id ? null : conv.id
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{formatDate(conv.createdAt)}</p>
                      <p className="text-sm text-muted-foreground">{conv.summary || "No summary"}</p>
                    </div>
                  </div>
                  {expandedConversation === conv.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                
                {expandedConversation === conv.id && conv.messages && (
                  <div className="border-t p-4 space-y-4 bg-secondary/20">
                    {conv.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex",
                          msg.role === "lead" ? "justify-start" : "justify-end"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%]",
                            msg.role === "lead" ? "chat-bubble-ai" : "chat-bubble-user"
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs text-muted-foreground mt-1 opacity-70">
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No conversations yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          {appointmentsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : appointments && appointments.length > 0 ? (
            appointments.map((apt) => (
              <div key={apt.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-ai/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-ai" />
                    </div>
                    <div>
                      <h4 className="font-medium">{apt.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(apt.date)} at {apt.time} • {apt.duration}
                      </p>
                      <Badge variant="success" className="mt-2">
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ai" size="sm">
                      Join Call
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No appointments scheduled</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <div className="rounded-xl border bg-card p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium">Activity Timeline</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Full activity history coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
