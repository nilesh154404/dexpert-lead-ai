import { useState, useEffect } from "react";
import { Calendar, Clock, User, Video, Phone, Sparkles, ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function getWeekDates(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(date.setDate(diff));
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
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

export default function Appointments() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string; staffId?: string } | null>(null);
  const [bookingForm, setBookingForm] = useState({
    leadId: "",
    title: "",
    duration: "30 min",
    type: "video" as "video" | "phone" | "in-person",
    aiNote: "",
    selectedStaffId: "",
  });
  const { toast } = useToast();

  const weekDates = getWeekDates(new Date(currentWeek));
  const timeSlots = getTimeSlots();
  const startDate = weekDates[0].toISOString().split("T")[0];
  const endDate = weekDates[4].toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch appointments and leads
      const [apptsData, leadsData] = await Promise.all([
        appointmentsApi.getAll(startDate, endDate),
        leadsApi.getAll({ limit: 100 }),
      ]);
      setAppointments(apptsData);
      setLeads(leadsData.data);

      // Fetch available slots for each day of the week
      const slotsPromises = weekDates.map((date) =>
        appointmentsApi.getAvailableSlots(date.toISOString().split("T")[0])
      );
      const slotsResults = await Promise.all(slotsPromises);
      const allSlots = slotsResults.flat();
      setAvailableSlots(allSlots);
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
    const dateStr = date.toISOString().split("T")[0];
    const slot = availableSlots.find((s: any) => s.date === dateStr && s.time === time);
    if (slot && slot.availableStaff && slot.availableStaff.length > 0) {
      // Auto-select first available staff, user can change in booking form
      setSelectedSlot({ date: dateStr, time, staffId: slot.availableStaff[0].id });
      setBookingForm({ ...bookingForm, leadId: "", selectedStaffId: slot.availableStaff[0].id });
      setIsBookingOpen(true);
    }
  };

  const handleBookingSubmit = async () => {
    console.log({ selectedSlot, bookingForm });

    if (!selectedSlot || !bookingForm.leadId || !bookingForm.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await appointmentsApi.create({
        leadId: bookingForm.leadId,
        title: bookingForm.title,
        date: selectedSlot.date,
        time: selectedSlot.time,
        duration: bookingForm.duration,
        type: bookingForm.type,
        staffId: bookingForm.selectedStaffId || selectedSlot.staffId,
        aiNote: bookingForm.aiNote || undefined,
      });

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      setIsBookingOpen(false);
      setSelectedSlot(null);
      setBookingForm({
        leadId: "",
        title: "",
        duration: "30 min",
        type: "video",
        aiNote: "",
        selectedStaffId: "",
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
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter(
      (apt) => apt.date === dateStr && apt.time === time
    );
  };

  const getSlotInfo = (date: Date, time: string): { availableStaff: any[]; bookedStaff: any[] } => {
    const dateStr = date.toISOString().split("T")[0];
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
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const weekStart = weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekEnd = weekDates[4].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <AppLayout title="Appointments" subtitle="Manage your schedule">
      {/* Header Actions */}
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
        <div className="flex items-center gap-2">
          <Button variant="ai" onClick={() => setIsBookingOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      ) : (
        <>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-ai/30 ring-2 ring-ai/50" />
              <span>Available Slot</span>
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
                  <p className="text-2xl font-semibold mt-1">{weekDates[idx].getDate()}</p>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="divide-y">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-[80px_repeat(5,1fr)] min-h-[80px]">
                  <div className="p-3 text-xs text-muted-foreground flex items-start">
                    {formatTime(time)}
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const date = weekDates[dayIdx];
                    const slotAppointments = getAppointmentsForSlot(date, time);
                    const slotInfo = getSlotInfo(date, time);
                    const slotKey = `${day}-${time}`;
                    const hasAvailableStaff = slotInfo.availableStaff.length > 0;

                    return (
                      <div
                        key={day}
                        className={cn(
                          "border-l p-2 transition-colors",
                          hasAvailableStaff && slotAppointments.length === 0 && "bg-ai/5 cursor-pointer hover:bg-ai/10"
                        )}
                        onClick={() => hasAvailableStaff && slotAppointments.length === 0 && handleSlotClick(date, time)}
                      >
                        {slotAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-xs mb-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{apt.lead?.name || "Unknown"}</span>
                              {apt.type === "video" ? (
                                <Video className="h-3 w-3 text-muted-foreground" />
                              ) : apt.type === "phone" ? (
                                <Phone className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <User className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            {apt.lead?.company && (
                              <p className="text-muted-foreground truncate">{apt.lead.company}</p>
                            )}
                            {apt.staff && (
                              <p className="text-muted-foreground truncate text-[10px]">Staff: {apt.staff.name}</p>
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
                        {hasAvailableStaff && slotAppointments.length === 0 && (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="h-6 w-6 rounded-full bg-ai/10 flex items-center justify-center mx-auto">
                                <Plus className="h-3 w-3 text-ai" />
                              </div>
                              <p className="text-[10px] text-ai mt-1">Click to book</p>
                              {slotInfo.availableStaff.length > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {slotInfo.availableStaff.length} staff available
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {slotInfo.bookedStaff.length > 0 && slotAppointments.length === 0 && (
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {slotInfo.bookedStaff.length} staff booked
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedSlot && `Schedule for ${new Date(selectedSlot.date).toLocaleDateString()} at ${formatTime(selectedSlot.time)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lead">Lead *</Label>
              <Select value={bookingForm.leadId} onValueChange={(value) => setBookingForm({ ...bookingForm, leadId: value })}>
                <SelectTrigger id="lead">
                  <SelectValue placeholder="Select a lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} {lead.company && `(${lead.company})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSlot && (() => {
              const slot = availableSlots.find((s: any) => s.date === selectedSlot.date && s.time === selectedSlot.time);
              const availableStaff = slot?.availableStaff || [];
              if (availableStaff.length > 0) {
                return (
                  <div className="space-y-2">
                    <Label htmlFor="staff">Staff Member *</Label>
                    <Select
                      value={bookingForm.selectedStaffId || selectedSlot.staffId}
                      onValueChange={(value) => setBookingForm({ ...bookingForm, selectedStaffId: value })}
                    >
                      <SelectTrigger id="staff">
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStaff.map((staff: any) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name} ({staff.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              return null;
            })()}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={bookingForm.title}
                onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                placeholder="e.g., Product Demo"
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
                    <SelectItem value="45 min">45 min</SelectItem>
                    <SelectItem value="60 min">60 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={bookingForm.type} onValueChange={(value: any) => setBookingForm({ ...bookingForm, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={bookingForm.aiNote}
                onChange={(e) => setBookingForm({ ...bookingForm, aiNote: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit}>Book Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
