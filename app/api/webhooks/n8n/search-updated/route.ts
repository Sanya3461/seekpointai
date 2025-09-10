import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { verify } from '@/lib/hmac';

const webhookSchema = z.object({
  search_id: z.string().uuid(),
  status: z.enum(['processing', 'ready', 'failed']),
  result_url: z.string().url().optional(),
  n8n_run_id: z.string().optional(),
  summary: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');

    // Verify HMAC signature
    if (!process.env.WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!signature || !verify(rawBody, signature, process.env.WEBHOOK_SECRET)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse and validate webhook data
    const data = JSON.parse(rawBody);
    const validatedData = webhookSchema.parse(data);

    // Find the search
    const search = await db.query.searches.findFirst({
      where: eq(db.searches.id, validatedData.search_id),
    });

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Update search status
    await db.update(db.searches)
      .set({
        status: validatedData.status,
        resultUrl: validatedData.result_url || search.resultUrl,
        n8nRunId: validatedData.n8n_run_id || search.n8nRunId,
        updatedAt: new Date(),
      })
      .where(eq(db.searches.id, validatedData.search_id));

    // Log n8n completion event
    await db.insert(db.events).values({
      searchId: validatedData.search_id,
      type: 'n8n_completed',
      payload: validatedData,
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid webhook payload', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
