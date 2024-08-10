import 'dotenv/config.js';
import { z } from 'zod';

const envsSchema = z.object({
  ENVIRONMENT: z.string().default('PRODUCTION'),
  PORT: z.coerce.number().default(2022),
  PREFIX: z.string()
    .transform((prefix) => prefix.startsWith('/') ? prefix : `/${ prefix }`)
    .default('/trpc'),
  WEB_REFER: z.string().default('http://192.168.1.1/index.html'),
  WEB_API: z.string().default('http://192.168.1.1/jrd/webapi'),
  REQUEST_VERIFICATION_KEY_HEADER: z.string().default('_tclrequestverificationkey'),
  REQUEST_VERIFICATION_KEY: z.string(),
  REQUEST_VERIFICATION_TOKEN_HEADER: z.string().default('_tclrequestverificationtoken')
});

export const envs = envsSchema.parse(process.env);

export type ServerOptions = typeof envs;
