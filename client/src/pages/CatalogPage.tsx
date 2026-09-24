import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import FilterSidebar from '../components/FilterSidebar'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { buttonClasses } from '../components/ui/button-styles'
import { products } from '../data/products'
import type { Criteria } from '../lib/filter'
import {
  activeFilterCount,
  criteriaToParams,
  filterProducts,
  parseCriteria,
  sortOptions,
} from '../lib/filter'

type CatalogPageProps = {
  /** Powers /best-sales, which is this page with the filters hidden. */
  bestsellersOnly?: boolean
  title?: string
  subtitle?: string
}

function CatalogPage({
  bestsellersOnly = false,
  title = 'Shop',
  subtitle = 'Everything we make, and a few things we only make sometimes.',
}: CatalogPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  // The URL is the state. Nothing is mirrored into component state, so a
  // pasted link and a clicked filter land in exactly the same place.
  const criteria = useMemo(
    () => parseCriteria(searchParams),
    [searchParams],
  )

  const results = useMemo(
    () => filterProducts(products, criteria, { bestsellersOnly }),
    [criteria, bestsellersOnly],
  )

  const update = (patch: Partial<Criteria>) => {
    // `replace` so dragging the price slider does not fill the back button.
    setSearchParams(criteriaToParams({ ...criteria, ...patch }), {
      replace: true,
    })
  }

  const clear = () => setSearchParams(new URLSearchParams(), { replace: true })

  const hasFilters = activeFilterCount(criteria) > 0 || criteria.q !== ''

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl">{title}</h1>
        <p className="mt-2 max-w-prose text-muted">{subtitle}</p>
      </header>

      <div
        className={
          bestsellersOnly ? '' : 'grid gap-10 lg:grid-cols-[16rem_1fr]'
        }
      >
        {!bestsellersOnly && (
          <FilterSidebar
            criteria={criteria}
            onChange={update}
            onClear={clear}
          />
        )}

        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchBar
                value={criteria.q}
                onChange={(q) => update({ q })}
                placeholder="Search by name, material or colour"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted">
              Sort
              <select
                value={criteria.sort}
                onChange={(event) =>
                  update({ sort: event.target.value as Criteria['sort'] })
                }
                className="rounded-full border border-line bg-canvas px-3 py-2 text-sm text-ink hover:border-sage-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p aria-live="polite" className="mb-5 text-sm text-muted">
            {results.length} {results.length === 1 ? 'product' : 'products'}
            {criteria.q && (
              <>
                {' '}
                for <span className="text-ink">“{criteria.q}”</span>
              </>
            )}
          </p>

          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <EmptyState
              title="Nothing matches that"
              description={
                hasFilters
                  ? 'Try widening the price range or clearing a filter or two.'
                  : 'The catalogue is empty, which should not be possible.'
              }
              action={
                hasFilters ? (
                  <Button variant="secondary" onClick={clear}>
                    Clear filters
                  </Button>
                ) : (
                  <Link to="/" className={buttonClasses()}>
                    Back home
                  </Link>
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
