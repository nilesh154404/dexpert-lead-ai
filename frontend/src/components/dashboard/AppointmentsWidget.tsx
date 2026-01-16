import { Calendar, Clock, User, Video, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appointmentsApi, Appointment } from "@/lib/api/appointments.api";
import { format } from "date-fns";
import { isToday } from "date-fns";

const typeIcons = {
  video: Video,
  phone: Phone,
  "in-person": User,
};

export function AppointmentsWidget() {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", todayStr],
    queryFn: () => appointmentsApi.getAll(todayStr, todayStr),
  });

  const todayAppointments: Appointment[] = 
    appointments?.filter((apt) => {
      try {
        const aptDate = new Date(apt.date);
        return isToday(aptDate) && apt.status === "scheduled";
      } catch {
        return false;
      }
    }) || [];

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="h-6 bg-secondary animate-pulse rounded w-32" />
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="h-4 bg-secondary animate-pulse rounded w-3/4 mb-2" />
              <div className="h-3 bg-secondary animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-ai/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-ai" />
          </div>
          <div>
            <h3 className="font-medium">Today's Appointments</h3>
            <p className="text-xs text-muted-foreground">{todayAppointments.length} scheduled</p>
          </div>
        </div>
        <Button variant="ai-outline" size="sm">
          + New
        </Button>
      </div>
      
      <div className="divide-y">
        {todayAppointments.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No appointments today
          </div>
        ) : (
          todayAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((apt) => {
              const TypeIcon = typeIcons[apt.type];
              return (
                <div
                  key={apt.id}
                  className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm">{apt.lead?.name || "Unknown Lead"}</h4>
                        <Badge variant="secondary" className="shrink-0">
                          {apt.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {apt.time}
                        </span>
                        <span>{apt.duration}</span>
                      </div>
                      {apt.aiNote && (
                        <p className="text-xs text-ai mt-2 flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-ai" />
                          {apt.aiNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
