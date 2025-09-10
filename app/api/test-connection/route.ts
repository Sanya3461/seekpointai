import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: {
        supabaseConnection: false,
        drizzleConnection: false,
        supabaseAuth: false,
        supabaseTables: [] as string[],
        drizzleTables: [] as string[]
      },
      errors: [] as string[]
    };

    // 1. Supabase kapcsolat tesztelése
    try {
      const { data, error } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5);

      if (error) {
        results.errors.push(`Supabase error: ${error.message}`);
      } else {
        results.tests.supabaseConnection = true;
        results.tests.supabaseTables = data?.map((t: any) => t.table_name) || [];
      }
    } catch (error) {
      results.errors.push(`Supabase connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 2. Supabase Auth tesztelése
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser();
      if (!error) {
        results.tests.supabaseAuth = true;
      } else {
        results.errors.push(`Supabase Auth error: ${error.message}`);
      }
    } catch (error) {
      results.errors.push(`Supabase Auth failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 3. Drizzle kapcsolat tesztelése
    try {
      const tables = await db.execute(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        LIMIT 5
      `);
      
      results.tests.drizzleConnection = true;
      results.tests.drizzleTables = tables.rows?.map((row: any) => row.table_name) || [];
    } catch (error) {
      results.errors.push(`Drizzle connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return NextResponse.json(results, { 
      status: results.errors.length > 0 ? 200 : 200 // Mindig 200, de errors-ben vannak a hibák
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Connection test failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
