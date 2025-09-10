#!/usr/bin/env node

/**
 * Supabase kapcsolat tesztelő script
 * Futtatás: npx tsx scripts/test-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

// Konfiguráció
const SUPABASE_URL = 'https://jwkfmkpdnliieyacrxel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2Zta3BkbmxpaWV5YWNyeGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTQ1ODAsImV4cCI6MjA3MzAzMDU4MH0.Myvf5mUBldUYtK3eCeFswZK4Id4tKEz0WEr-evKIsfs';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2Zta3BkbmxpaWV5YWNyeGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ1NDU4MCwiZXhwIjoyMDczMDMwNTgwfQ.MGXI-EyFF9PCrF1yos1hSdCqmpbWpv_RE8KBRQv1OPM';
const DATABASE_URL = 'postgresql://postgres.jwkfmkpdnliieyacrxel:ZorbaGimi852%21@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require';

async function testSupabaseConnection() {
  console.log('🔍 Supabase kapcsolat tesztelése...');
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Egyszerű lekérdezés tesztelése
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(3);

    if (error) {
      console.log('❌ Supabase kapcsolat hiba:', error.message);
      return false;
    }

    console.log('✅ Supabase kapcsolat sikeres!');
    console.log('📋 Elérhető táblák:', data?.map(t => t.table_name).join(', ') || 'Nincsenek táblák');
    return true;
  } catch (error) {
    console.log('❌ Supabase kapcsolat hiba:', error);
    return false;
  }
}

async function testSupabaseAdmin() {
  console.log('\n🔍 Supabase Admin kapcsolat tesztelése...');
  
  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    });
    
    // Admin lekérdezés tesztelése
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(3);

    if (error) {
      console.log('❌ Supabase Admin kapcsolat hiba:', error.message);
      return false;
    }

    console.log('✅ Supabase Admin kapcsolat sikeres!');
    console.log('📋 Admin táblák:', data?.map(t => t.table_name).join(', ') || 'Nincsenek táblák');
    return true;
  } catch (error) {
    console.log('❌ Supabase Admin kapcsolat hiba:', error);
    return false;
  }
}

async function testDirectDatabase() {
  console.log('\n🔍 Közvetlen adatbázis kapcsolat tesztelése...');
  
  try {
    const client = postgres(DATABASE_URL, { prepare: false });
    
    // Egyszerű lekérdezés
    const result = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      LIMIT 3
    `;
    
    await client.end();
    
    console.log('✅ Közvetlen adatbázis kapcsolat sikeres!');
    console.log('📋 Adatbázis táblák:', result.map((row: any) => row.table_name).join(', ') || 'Nincsenek táblák');
    return true;
  } catch (error) {
    console.log('❌ Közvetlen adatbázis kapcsolat hiba:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase kapcsolat tesztelés indítása...\n');
  
  const results = await Promise.allSettled([
    testSupabaseConnection(),
    testSupabaseAdmin(),
    testDirectDatabase()
  ]);
  
  const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
  
  console.log(`\n📊 Eredmények: ${successCount}/3 teszt sikeres`);
  
  if (successCount === 3) {
    console.log('🎉 Minden kapcsolat működik!');
  } else {
    console.log('⚠️  Néhány kapcsolat nem működik. Ellenőrizd a környezeti változókat!');
  }
}

main().catch(console.error);
