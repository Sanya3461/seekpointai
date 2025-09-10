import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { sign } from '@/lib/hmac';

const dimensionSchema = z.object({
  name: z.string(),
  reason: z.string(),
});

const gradingSchema = z.object({
  dimensions: z.array(dimensionSchema),
  weights: z.record(z.string(), z.number()),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validatedData = gradingSchema.parse(data);

    // Validate weights sum to 100
    const totalWeight = Object.values(validatedData.weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(totalWeight - 100) > 0.1) {
      return NextResponse.json(
        { error: 'Weights must sum to exactly 100' },
        { status: 400 }
      );
    }

    // Find the search
    const search = await db.query.searches.findFirst({
      where: eq(db.searches.id, params.id),
    });

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Update search with grading data
    const [updatedSearch] = await db.update(db.searches)
      .set({
        status: 'grading_confirmed',
        weights: validatedData.weights,
        dimensions: validatedData.dimensions,
        updatedAt: new Date(),
      })
      .where(eq(db.searches.id, params.id))
      .returning();

    // Prepare n8n webhook payload
    const n8nPayload = {
      search_id: search.id,
      job_title: (search.criteria as any)?.job_title,
      job_description: search.jobDescription,
      criteria: search.criteria,
      weights: validatedData.weights,
      dimensions: validatedData.dimensions,
      contact: {
        name: search.contactName,
        email: search.contactEmail,
      },
    };

    const payloadString = JSON.stringify(n8nPayload);

    // Send to n8n webhook
    if (process.env.N8N_START_URL && process.env.WEBHOOK_SECRET) {
      const signature = sign(payloadString, process.env.WEBHOOK_SECRET);

      try {
        const response = await fetch(process.env.N8N_START_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-signature': signature,
          },
          body: payloadString,
        });

        if (!response.ok) {
          console.error('n8n webhook failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('n8n webhook error:', error);
      }
    }

    // Log grading confirmed event
    await db.insert(db.events).values({
      searchId: search.id,
      type: 'grading_confirmed',
      payload: validatedData,
    });

    return NextResponse.json({
      status: 'ok',
      next: `/searches/${search.id}`,
    });

  } catch (error) {
    console.error('Grading confirmation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
