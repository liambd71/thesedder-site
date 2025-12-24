import { z } from 'zod';
import { insertChapterSchema, chapters } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  chapters: {
    list: {
      method: 'GET' as const,
      path: '/api/chapters',
      responses: {
        200: z.array(z.custom<typeof chapters.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/chapters/:id',
      responses: {
        200: z.custom<typeof chapters.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type ChapterResponse = z.infer<typeof api.chapters.get.responses[200]>;
export type ChaptersListResponse = z.infer<typeof api.chapters.list.responses[200]>;
