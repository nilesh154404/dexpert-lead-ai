import { useState, useEffect } from "react";
import { Calendar, Clock, User, Video, Phone, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { appointmentsApi, Appointment, AvailableSlot } from "@/lib/api/appointments.api";
import { leadsApi, Lead } from "@/lib/api/leads.api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

function getWeekDates(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust to Monday (1). Sunday is 0.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    dates.push(nextDate);
  }
  return dates;
}

function getSlotDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getSlotDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":");
  const slotDate = new Date(date);
  slotDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return slotDate;
}

function isSlotInPast(date: Date, time: string): boolean {
  const now = new Date();
  return getSlotDateTime(date, time) < now;
}

function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes || "00"} ${ampm}`;
}

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30:00`);
  }
  return slots;
}

export default function StaffAppointments() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; staffId?: string } | null>(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    title: "",
    duration: "30 min",
    type: "video" as "video" | "phone" | "in-person",
    aiNote: "",
    leadId: "",
  });
  const { toast } = useToast();

  const weekDates = getWeekDates(new Date(currentWeek));
  const timeSlots = getTimeSlots();
  const startDate = getSlotDateString(weekDates[0]);
  const endDate = getSlotDateString(weekDates[4]);

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch appointments for the week
      const apptsData = await appointmentsApi.getAll(startDate, endDate);
      setAppointments(apptsData);

      // Fetch available slots for each day of the week
      const slotsPromises = weekDates.map((date) =>
        appointmentsApi.getAvailableSlots(getSlotDateString(date))
      );
      const slotsResults = await Promise.all(slotsPromises);
      const allSlots = slotsResults.flat();
      setAvailableSlots(allSlots);

      // Fetch leads for dropdown
      const leadsResponse = await leadsApi.getAll({ limit: 100 });
      setLeads(leadsResponse.data || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (date: Date, time: string) => {
    const dateStr = getSlotDateString(date);
    const slot = availableSlots.find((s: any) => s.date === dateStr && s.time === time);
    
    // For staff, they can book if they are in the available staff list for this slot
    const isUserAvailable = slot?.availableStaff?.some(s => s.id === user?.id);
    
    if (isUserAvailable) {
      setSelectedSlot({ date: dateStr, time });
      setBookingForm({
        title: "",
        duration: "30 min",
        type: "video",
        aiNote: "",
        leadId: "",
      });
      setEditingAppointmentId(null);
      setIsBookingOpen(true);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !bookingForm.title || !bookingForm.leadId) {
      toast({
        title: "Validation Error",
        description: "Please select a lead, time slot, and enter a title",
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentData = {
        title: bookingForm.title,
        date: selectedSlot.date,
        time: selectedSlot.time,
        duration: bookingForm.duration,
        type: bookingForm.type,
        aiNote: bookingForm.aiNote || undefined,
        leadId: bookingForm.leadId,
        staffId: user?.id, // Staff explicitly assigns themselves
      };

      await appointmentsApi.create(appointmentData);
      toast({
        title: "Success",
        description: "Appointment booked and assigned to you!",
      });

      setIsBookingOpen(false);
      setSelectedSlot(null);
      setBookingForm({
        title: "",
        duration: "30 min",
        type: "video",
        aiNote: "",
        leadId: "",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to book appointment",
        variant: "destructive",
      });
    }
  };

  const getAppointmentsForSlot = (date: Date, time: string): Appointment[] => {
    const dateStr = getSlotDateString(date);
    return appointments.filter(
      (apt) => apt.date === dateStr && apt.time === time
    );
  };

  const getSlotInfo = (date: Date, time: string): { availableStaff: any[]; bookedStaff: any[] } => {
    const dateStr = getSlotDateString(date);
    const slot = availableSlots.find((s: any) => s.date === dateStr && s.time === time);
    if (slot) {
      return {
        availableStaff: slot.availableStaff || [],
        bookedStaff: slot.bookedStaff || []
      };
    }
    return { availableStaff: [], bookedStaff: [] };
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    nextWeek.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const weekStart = weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekEnd = weekDates[4].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <AppLayout title="My Schedule" subtitle="Manage your appointments">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            {weekStart} - {weekEnd}
          </span>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span>Assigned to Me</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-ai/30 ring-2 ring-ai/50" />
              <span>Available to Book</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-200" />
              <span>Slot Not Available</span>
            </div>
          </div>

          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b bg-secondary/30">
              <div className="p-3" />
              {weekDates.map((date) => (
                <div key={date.toISOString()} className="p-3 text-center border-l">
                  <p className="text-sm font-medium">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{date.getDate()}</p>
                </div>
              ))}
            </div>

            <div className="divide-y">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[100px]">
                  <div className="p-3 text-xs text-muted-foreground flex items-start font-medium">
                    {formatTime(time)}
                  </div>
                  {weekDates.map((date) => {
                    const slotAppointments = getAppointmentsForSlot(date, time);
                    const slotInfo = getSlotInfo(date, time);
                    const isPast = isSlotInPast(date, time);
                    
                    // Check if user is already booked for this slot
                    const myAppointment = slotAppointments.find(apt => apt.staffId === user?.id);
                    // Check if others are booked (for UI awareness)
                    const otherAppointments = slotAppointments.filter(apt => apt.staffId !== user?.id);
                    
                    // Check availability
                    const canIJoin = slotInfo.availableStaff.some(s => s.id === user?.id) && !isPast;
                    const isSlotUnavailable = !myAppointment && !canIJoin;

                    return (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "border-l p-2 transition-colors flex flex-col gap-1 min-h-[100px]",
                          myAppointment && "bg-primary/5",
                          !myAppointment && canIJoin && "bg-ai/5",
                          isSlotUnavailable && "bg-gray-50/50"
                        )}
                      >
                        {myAppointment ? (
                          <div className="rounded-lg bg-primary border border-primary/20 p-2 text-xs text-white shadow-sm flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold truncate">{myAppointment.lead?.name || "Private Booking"}</span>
                              <div className="shrink-0">
                                {myAppointment.type === "video" ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                              </div>
                            </div>
                            <p className="opacity-90 line-clamp-1">{myAppointment.title}</p>
                            {myAppointment.leadId && (
                              <button 
                                onClick={() => window.location.href = `/leads/${myAppointment.leadId}`}
                                className="mt-2 text-[10px] bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare className="h-2.5 w-2.5" /> Chat
                              </button>
                            )}
                          </div>
                        ) : isPast ? (
                           <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/40 italic">
                             <AlertCircle className="h-4 w-4 mb-1" />
                             <span className="text-[10px]">Passed</span>
                           </div>
                        ) : canIJoin ? (
                          <button
                            onClick={() => handleSlotClick(date, time)}
                            className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed border-ai/20 hover:border-ai/50 hover:bg-ai/10 transition-all group"
                          >
                             <Plus className="h-4 w-4 text-ai group-hover:scale-110 transition-transform" />
                             <span className="text-[10px] text-ai font-semibold mt-1">Available</span>
                          </button>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Not Available</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign to Me</DialogTitle>
            <DialogDescription>
              {selectedSlot && `Book yourself for ${new Date(selectedSlot.date).toLocaleDateString()} at ${formatTime(selectedSlot.time)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lead">Select Lead *</Label>
              <Select value={bookingForm.leadId} onValueChange={(value) => setBookingForm({ ...bookingForm, leadId: value })}>
                <SelectTrigger id="lead">
                  <SelectValue placeholder="Which lead is this for?" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Reason / Title *</Label>
              <Input
                id="title"
                value={bookingForm.title}
                onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                placeholder="e.g., Follow-up Call"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={bookingForm.duration} onValueChange={(value) => setBookingForm({ ...bookingForm, duration: value })}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 min">30 min</SelectItem>
                    <SelectItem value="60 min">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Method</Label>
                <Select value={bookingForm.type} onValueChange={(value: any) => setBookingForm({ ...bookingForm, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
            <Button onClick={handleBookingSubmit} className="bg-ai hover:bg-ai/90">Confirm My Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
