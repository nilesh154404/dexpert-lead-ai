import { useState } from "react";
import { Calendar, Clock, User, Video, Phone, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  leadName: string;
  leadCompany?: string;
  time: string;
  duration: string;
  type: "video" | "phone" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  aiNote?: string;
  aiSuggested?: boolean;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const appointments: Record<string, Appointment[]> = {
  "Mon": [
    {
      id: "1",
      leadName: "Sarah Chen",
      leadCompany: "TechCorp",
      time: "10:00 AM",
      duration: "30 min",
      type: "video",
      status: "scheduled",
      aiNote: "High intent - prepare pricing",
    },
  ],
  "Tue": [
    {
      id: "2",
      leadName: "James Miller",
      time: "2:00 PM",
      duration: "45 min",
      type: "phone",
      status: "scheduled",
      aiSuggested: true,
    },
  ],
  "Wed": [],
  "Thu": [
    {
      id: "3",
      leadName: "Lisa Park",
      leadCompany: "Innovate Tech",
      time: "11:00 AM",
      duration: "30 min",
      type: "video",
      status: "scheduled",
    },
    {
      id: "4",
      leadName: "Michael Roberts",
      time: "3:00 PM",
      duration: "30 min",
      type: "video",
      status: "scheduled",
      aiNote: "Follow up on demo questions",
    },
  ],
  "Fri": [
    {
      id: "5",
      leadName: "Emily Watson",
      time: "9:00 AM",
      duration: "30 min",
      type: "phone",
      status: "scheduled",
      aiSuggested: true,
    },
  ],
};

const aiSuggestedSlots = ["Wed-10:00 AM", "Wed-2:00 PM", "Fri-11:00 AM"];

export default function Appointments() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <AppLayout title="Appointments" subtitle="Manage your schedule">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">Jan 13 - 17, 2025</span>
          <Button variant="outline" size="icon-sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ai-outline">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Suggestions
          </Button>
          <Button variant="ai">
            + New Appointment
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-ai/30 ring-2 ring-ai/50" />
          <span>AI Suggested Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Scheduled</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b bg-secondary/30">
          <div className="p-3" />
          {weekDays.map((day, idx) => (
            <div key={day} className="p-3 text-center border-l">
              <p className="text-sm font-medium">{day}</p>
              <p className="text-2xl font-semibold mt-1">{13 + idx}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="divide-y">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[80px]">
              <div className="p-3 text-xs text-muted-foreground flex items-start">
                {time}
              </div>
              {weekDays.map((day) => {
                const dayAppointments = appointments[day]?.filter(a => a.time === time) || [];
                const slotKey = `${day}-${time}`;
                const isAiSuggested = aiSuggestedSlots.includes(slotKey);
                
                return (
                  <div
                    key={day}
                    className={cn(
                      "border-l p-2 transition-colors cursor-pointer",
                      isAiSuggested && dayAppointments.length === 0 && "bg-ai/5",
                      selectedSlot === slotKey && "ring-2 ring-ai ring-inset"
                    )}
                    onClick={() => setSelectedSlot(slotKey)}
                  >
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{apt.leadName}</span>
                          {apt.type === "video" ? (
                            <Video className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Phone className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        {apt.leadCompany && (
                          <p className="text-muted-foreground truncate">{apt.leadCompany}</p>
                        )}
                        {apt.aiNote && (
                          <p className="text-ai mt-1 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            {apt.aiNote}
                          </p>
                        )}
                        {apt.aiSuggested && (
                          <Badge variant="ai" className="mt-1 text-[10px]">
                            AI Suggested
                          </Badge>
                        )}
                      </div>
                    ))}
                    {isAiSuggested && dayAppointments.length === 0 && (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="h-6 w-6 rounded-full bg-ai/10 flex items-center justify-center mx-auto">
                            <Sparkles className="h-3 w-3 text-ai" />
                          </div>
                          <p className="text-[10px] text-ai mt-1">Optimal slot</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Side Panel for selected slot would go here */}
    </AppLayout>
  );
}
