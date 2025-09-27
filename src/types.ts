import { z } from "zod";

export const hourlyRate = z.object({
  amount: z.string().optional(),
  since: z.string().optional(),
});

export const costRate = z.object({
  amount: z.string().optional(),
  since: z.string().optional(),
});
