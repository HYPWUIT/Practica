import { z } from 'zod'

export const jobTypeSchema = z.enum(['Full-time', 'Part-time', 'Apprenticeship'])

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  team: z.string(),
  location: z.string(),
  type: jobTypeSchema,
  summary: z.string(),
})

export type JobType = z.infer<typeof jobTypeSchema>
export type Job = z.infer<typeof jobSchema>
