import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const server = {
  // Database
  NEON_DB_URL: z.string().url(),
  NEON_DB_URL_DIRECT: z.string().url(),

  // Auth / Clerk
  CLERK_SECRET_KEY: z.string(),

  // Sentry (server only: for sourcemap uploads, etc)
  SENTRY_AUTH_TOKEN: z.string().optional()
};

const client = {
  // Clerk (public)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),

  // Sentry (browser)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_ORG: z.string().optional(),
  NEXT_PUBLIC_SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DISABLED: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return Boolean(val);
  }, z.boolean())
};

export const env = createEnv({
  server,
  client,
  runtimeEnv: {
    NEON_DB_URL: process.env.NEON_DB_URL,
    NEON_DB_URL_DIRECT: process.env.NEON_DB_URL_DIRECT,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_ORG: process.env.NEXT_PUBLIC_SENTRY_ORG,
    NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
    NEXT_PUBLIC_SENTRY_DISABLED: process.env.NEXT_PUBLIC_SENTRY_DISABLED
  }
});
