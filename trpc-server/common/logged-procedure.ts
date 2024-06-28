import { publicProcedure } from '@trpc-server/common/trpc';

export const loggedProcedure = publicProcedure.use(async (opts) => {
  const start = Date.now();

  const result = await opts.next();

  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, duration: `${ durationMs }ms` };

  result.ok
    ? console.log(`[${ new Date().toISOString() }] (Success) =>`, meta)
    : console.error(`[${ new Date().toISOString() }] (Fail) =>`, meta);

  return result;
});
