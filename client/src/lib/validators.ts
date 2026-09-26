/**
 * Card-field formatting while the user types. The matching validation rules
 * (Luhn, expiry) live in `@sage-oak/shared`, next to the schemas that use them.
 */

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
