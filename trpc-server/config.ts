import 'dotenv/config.js';
import { z } from 'zod';

const envsSchema = z.object({
  ENVIRONMENT: z.string().default('PRODUCTION'),
  PORT: z.coerce.number().default(2022),
  PREFIX: z.string()
    .transform((prefix) => prefix.startsWith('/') ? prefix : `/${ prefix }`)
    .default('/trpc')
});

export const envs = envsSchema.parse(process.env);
