import z from "zod";
import { ChatbotLeadSchema, CreateLeadSchema } from "../schemas/create-lead.schema";
import { LeadQuerySchema } from "../schemas/lead-query.schema copy";
import { CreateAppointmentSchema } from "../schemas/create-appointment.schema";

export const tools = [
  {
    name: "create_lead",
    description: "Create a new CRM lead",
    schema: CreateLeadSchema,
  },
  {
    name: "query_leads",
    description: "Search and filter leads",
    schema: LeadQuerySchema,
  },
  {
    name: "create_appointment",
    description: "Schedule appointment for a lead",
    schema: CreateAppointmentSchema,
  },
  {
    name: "available_slots",
    description: "Get available appointment slots",
    schema: z.object({
      tenantId: z.string(),
      date: z.string().optional(),
    }),
  },
  {
    name: "create_chatbot_lead",
    description: "Create lead from chatbot form",
    schema: ChatbotLeadSchema,
  },
];