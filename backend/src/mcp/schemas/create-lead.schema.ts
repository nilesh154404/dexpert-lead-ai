import { z } from "zod";

export const CreateLeadSchema = z.object({
  tenantId: z.string(),

  name: z.string(),
  email: z.string().email(),

  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),

  status: z.enum(["new","contacted","qualified","converted"]).optional(),

  intentScore: z.number().min(0).max(100).optional(),

  source: z.string().optional(),
  aiSummary: z.string().optional(),

  assignedToId: z.string().optional(),
});

export const LeadQuerySchema = z.object({
  tenantId: z.string(),

  search: z.string().optional(),
  status: z.string().optional(),
  intentRange: z.string().optional(),
  assignedToId: z.string().optional(),

  page: z.number().optional(),
  limit: z.number().optional(),
});

export const ChatbotLeadSchema = z.object({
  organisationId: z.string(),

  name: z.string(),
  email: z.string().email(),

  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),

  message: z.string().optional(),
});

