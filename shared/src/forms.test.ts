import { describe, expect, test } from 'bun:test'
import { changePasswordSchema, passwordSchema, profileSchema, signupSchema } from './forms'

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

describe('profileSchema', () => {
  test('trims the name and requires at least 2 characters', () => {
    expect(profileSchema.parse({ name: '  Ana  ' }).name).toBe('Ana')
    expect(profileSchema.safeParse({ name: ' A ' }).success).toBe(false)
    expect(profileSchema.safeParse({ name: 'x'.repeat(81) }).success).toBe(false)
  })
})

describe('changePasswordSchema', () => {
  const valid = {
    currentPassword: 'Robin12345',
    newPassword: 'Oakwood2026',
    confirmPassword: 'Oakwood2026',
    revokeOtherSessions: true,
  }
  const pathsFor = (patch: object) =>
    changePasswordSchema.safeParse({ ...valid, ...patch }).error?.issues.map((i) => i.path[0])

  test('accepts a valid change', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true)
  })

  test('applies the new-password rules', () => {
    expect(pathsFor({ newPassword: 'weak', confirmPassword: 'weak' })).toContain('newPassword')
  })

  test('requires a matching confirmation', () => {
    expect(pathsFor({ confirmPassword: 'Oakwood2027' })).toEqual(['confirmPassword'])
  })

  test('refuses reusing the current password', () => {
    expect(
      pathsFor({ newPassword: 'Robin12345', confirmPassword: 'Robin12345' }),
    ).toEqual(['newPassword'])
  })
})
