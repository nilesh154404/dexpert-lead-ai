import { z } from "zod";

export const ChatbotLeadSchema = z.object({
  organisationId: z.string(),

  name: z.string(),
  email: z.string().email(),

  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),

  message: z.string().optional(),
});