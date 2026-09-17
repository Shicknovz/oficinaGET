import { z } from "zod";

export const optionalText = z.string().trim().min(1).optional().nullable();
export const money = z.coerce.number().nonnegative();
export const idParamSchema = z.object({ id: z.string().uuid() });
