// lib/lib.js
import { z } from "zod";

export const User = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});
