import { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  Check, 
  X, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  User,
  Clock,
  Bot
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationMessage {
  id: string;
  role: "lead" | "ai";
  content: string;
  timestamp: string;
  aiInsight?: {
    type: "intent" | "sentiment" | "topic" | "objection";
    label: string;
    confidence: number;
  };
}

interface Conversation {
  id: string;
  leadName: string;
  leadEmail: string;
  date: string;
  summary: string;
  intentScore: number;
  sentiment: "positive" | "neutral" | "negative";
  messages: ConversationMessage[];
  aiAccuracy: "accurate" | "needs-improvement" | "pending";
  humanCorrection?: string;
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    leadName: "Sarah Chen",
    leadEmail: "sarah.chen@techcorp.com",
    date: "Today, 2:30 PM",
    summary: "High-intent inquiry about enterprise pricing. Lead mentioned urgency due to current contract expiring. Expressed strong interest in automation features.",
    intentScore: 92,
    sentiment: "positive",
    aiAccuracy: "accurate",
    messages: [
      { 
        id: "m1", 
        role: "lead", 
        content: "Hi, I'm interested in learning more about your enterprise plans.", 
        timestamp: "2:30 PM",
        aiInsight: { type: "intent", label: "High Intent", confidence: 88 }
      },
      { 
        id: "m2", 
        role: "ai", 
        content: "Hello Sarah! I'd be happy to help you explore our enterprise options. Could you tell me a bit about your team size and current challenges?", 
        timestamp: "2:30 PM" 
      },
      { 
        id: "m3", 
        role: "lead", 
        content: "We have about 50 team members. Our current solution is quite limited and we're looking for something more scalable. Our contract expires next month.", 
        timestamp: "2:31 PM",
        aiInsight: { type: "intent", label: "Urgency Signal", confidence: 95 }
      },
      { 
        id: "m4", 
        role: "ai", 
        content: "That's great context. For a team of 50+, our Enterprise plan would be ideal. It includes unlimited users, advanced automation, and dedicated support. Given your timeline, I can connect you with a specialist today. Would you like to schedule a quick demo?", 
        timestamp: "2:31 PM" 
      },
      { 
        id: "m5", 
        role: "lead", 
        content: "Yes, that would be great! Can we do it tomorrow morning?", 
        timestamp: "2:32 PM",
        aiInsight: { type: "intent", label: "Booking Intent", confidence: 98 }
      },
    ],
  },
  {
    id: "conv-2",
    leadName: "Mike Johnson",
    leadEmail: "mike.j@startup.io",
    date: "Today, 11:15 AM",
    summary: "Initial inquiry about automation capabilities. Lead expressed budget concerns but showed interest in starting with basic plan.",
    intentScore: 65,
    sentiment: "neutral",
    aiAccuracy: "needs-improvement",
    humanCorrection: "AI missed that the lead mentioned they were comparing with 3 other vendors.",
    messages: [
      { 
        id: "m1", 
        role: "lead", 
        content: "Can you tell me about your automation capabilities?", 
        timestamp: "11:15 AM",
        aiInsight: { type: "topic", label: "Automation Interest", confidence: 92 }
      },
      { 
        id: "m2", 
        role: "ai", 
        content: "Absolutely! Our platform offers powerful automation features including workflow builders, triggered actions, and AI-powered suggestions.", 
        timestamp: "11:15 AM" 
      },
      { 
        id: "m3", 
        role: "lead", 
        content: "That sounds good. We're comparing a few options right now. What's your pricing like for a small team?", 
        timestamp: "11:16 AM",
        aiInsight: { type: "objection", label: "Price Sensitivity", confidence: 78 }
      },
    ],
  },
  {
    id: "conv-3",
    leadName: "Emily Rodriguez",
    leadEmail: "emily@designco.com",
    date: "Yesterday, 4:45 PM",
    summary: "Frustrated with current provider. Looking for migration support. High potential but needs reassurance on transition process.",
    intentScore: 78,
    sentiment: "negative",
    aiAccuracy: "pending",
    messages: [
      { 
        id: "m1", 
        role: "lead", 
        content: "We've been having issues with our current tool. Does your platform offer migration support?", 
        timestamp: "4:45 PM",
        aiInsight: { type: "sentiment", label: "Frustration", confidence: 85 }
      },
      { 
        id: "m2", 
        role: "ai", 
        content: "I'm sorry to hear you're experiencing issues. Yes, we provide full migration support at no extra cost, including data transfer and team training.", 
        timestamp: "4:45 PM" 
      },
    ],
  },
];

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [editingInsight, setEditingInsight] = useState<string | null>(null);
  const [correctionText, setCorrectionText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFeedback = (convId: string, feedback: "accurate" | "needs-improvement") => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === convId ? { ...conv, aiAccuracy: feedback } : conv
      )
    );
  };

  const handleSaveCorrection = (convId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === convId ? { ...conv, humanCorrection: correctionText, aiAccuracy: "needs-improvement" } : conv
      )
    );
    setEditingInsight(null);
    setCorrectionText("");
  };

  const getSentimentColor = (sentiment: Conversation["sentiment"]) => {
    switch (sentiment) {
      case "positive": return "text-success bg-success/10";
      case "negative": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "intent": return "bg-ai/10 text-ai border-ai/20";
      case "sentiment": return "bg-amber-50 text-amber-700 border-amber-200";
      case "topic": return "bg-blue-50 text-blue-700 border-blue-200";
      case "objection": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <AppLayout title="Conversation Review" subtitle="Review and improve AI insights">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversation List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">Pending Review</TabsTrigger>
              <TabsTrigger value="flagged" className="flex-1">Flagged</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {conversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border bg-card transition-all",
                    selectedConversation?.id === conv.id
                      ? "border-ai ring-1 ring-ai/20"
                      : "hover:border-border"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                        {conv.leadName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{conv.leadName}</p>
                        <p className="text-xs text-muted-foreground">{conv.date}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={conv.aiAccuracy === "accurate" ? "success" : conv.aiAccuracy === "needs-improvement" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {conv.aiAccuracy === "accurate" ? "✓ Accurate" : conv.aiAccuracy === "needs-improvement" ? "⚠ Flagged" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{conv.summary}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getSentimentColor(conv.sentiment))}>
                      {conv.sentiment}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Intent: {conv.intentScore}%
                    </span>
                  </div>
                </motion.button>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {conversations.filter(c => c.aiAccuracy === "pending").map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border bg-card transition-all",
                    selectedConversation?.id === conv.id ? "border-ai" : "hover:border-border"
                  )}
                >
                  <p className="text-sm font-medium">{conv.leadName}</p>
                  <p className="text-xs text-muted-foreground">{conv.date}</p>
                </button>
              ))}
            </TabsContent>

            <TabsContent value="flagged" className="space-y-3 mt-4">
              {conversations.filter(c => c.aiAccuracy === "needs-improvement").map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border bg-card transition-all",
                    selectedConversation?.id === conv.id ? "border-ai" : "hover:border-border"
                  )}
                >
                  <p className="text-sm font-medium">{conv.leadName}</p>
                  <p className="text-xs text-muted-foreground">{conv.date}</p>
                </button>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedConversation ? (
              <motion.div
                key={selectedConversation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="rounded-xl border bg-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-lg font-medium">
                        {selectedConversation.leadName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{selectedConversation.leadName}</h2>
                        <p className="text-sm text-muted-foreground">{selectedConversation.leadEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={selectedConversation.aiAccuracy === "accurate" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFeedback(selectedConversation.id, "accurate")}
                        className="gap-1.5"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Accurate
                      </Button>
                      <Button
                        variant={selectedConversation.aiAccuracy === "needs-improvement" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleFeedback(selectedConversation.id, "needs-improvement")}
                        className="gap-1.5"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Needs Work
                      </Button>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="ai-card p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-ai/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-ai" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">AI Summary</h4>
                          <Button 
                            variant="ghost" 
                            size="icon-sm"
                            onClick={() => {
                              setEditingInsight(selectedConversation.id);
                              setCorrectionText(selectedConversation.humanCorrection || "");
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedConversation.summary}</p>
                        
                        {selectedConversation.humanCorrection && (
                          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-2 text-amber-700 text-xs font-medium mb-1">
                              <AlertCircle className="h-3 w-3" />
                              Human Correction
                            </div>
                            <p className="text-sm text-amber-800">{selectedConversation.humanCorrection}</p>
                          </div>
                        )}

                        {editingInsight === selectedConversation.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 space-y-2"
                          >
                            <Input
                              value={correctionText}
                              onChange={(e) => setCorrectionText(e.target.value)}
                              placeholder="Add correction or additional context..."
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveCorrection(selectedConversation.id)}>
                                <Check className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingInsight(null)}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transcript */}
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-secondary/30">
                    <h3 className="font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conversation Transcript
                    </h3>
                  </div>
                  <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                    {selectedConversation.messages.map((msg) => (
                      <div key={msg.id} className="group">
                        <div className={cn(
                          "flex gap-3",
                          msg.role === "lead" ? "flex-row" : "flex-row-reverse"
                        )}>
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === "lead" ? "bg-secondary" : "bg-ai/10"
                          )}>
                            {msg.role === "lead" ? (
                              <User className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Bot className="h-4 w-4 text-ai" />
                            )}
                          </div>
                          <div className={cn(
                            "flex-1 space-y-2",
                            msg.role === "ai" && "text-right"
                          )}>
                            <div className={cn(
                              "inline-block max-w-[85%]",
                              msg.role === "lead" ? "chat-bubble-ai" : "chat-bubble-user"
                            )}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <div className={cn(
                              "flex items-center gap-2 text-xs text-muted-foreground",
                              msg.role === "ai" && "justify-end"
                            )}>
                              <Clock className="h-3 w-3" />
                              {msg.timestamp}
                            </div>
                            
                            {/* AI Insight Badge */}
                            {msg.aiInsight && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                  "inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs",
                                  getInsightColor(msg.aiInsight.type)
                                )}
                              >
                                <Sparkles className="h-3 w-3" />
                                {msg.aiInsight.label}
                                <span className="opacity-70">{msg.aiInsight.confidence}%</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center rounded-xl border bg-card p-12"
              >
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium">Select a Conversation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose a conversation from the list to review AI insights
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
