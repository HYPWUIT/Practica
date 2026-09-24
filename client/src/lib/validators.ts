/**
 * The only hand-written validation rules in the project. Everything else is
 * expressed declaratively in `schemas.ts`; these two exist because Zod has no
 * built-in for them.
 *
 * Both are format checks only. Nothing here talks to a payment processor, and
 * a card that passes is still entirely fictional.
 */

/** Digits only, 13–19 long, passing the Luhn checksum. */
export function isLuhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false

  let sum = 0
  let double = false

  // Walk right to left, doubling every second digit.
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i])
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }

  return sum % 10 === 0
}

const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/

/**
 * Accepts `MM/YY` and checks the card has not expired. A card is valid
 * through the last day of its printed month.
 */
export function isExpiryValid(expiry: string, now: Date = new Date()): boolean {
  const match = EXPIRY_PATTERN.exec(expiry.trim())
  if (!match) return false

  const month = Number(match[1])
  const year = 2000 + Number(match[2])

  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year !== currentYear) return year > currentYear
  return month >= currentMonth
}

/** Groups a card number in fours for display: 4242424242424242 → 4242 4242 … */
export function formatCardNumber(value: string): string {
  return (
    value
      .replace(/\D/g, '')
      .slice(0, 19)
      .match(/.{1,4}/g)
      ?.join(' ') ?? ''
  )
}

/** Keeps the expiry field as MM/YY while the user types. */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
