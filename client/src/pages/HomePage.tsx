import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { fetchBestsellers, queryKeys } from '../api/catalog'
import ProductArt from '../components/ProductArt'
import ProductGrid from '../components/ProductGrid'
import ProductGridSkeleton from '../components/skeletons/ProductGridSkeleton'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { buttonClasses } from '../components/ui/button-styles'
import { categoryOptions } from '../data/filters'
import { useToast } from '../hooks/useToast'
import { newsletterSchema } from '../lib/schemas'

/** Representative product per category, for the tile artwork. */
const tileColors = {
  sofas: 'sage',
  chairs: 'natural',
  tables: 'walnut',
  beds: 'cream',
  storage: 'walnut',
  lighting: 'charcoal',
} as const

function HomePage() {
  const { notify } = useToast()

  const { data: bestsellers = [], isPending: bestsellersPending } = useQuery({
    queryKey: queryKeys.bestsellers(3),
    queryFn: () => fetchBestsellers(3),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  const subscribe = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    notify('Thanks — nothing was actually signed up, but the form works.')
    reset()
  })

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
            Made in Chișinău since 2009
          </p>
          <h1 className="mt-4 text-5xl leading-tight lg:text-6xl">
            Furniture you stop noticing, in the best way
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted">
            Solid timber, honest joinery and covers that come off for washing.
            Built to be repaired rather than replaced.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/catalog" className={buttonClasses({ size: 'lg' })}>
              Browse the shop
            </Link>
            <Link
              to="/best-sales"
              className={buttonClasses({ variant: 'secondary', size: 'lg' })}
            >
              See best sales
            </Link>
          </div>
        </div>

        <ProductArt
          category="sofas"
          color="sage"
          className="aspect-[4/3] rounded-2xl"
        />
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl">Shop by room</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categoryOptions.map((option) => (
            <li key={option.value}>
              <Link
                to={`/catalog?category=${option.value}`}
                className="group block overflow-hidden rounded-xl border border-line transition-colors hover:border-sage-300"
              >
                <ProductArt
                  category={option.value}
                  color={tileColors[option.value]}
                  className="aspect-square"
                />
                <div className="p-3">
                  <p className="text-sm group-hover:text-sage-700">
                    {option.label}
                  </p>
                  <p className="text-xs text-muted">{option.count} pieces</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl">Leaving fastest</h2>
          <Link to="/best-sales" className="text-sm text-sage-700 hover:underline">
            See all best sales
          </Link>
        </div>
        {bestsellersPending ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <ProductGrid products={bestsellers} />
        )}
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl bg-shell px-6 py-12 text-center">
          <h2 className="text-2xl">Two emails a year, maybe three</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            New pieces and workshop news. No discount countdowns.
          </p>
          <form
            onSubmit={subscribe}
            noValidate
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 text-left sm:flex-row sm:items-start"
          >
            <div className="flex-1">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <Button type="submit" loading={isSubmitting} className="sm:mt-7">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}

export default HomePage
