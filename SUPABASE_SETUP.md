# Supabase Integration Setup

Ez a projekt Supabase-szal van integrálva. A következő környezeti változókat kell beállítanod:

## Környezeti változók (.env.local fájlban)

```env
# Supabase Configuration
SUPABASE_URL=https://jwkfmkpdnliieyacrxel.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2Zta3BkbmxpaWV5YWNyeGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTQ1ODAsImV4cCI6MjA3MzAzMDU4MH0.Myvf5mUBldUYtK3eCeFswZK4Id4tKEz0WEr-evKIsfs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2Zta3BkbmxpaWV5YWNyeGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ1NDU4MCwiZXhwIjoyMDczMDMwNTgwfQ.MGXI-EyFF9PCrF1yos1hSdCqmpbWpv_RE8KBRQv1OPM

# Frontend Supabase (NEXT_PUBLIC_ prefix szükséges)
NEXT_PUBLIC_SUPABASE_URL=https://jwkfmkpdnliieyacrxel.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a2Zta3BkbmxpaWV5YWNyeGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTQ1ODAsImV4cCI6MjA3MzAzMDU4MH0.Myvf5mUBldUYtK3eCeFswZK4Id4tKEz0WEr-evKIsfs

# Database URL for Drizzle ORM (using transaction pooler)
DATABASE_URL=postgresql://postgres.jwkfmkpdnliieyacrxel:ZorbaGimi852%21@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

## Használat

### Frontend (React komponensekben)
```typescript
import { supabase } from '@/lib/supabase';

// Példa: adatok lekérése
const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

### Backend (API routes-ban)
```typescript
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Példa: admin műveletek
const { data, error } = await supabaseAdmin
  .from('your_table')
  .select('*');
```

### Drizzle ORM használata
```typescript
import { db } from '@/db';

// Példa: lekérdezés
const users = await db.query.users.findMany();
```

## Adatbázis migrációk

```bash
# Migrációk generálása
npm run db:generate

# Migrációk futtatása
npm run db:migrate
```

## Kapcsolat Tesztelése

### 1. 🌐 Webes Tesztelő (Ajánlott)
Nyisd meg a böngészőben: `http://localhost:3000/test-connection`

Ez egy szép UI-val ellátott oldal, ahol egy kattintással tesztelheted az összes kapcsolatot.

### 2. 🔧 API Endpoint Tesztelése
```bash
curl http://localhost:3000/api/test-connection
```

### 3. 💻 Parancssor Script
```bash
npm run test:connection
```

### 4. 🚀 Fejlesztői szerver indítása
```bash
npm run dev
```

## Fontos megjegyzések

1. **Biztonság**: A `SUPABASE_SERVICE_ROLE_KEY` csak szerver oldalon használandó, soha ne küldd el a kliensnek!
2. **Pooler**: A transaction pooler-t használjuk (`6543` port), ami jobb teljesítményt biztosít.
3. **SSL**: Az `sslmode=require` biztosítja a biztonságos kapcsolatot.
4. **pgbouncer**: A `pgbouncer=true` paraméter engedélyezi a connection pooling-ot.
5. **Tesztelés**: Mindig teszteld a kapcsolatot a fejlesztés előtt!
