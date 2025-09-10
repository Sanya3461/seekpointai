import { pgTable, uuid, text, jsonb, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const searchStatusEnum = pgEnum('search_status', [
  'draft',
  'submitted', 
  'grading_confirmed',
  'processing',
  'ready',
  'failed'
]);

export const searches = pgTable('searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  jobDescription: text('job_description').notNull(),
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  comments: text('comments'),
  status: searchStatusEnum('status').default('submitted').notNull(),
  weights: jsonb('weights'),
  dimensions: jsonb('dimensions'),
  criteria: jsonb('criteria'),
  n8nRunId: text('n8n_run_id'),
  resultUrl: text('result_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  searchId: uuid('search_id').notNull().references(() => searches.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  storageKey: text('storage_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  searchId: uuid('search_id').notNull().references(() => searches.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const searchesRelations = relations(searches, ({ many }) => ({
  attachments: many(attachments),
  events: many(events),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  search: one(searches, {
    fields: [attachments.searchId],
    references: [searches.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  search: one(searches, {
    fields: [events.searchId],
    references: [searches.id],
  }),
}));

// TypeScript types
export type Search = typeof searches.$inferSelect;
export type NewSearch = typeof searches.$inferInsert;
export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type SearchStatus = typeof searchStatusEnum.enumValues[number];