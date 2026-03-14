import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  tenantId: z.string(),
  userId: z.string().optional(),

  leadId: z.string(),
  title: z.string(),

  date: z.string(), // ISO date
  time: z.string(),

  duration: z.string(),

  type: z.enum(["video", "phone", "in_person"]).optional(),

  aiNote: z.string().optional(),
  aiSuggested: z.boolean().optional(),

  staffId: z.string().optional(),
});
