import { z } from 'zod'
import { isExpiryValid, isLuhnValid } from './validators'

/**
 * Every form's rules in one place. Form types come from `z.infer`, so a field
 * is never declared twice — change the schema and the component's types follow.
 */

const requiredText = (field: string, min = 2) =>
  z.string().trim().min(min, `${field} is required`)

// ─── Auth ───────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z
  .object({
    name: requiredText('Name'),
    email: z.email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ─── Contact & careers ──────────────────────────────────────────────────

export const contactSchema = z.object({
  name: requiredText('Name'),
  email: z.email('Enter a valid email address'),
  subject: requiredText('Subject', 3),
  message: z.string().trim().min(20, 'Tell us a little more — 20 characters minimum'),
})

export const applicationSchema = z.object({
  name: requiredText('Name'),
  email: z.email('Enter a valid email address'),
  position: z.string().min(1, 'Choose a position'),
  portfolio: z.union([z.literal(''), z.url('Enter a valid URL')]),
  coverLetter: z
    .string()
    .trim()
    .min(50, 'A short note helps — 50 characters minimum'),
})

// ─── Checkout ───────────────────────────────────────────────────────────

export const shippingSchema = z.object({
  fullName: requiredText('Full name'),
  address1: requiredText('Address', 4),
  address2: z.string().trim().optional(),
  city: requiredText('City'),
  postalCode: z.string().trim().min(3, 'Enter a valid postal code'),
  country: z.string().min(1, 'Choose a country'),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s+()-]{7,20}$/, 'Enter a valid phone number'),
})

export const paymentSchema = z.object({
  cardName: requiredText('Name on card'),
  cardNumber: z
    .string()
    .refine(isLuhnValid, 'That card number is not valid'),
  expiry: z
    .string()
    .refine(isExpiryValid, 'Enter a future expiry date as MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter the 3 or 4 digit code'),
})

/**
 * Checkout runs as one form across three steps, so the steps share a single
 * schema and `trigger()` validates a slice of it at a time.
 */
export const checkoutSchema = z.object({
  ...shippingSchema.shape,
  ...paymentSchema.shape,
})

/** Field names per step, for `trigger()` in Phase 6. */
export const checkoutStepFields = {
  shipping: Object.keys(shippingSchema.shape),
  payment: Object.keys(paymentSchema.shape),
} as const

// ─── Newsletter ─────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.email('Enter a valid email address'),
})

// ─── Inferred form types ────────────────────────────────────────────────

export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
export type ContactValues = z.infer<typeof contactSchema>
export type ApplicationValues = z.infer<typeof applicationSchema>
export type ShippingValues = z.infer<typeof shippingSchema>
export type PaymentValues = z.infer<typeof paymentSchema>
export type CheckoutValues = z.infer<typeof checkoutSchema>
export type NewsletterValues = z.infer<typeof newsletterSchema>
