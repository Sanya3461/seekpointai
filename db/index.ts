import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use Supabase database URL with fallback
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.jwkfmkpdnliieyacrxel:ZorbaGimi852%21@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require';

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export * from './schema';
