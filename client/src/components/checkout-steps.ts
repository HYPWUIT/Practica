export type StepId = 'shipping' | 'payment' | 'review'

export const stepOrder: StepId[] = ['shipping', 'payment', 'review']

export const stepLabels: Record<StepId, string> = {
  shipping: 'Shipping',
  payment: 'Payment',
  review: 'Review',
}
