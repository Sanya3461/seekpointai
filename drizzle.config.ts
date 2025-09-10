import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.jwkfmkpdnliieyacrxel:ZorbaGimi852%21@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require',
  },
} satisfies Config;