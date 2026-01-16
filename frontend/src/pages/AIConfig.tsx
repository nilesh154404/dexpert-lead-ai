import { useState } from "react";
import { Bot, Sparkles, Zap, Clock, User, ArrowRight, Info, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  action: string;
}

const leadStages = [
  { id: "new", name: "New", description: "First interaction with the chatbot" },
  { id: "engaged", name: "Engaged", description: "Had meaningful conversation" },
  { id: "qualified", name: "Qualified", description: "AI determined high intent" },
  { id: "meeting", name: "Meeting Set", description: "Appointment scheduled" },
  { id: "converted", name: "Converted", description: "Became a customer" },
];

const automationRules: Rule[] = [
  {
    id: "1",
    name: "Auto-qualify high intent",
    description: "Automatically move leads to Qualified when intent score exceeds threshold",
    enabled: true,
    condition: "Intent score > 85%",
    action: "Move to Qualified stage",
  },
  {
    id: "2",
    name: "Request human handoff",
    description: "Alert staff when AI confidence drops or lead requests human",
    enabled: true,
    condition: "Confidence < 60% OR lead requests human",
    action: "Notify assigned staff",
  },
  {
    id: "3",
    name: "Appointment booking trigger",
    description: "Offer appointment when lead shows strong buying signals",
    enabled: true,
    condition: "Intent > 75% AND mentioned pricing",
    action: "Offer appointment booking",
  },
  {
    id: "4",
    name: "Re-engagement campaign",
    description: "Automatically reach out to cooling leads",
    enabled: false,
    condition: "No activity for 3 days AND not converted",
    action: "Send follow-up message",
  },
];

export default function AIConfig() {
  const [intentThreshold, setIntentThreshold] = useState([85]);
  const [confidenceThreshold, setConfidenceThreshold] = useState([60]);
  const [rules, setRules] = useState(automationRules);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  return (
    <AppLayout title="AI Configuration" subtitle="Configure AI behavior and automation rules">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Lifecycle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-ai" />
                Lead Lifecycle Stages
              </CardTitle>
              <CardDescription>
                Define how leads progress through your sales pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {leadStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center text-sm font-medium",
                        index === 0 ? "bg-blue-100 text-blue-700" :
                        index === leadStages.length - 1 ? "bg-emerald-100 text-emerald-700" :
                        "bg-secondary text-secondary-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium mt-2">{stage.name}</p>
                      <p className="text-xs text-muted-foreground text-center max-w-[100px]">
                        {stage.description}
                      </p>
                    </div>
                    {index < leadStages.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Automation Rules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-ai" />
                    Automation Rules
                  </CardTitle>
                  <CardDescription>
                    Define "If → Then" rules for automated actions
                  </CardDescription>
                </div>
                <Button variant="ai-outline" size="sm">
                  + Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={cn(
                    "rounded-lg border p-4 transition-all",
                    rule.enabled ? "bg-card" : "bg-secondary/50 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        {rule.enabled && (
                          <Badge variant="success" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">If:</span>
                          <Badge variant="secondary">{rule.condition}</Badge>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Then:</span>
                          <Badge variant="ai">{rule.action}</Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ai" />
                AI Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Auto-qualify Intent</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Leads with intent score above this threshold will be automatically qualified
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-medium text-ai">{intentThreshold[0]}%</span>
                </div>
                <Slider
                  value={intentThreshold}
                  onValueChange={setIntentThreshold}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Human Handoff</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          When AI confidence drops below this level, staff will be alerted
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-medium text-warning">{confidenceThreshold[0]}%</span>
                </div>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={80}
                  min={30}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Collect contact early</p>
                  <p className="text-xs text-muted-foreground">Ask for email/phone upfront</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Show AI confidence</p>
                  <p className="text-xs text-muted-foreground">Display to staff users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-schedule follow-ups</p>
                  <p className="text-xs text-muted-foreground">AI suggests next actions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button variant="ai" className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
