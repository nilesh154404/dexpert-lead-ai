import { useState, useEffect } from "react";
import { Calendar, Clock, User, Video, Phone, Sparkles, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, MessageSquare } from "lucide-react";
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

function isSlotInPastFromString(dateStr: string, time: string): boolean {
  const [year, month, day] = dateStr.split("-").map((v) => parseInt(v, 10));
  const date = new Date();
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return isSlotInPast(date, time);
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
  const startDate = weekDates[0].toISOString().split("T")[0];
  const endDate = weekDates[4].toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch appointments for the week
      const apptsData = await appointmentsApi.getAll(startDate, endDate);
      console.log('Appointments data:', apptsData);
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
    if (slot && slot.availableStaff && slot.availableStaff.length > 0) {
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

  const handleEditClick = (apt: Appointment) => {
    setSelectedSlot({ date: apt.date, time: apt.time });
    setBookingForm({
      title: apt.title,
      duration: apt.duration,
      type: apt.type,
      aiNote: apt.aiNote || "",
      leadId: apt.leadId || "",
    });
    setEditingAppointmentId(apt.id);
    setIsBookingOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await appointmentsApi.delete(id);
      toast({ title: "Success", description: "Appointment deleted successfully" });
      loadData();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast({ title: "Error", description: "Failed to delete appointment", variant: "destructive" });
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

      // Admin only needs to provide date, time, title, duration, type, and notes
      // Backend will auto-assign the first available staff
      const appointmentData = {
        title: bookingForm.title,
        date: selectedSlot.date,
        time: selectedSlot.time,
        duration: bookingForm.duration,
        type: bookingForm.type,
        aiNote: bookingForm.aiNote || undefined,
        leadId: bookingForm.leadId,
      };

      if (editingAppointmentId) {
        await appointmentsApi.update(editingAppointmentId, appointmentData);
        toast({
          title: "Success",
          description: "Appointment updated successfully!",
        });
      } else {
        await appointmentsApi.create(appointmentData);
        toast({
          title: "Success",
          description: "Appointment booked successfully! Staff will be automatically assigned.",
        });
      }

      setIsBookingOpen(false);
      setSelectedSlot(null);
      setEditingAppointmentId(null);
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

  const getAvailableTimeSlotsForDropdown = () => {
    return availableSlots
      .filter((slot: any) => slot.availableStaff && slot.availableStaff.length > 0)
      .filter((slot: any) => !isSlotInPastFromString(slot.date, slot.time))
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
    newDate.setDate(newDate.getDate() - 5);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 5);
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
              title: "",
              duration: "30 min",
              type: "video",
              aiNote: "",
              leadId: "",
            });
            setEditingAppointmentId(null);
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
              {weekDates.map((date) => (
                <div key={date.toISOString()} className="p-3 text-center border-l">
                  <p className="text-sm font-medium">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-2xl font-semibold mt-1">{date.getDate()}</p>
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
                  {weekDates.map((date) => {
                    const slotAppointments = getAppointmentsForSlot(date, time);
                    const slotInfo = getSlotInfo(date, time);
                    const hasAvailableStaff = slotInfo.availableStaff.length > 0;
                    const isPast = isSlotInPast(date, time);
                    // Slot is available for booking only if there are available staff members
                    // and the slot is not in the past.
                    const isSlotAvailable = hasAvailableStaff && !isPast;

                    return (
                      <div
                        key={date.toISOString()}
                        className={cn(
                          "border-l p-2 transition-colors flex flex-col gap-1 min-h-[80px]",
                          isSlotAvailable && "bg-ai/5"
                        )}
                      >
                        {slotAppointments.length > 0 ? (
                          <div className="space-y-1 flex-1">
                            {slotAppointments.map((apt) => {
                              // Determine display name logic
                              // If lead is present, show lead name
                              // If lead is missing (e.g. manual booking/placeholder):
                              // - If viewer is admin/org/super_admin -> Show Staff Name
                              // - If viewer is staff -> Show Admin Name
                              const isAdminView = ["super_admin", "organisation", "admin"].includes(user?.role || "");
                              const displayName = apt.lead?.name
                                ? apt.lead.name
                                : (isAdminView ? (apt.staff?.name || "Unknown Staff") : (apt.admin?.name || "Unknown Admin"));

                              return (
                                <div
                                  key={apt.id}
                                  className="rounded-lg bg-primary/10 border border-primary/20 p-2 text-xs group relative"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-sm truncate">{displayName}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {apt.type === "video" ? (
                                        <Video className="h-3 w-3 text-muted-foreground" />
                                      ) : apt.type === "phone" ? (
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                      ) : (
                                        <User className="h-3 w-3 text-muted-foreground" />
                                      )}
                                      <div className="flex gap-1 ml-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleEditClick(apt); }}
                                          className="text-muted-foreground hover:text-primary"
                                          title="Edit"
                                        >
                                          <Pencil className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(apt.id); }}
                                          className="text-muted-foreground hover:text-destructive"
                                          title="Reschedule"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {apt.lead?.company && (
                                    <p className="text-muted-foreground truncate">{apt.lead.company}</p>
                                  )}
                                  {apt.staff && (
                                    <p className="text-muted-foreground truncate mt-0.5">Staff: {apt.staff.name}</p>
                                  )}
                                </div>
                              );
                            })}
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
                        {slotAppointments.length > 0 && !isSlotAvailable && (
                          <div className="text-[10px] text-muted-foreground text-center py-2">
                            <p className="font-semibold">Booked (No Staff)</p>
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
            <DialogTitle>
              {editingAppointmentId ? "Reschedule Appointment" : "Book Appointment"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-2">
                {editingAppointmentId && selectedSlot ? (
                  <div className="bg-secondary/20 rounded-lg p-3 border border-border mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground text-sm">
                        {bookingForm.title || "Appointment Purpose"}
                      </span>
                      {bookingForm.leadId && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-ai hover:text-blue-700"
                          onClick={() => window.location.href = `/leads/${bookingForm.leadId}`}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          View Conversation
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Calendar className="h-4 w-4 text-ai" />
                        {new Date(selectedSlot.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Clock className="h-4 w-4 text-ai" />
                        {formatTime(selectedSlot.time)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {selectedSlot
                      ? `Schedule for ${new Date(selectedSlot.date).toLocaleDateString()} at ${formatTime(selectedSlot.time)}`
                      : "Select a date and time from the calendar above"}
                  </span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3 max-h-96 overflow-y-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ Auto-Assign:</strong> Staff will be automatically assigned to the first available team member.
              </p>
            </div>
            {/* Added Lead Selection */}
            <div className="space-y-2">
              <Label htmlFor="lead">Select Lead *</Label>
              <Select value={bookingForm.leadId} onValueChange={(value) => setBookingForm({ ...bookingForm, leadId: value })}>
                <SelectTrigger id="lead">
                  <SelectValue placeholder="Select a lead..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} {lead.company ? `(${lead.company})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date & Time</Label>
              {selectedSlot ? (
                <div className="p-2 bg-muted rounded text-sm">
                  <p className="font-semibold">{new Date(selectedSlot.date).toLocaleDateString()}</p>
                  <p className="text-muted-foreground">{formatTime(selectedSlot.time)}</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs mt-1"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Change Slot
                  </Button>
                </div>
              ) : (
                <Select
                  onValueChange={(value) => {
                    const [date, time] = value.split("|");
                    setSelectedSlot({ date, time });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a date and time..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTimeSlotsForDropdown().length > 0 ? (
                      getAvailableTimeSlotsForDropdown().map((slot: any) => (
                        <SelectItem key={slot.key} value={`${slot.date}|${slot.time}`}>
                          {slot.label} ({slot.availableStaffCount} staff available)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No slots available for this week
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={bookingForm.title}
                onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                placeholder="e.g., Product Demo, Client Meeting"
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
            <Button onClick={handleBookingSubmit}>
              {editingAppointmentId ? "Confirm Reschedule" : "Book Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
