import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import CheckoutSteps from '../components/CheckoutSteps'
import type { StepId } from '../components/checkout-steps'
import { stepOrder } from '../components/checkout-steps'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { buttonClasses } from '../components/ui/button-styles'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/format'
import type { CheckoutValues } from '../lib/schemas'
import { checkoutSchema, checkoutStepFields } from '../lib/schemas'
import { formatCardNumber, formatExpiry } from '../lib/validators'

const countries = [
  { value: 'md', label: 'Moldova' },
  { value: 'ro', label: 'Romania' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]

/** Fictional, and deliberately shaped so nobody mistakes it for a real one. */
function fakeOrderNumber(): string {
  return `SO-${Math.floor(100000 + Math.random() * 900000)}`
}

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart()
  const [step, setStep] = useState<StepId>('shipping')
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    // Errors clear as the user fixes them, once they have submitted once.
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  })

  if (orderNumber) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
          Order placed
        </p>
        <h1 className="mt-3 text-4xl">Thank you</h1>
        <p className="mt-4 text-muted">
          Your order number is{' '}
          <span className="text-ink tabular-nums">{orderNumber}</span>. No
          payment was taken and nothing will be delivered — this shop is a
          frontend practice project.
        </p>
        <Link to="/catalog" className={buttonClasses({ className: 'mt-8' })}>
          Keep shopping
        </Link>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="mb-8 text-center text-4xl">Checkout</h1>
        <EmptyState
          title="There is nothing to check out"
          description="Add something to your cart first."
          action={
            <Link to="/catalog" className={buttonClasses()}>
              Browse the shop
            </Link>
          }
        />
      </div>
    )
  }

  /**
   * One form across all three steps: advancing validates only that step's
   * fields, so going back never loses what was already typed.
   */
  const next = async () => {
    const fields = checkoutStepFields[
      step as 'shipping' | 'payment'
    ] as (keyof CheckoutValues)[]

    if (await trigger(fields)) {
      setStep(stepOrder[stepOrder.indexOf(step) + 1])
    }
  }

  const back = () => setStep(stepOrder[stepOrder.indexOf(step) - 1])

  const placeOrder = handleSubmit(async () => {
    // Where a real integration would go. Here it just clears the cart.
    await new Promise((resolve) => setTimeout(resolve, 700))
    setOrderNumber(fakeOrderNumber())
    clear()
  })

  // Card fields are reformatted as they are typed, so the value RHF stores is
  // the same one the user can see.
  const masked = (
    name: 'cardNumber' | 'expiry',
    format: (value: string) => string,
  ) => {
    const field = register(name)
    return {
      ...field,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = format(event.target.value)
        return field.onChange(event)
      },
    }
  }

  const values = getValues()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-4xl">Checkout</h1>
      <CheckoutSteps current={step} />

      <form onSubmit={placeOrder} noValidate>
        {step === 'shipping' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Full name"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register('fullName')}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Address"
                autoComplete="address-line1"
                error={errors.address1?.message}
                {...register('address1')}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Apartment, floor (optional)"
                autoComplete="address-line2"
                error={errors.address2?.message}
                {...register('address2')}
              />
            </div>
            <Input
              label="City"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="Postal code"
              autoComplete="postal-code"
              error={errors.postalCode?.message}
              {...register('postalCode')}
            />
            <Select
              label="Country"
              placeholder="Choose a country"
              options={countries}
              error={errors.country?.message}
              {...register('country')}
            />
            <Input
              label="Phone"
              type="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
        )}

        {step === 'payment' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Name on card"
                autoComplete="cc-name"
                error={errors.cardName?.message}
                {...register('cardName')}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Card number"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                hint="Format is checked with a Luhn checksum. No card is charged."
                error={errors.cardNumber?.message}
                {...masked('cardNumber', formatCardNumber)}
              />
            </div>
            <Input
              label="Expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              error={errors.expiry?.message}
              {...masked('expiry', formatExpiry)}
            />
            <Input
              label="CVV"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              error={errors.cvv?.message}
              {...register('cvv')}
            />
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <section className="rounded-xl border border-line p-5">
              <h2 className="mb-3 text-lg">Order</h2>
              <ul className="space-y-2 text-sm">
                {lines.map((line) => (
                  <li key={line.product.id} className="flex justify-between gap-4">
                    <span>
                      {line.product.name}{' '}
                      <span className="text-muted">× {line.qty}</span>
                    </span>
                    <span className="tabular-nums">
                      {formatPrice(line.lineTotal)}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-line pt-2 text-base">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </li>
              </ul>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <section className="rounded-xl border border-line p-5 text-sm">
                <h2 className="mb-3 text-lg">Delivering to</h2>
                <p>{values.fullName}</p>
                <p className="text-muted">{values.address1}</p>
                {values.address2 && (
                  <p className="text-muted">{values.address2}</p>
                )}
                <p className="text-muted">
                  {values.city}, {values.postalCode}
                </p>
                <p className="text-muted">
                  {countries.find((c) => c.value === values.country)?.label}
                </p>
                <p className="mt-2 text-muted">{values.phone}</p>
              </section>

              <section className="rounded-xl border border-line p-5 text-sm">
                <h2 className="mb-3 text-lg">Paying with</h2>
                <p>{values.cardName}</p>
                <p className="text-muted tabular-nums">
                  {/* Never echo a full card number back, even a fake one. */}
                  •••• {values.cardNumber.replace(/\D/g, '').slice(-4)}
                </p>
                <p className="text-muted tabular-nums">
                  Expires {values.expiry}
                </p>
              </section>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step === 'shipping' ? (
            <Link to="/cart" className="text-sm text-muted hover:text-sage-700">
              Back to cart
            </Link>
          ) : (
            <Button variant="ghost" onClick={back}>
              Back
            </Button>
          )}

          {step === 'review' ? (
            <Button type="submit" size="lg" loading={isSubmitting}>
              Place order
            </Button>
          ) : (
            <Button size="lg" onClick={next}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
