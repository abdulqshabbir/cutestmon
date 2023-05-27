import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: "NEXT_PUBLIC_",
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string()
  },
  client: {
    NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: z.string(),
    NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: z.string()
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_UPSTASH_REDIS_REST_URL:
      process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN:
      process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
  }
})
