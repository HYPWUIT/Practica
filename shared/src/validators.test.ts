import { describe, expect, test } from 'bun:test'
import { isExpiryValid, isLuhnValid } from './validators'

describe('isLuhnValid', () => {
  test('accepts well-known test card numbers, with or without spaces', () => {
    expect(isLuhnValid('4242424242424242')).toBe(true)
    expect(isLuhnValid('4242 4242 4242 4242')).toBe(true)
    expect(isLuhnValid('5555555555554444')).toBe(true)
  })

  test('rejects a wrong checksum and bad lengths', () => {
    expect(isLuhnValid('4242424242424241')).toBe(false)
    expect(isLuhnValid('424242424242')).toBe(false) // 12 digits
    expect(isLuhnValid('4'.repeat(20))).toBe(false)
  })
})

describe('isExpiryValid', () => {
  const now = new Date(2026, 8, 26) // September 2026

  test('a card is valid through its printed month', () => {
    expect(isExpiryValid('09/26', now)).toBe(true)
    expect(isExpiryValid('12/30', now)).toBe(true)
  })

  test('rejects past dates and malformed input', () => {
    expect(isExpiryValid('08/26', now)).toBe(false)
    expect(isExpiryValid('12/25', now)).toBe(false)
    expect(isExpiryValid('13/27', now)).toBe(false)
    expect(isExpiryValid('0927', now)).toBe(false)
  })
})
