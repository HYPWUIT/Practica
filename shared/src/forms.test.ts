import { describe, expect, test } from 'bun:test'
import { passwordSchema, signupSchema } from './forms'

const messageFor = (password: string) =>
  passwordSchema.safeParse(password).error?.issues[0]?.message

describe('passwordSchema', () => {
  test('accepts a password meeting every rule', () => {
    expect(passwordSchema.safeParse('Robin12345').success).toBe(true)
  })

  test('explains which rule failed', () => {
    expect(messageFor('Ab1')).toBe('Password must be at least 8 characters')
    expect(messageFor('ALLUPPER123')).toBe('Include at least one lowercase letter')
    expect(messageFor('alllower123')).toBe('Include at least one uppercase letter')
    expect(messageFor('NoDigitsHere')).toBe('Include at least one number')
  })

  test('caps length at 128, matching Better Auth', () => {
    const base = 'Aa1'
    expect(passwordSchema.safeParse(base + 'x'.repeat(125)).success).toBe(true)
    expect(passwordSchema.safeParse(base + 'x'.repeat(126)).success).toBe(false)
  })
})

describe('signupSchema', () => {
  const valid = {
    name: 'Ana',
    email: 'ana@example.com',
    password: 'Robin12345',
    confirmPassword: 'Robin12345',
  }

  test('accepts a valid sign-up', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  test('reports a mismatched confirmation on confirmPassword', () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: 'Robin54321' })
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword'])
  })
})
