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
    // Allow booking if at least one staff is available (up to 3 customers can book same slot)
    if (slot && slot.availableStaff && slot.availableStaff.length > 0) {
      setSelectedSlot({ date: dateStr, time });
      setBookingForm({
        leadId: "",
        title: "",
        duration: "30 min",
        type: "video",
        aiNote: "",
      });
      setIsBookingOpen(true);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !bookingForm.leadId || !bookingForm.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the slot info to find available staff
      const slot = availableSlots.find(
        (s: any) => s.date === selectedSlot.date && s.time === selectedSlot.time
      );

      if (!slot || !slot.availableStaff || slot.availableStaff.length === 0) {
        toast({
          title: "Slot Full",
          description: "This time slot is no longer available",
          variant: "destructive",
        });
        setIsBookingOpen(false);
        return;
      }

      // Auto-assign to first available staff
      const assignedStaff = slot.availableStaff[0];

      await appointmentsApi.create({
        leadId: bookingForm.leadId,
        title: bookingForm.title,
        date: selectedSlot.date,
        time: selectedSlot.time,
        duration: bookingForm.duration,
        type: bookingForm.type,
        staffId: assignedStaff.id,
        aiNote: bookingForm.aiNote || undefined,
      });

      toast({
        title: "Success",
        description: `Appointment booked with ${assignedStaff.name}`,
      });

      setIsBookingOpen(false);
      setSelectedSlot(null);
      setBookingForm({
        leadId: "",
        title: "",
        duration: "30 min",
        type: "video",
        aiNote: "",
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

  const getAvailableTimeSlotsForDropdown = () => {
    return availableSlots
      .filter((slot: any) => slot.availableStaff && slot.availableStaff.length > 0)
      .map((slot: any) => ({
        date: slot.date,
        time: slot.time,
        key: `${slot.date}|${slot.time}`,
        label: `${new Date(slot.date).toLocaleDateString()} at ${formatTime(slot.time)}`,
        availableStaffCount: slot.availableStaff.length,
        firstAvailableStaff: slot.availableStaff[0],
      }));
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
          <Button variant="ai" onClick={() => {
            setSelectedSlot(null);
            setBookingForm({
              leadId: "",
              title: "",
              duration: "30 min",
              type: "video",
              aiNote: "",
            });
            setIsBookingOpen(true);
          }}>
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
                    const hasAvailableStaff = slotInfo.availableStaff.length > 0;
                    const slotHasAppointments = slotAppointments.length > 0;
                    const isSlotAvailable = hasAvailableStaff && !slotHasAppointments;

                    return (
                      <div
                        key={day}
                        className={cn(
                          "border-l p-2 transition-colors flex flex-col gap-1 min-h-[80px]",
                          isSlotAvailable && "bg-ai/5"
                        )}
                      >
                        {slotHasAppointments ? (
                          <div className="space-y-1 flex-1">
                            {slotAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-xs"
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
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {isSlotAvailable && (
                          <button
                            onClick={() => handleSlotClick(date, time)}
                            className="mt-auto flex flex-col items-center justify-center py-2 hover:bg-ai/10 transition-colors rounded group"
                          >
                            <div className="h-8 w-8 rounded-full bg-ai/20 flex items-center justify-center group-hover:bg-ai/30 transition-colors">
                              <Plus className="h-5 w-5 text-ai font-bold" />
                            </div>
                            <p className="text-[11px] text-ai mt-1 font-semibold">Book</p>
                          </button>
                        )}
                        {slotHasAppointments && !isSlotAvailable && (
                          <div className="text-[10px] text-muted-foreground text-center py-2">
                            <p className="font-semibold">Booked</p>
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
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedSlot ? `Schedule for ${new Date(selectedSlot.date).toLocaleDateString()} at ${formatTime(selectedSlot.time)}` : "Select a date and time from the calendar or dropdown above"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3 max-h-96 overflow-y-auto">
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
            <div className="space-y-2">
              <Label htmlFor="timeSlot">Date & Time *</Label>
              <Select
                value={selectedSlot ? `${selectedSlot.date}|${selectedSlot.time}` : ""}
                onValueChange={(value) => {
                  const [date, time] = value.split("|");
                  setSelectedSlot({ date, time });
                }}
              >
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select a date and time" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {getAvailableTimeSlotsForDropdown().map((slot) => (
                    <SelectItem key={slot.key} value={slot.key}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ Auto-Assign:</strong> Staff will be automatically assigned on the backend.
              </p>
            </div>
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