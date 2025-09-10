import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { suggestDimensions } from '@/lib/suggest';

const searchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  job_description: z.string().min(1, 'Job description is required'),
  seniority: z.string().min(1, 'Seniority is required'),
  location_preference: z.string().optional(),
  employment_type: z.string().optional(),
  must_have_keywords: z.string().optional(),
  nice_to_have_keywords: z.string().optional(),
  budget_salary_range: z.string().optional(),
  contact_name: z.string().min(1, 'Contact name is required'),
  company: z.string().optional(),
  contact_email: z.string().email('Valid email is required'),
  comments: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Validate form data
    const data = {
      name: formData.get('name') as string,
      job_title: formData.get('job_title') as string,
      job_description: formData.get('job_description') as string,
      seniority: formData.get('seniority') as string,
      location_preference: formData.get('location_preference') as string || undefined,
      employment_type: formData.get('employment_type') as string || undefined,
      must_have_keywords: formData.get('must_have_keywords') as string || undefined,
      nice_to_have_keywords: formData.get('nice_to_have_keywords') as string || undefined,
      budget_salary_range: formData.get('budget_salary_range') as string || undefined,
      contact_name: formData.get('contact_name') as string,
      company: formData.get('company') as string || undefined,
      contact_email: formData.get('contact_email') as string,
      comments: formData.get('comments') as string || undefined,
    };

    const validatedData = searchSchema.parse(data);

    // Prepare criteria object for storage
    const criteria = {
      job_title: validatedData.job_title,
      seniority: validatedData.seniority,
      location_preference: validatedData.location_preference,
      employment_type: validatedData.employment_type,
      must_have_keywords: validatedData.must_have_keywords,
      nice_to_have_keywords: validatedData.nice_to_have_keywords,
      budget_salary_range: validatedData.budget_salary_range,
      company: validatedData.company,
    };

    // Create search record
    const [search] = await db.insert(db.searches).values({
      name: validatedData.name,
      jobDescription: validatedData.job_description,
      contactName: validatedData.contact_name,
      contactEmail: validatedData.contact_email,
      comments: validatedData.comments,
      status: 'submitted',
      criteria: criteria,
    }).returning();

    // Handle file uploads
    const attachments = formData.getAll('attachments') as File[];
    const validAttachments = attachments.filter(file => file.size > 0);

    for (const file of validAttachments) {
      const fileBuffer = await file.arrayBuffer();
      const fileName = file.name;
      const storageKey = `searches/${search.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabaseAdmin.storage
        .from('attachments')
        .upload(storageKey, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload file: ${fileName}`);
      }

      // Save attachment record
      await db.insert(db.attachments).values({
        searchId: search.id,
        fileName: fileName,
        mimeType: file.type,
        fileSize: file.size,
        storageKey: storageKey,
      });
    }

    // Log form submission event
    await db.insert(db.events).values({
      searchId: search.id,
      type: 'form_submitted',
      payload: { attachments: validAttachments.length },
    });

    // Generate grading suggestion
    const gradingSuggestion = suggestDimensions(validatedData.job_description, validatedData.job_title);

    return NextResponse.json({
      id: search.id,
      grading_suggestion: gradingSuggestion,
      next: `/ai-search/grading?searchId=${search.id}`,
    });

  } catch (error) {
    console.error('Search creation error:', error);
    
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
