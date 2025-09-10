import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwkfmkpdnliieyacrxel.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2Zta3BkbmxpaWV5YWNyeGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTQ1ODAsImV4cCI6MjA3MzAzMDU4MH0.Myvf5mUBldUYtK3eCeFswZK4Id4tKEz0WEr-evKIsfs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
