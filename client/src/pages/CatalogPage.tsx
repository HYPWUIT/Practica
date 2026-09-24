import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { fetchCatalog, queryKeys } from '../api/catalog'
import FilterSidebar from '../components/FilterSidebar'
import ProductGrid from '../components/ProductGrid'
import QueryError from '../components/QueryError'
import ProductGridSkeleton from '../components/skeletons/ProductGridSkeleton'
import SearchBar from '../components/SearchBar'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Sheet from '../components/ui/Sheet'
import { buttonClasses } from '../components/ui/button-styles'
import type { Criteria } from '../lib/filter'
import {
  activeFilterCount,
  criteriaToParams,
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
  const [filtersOpen, setFiltersOpen] = useState(false)

  // The URL is the state. Nothing is mirrored into component state, so a
  // pasted link and a clicked filter land in exactly the same place.
  const criteria = useMemo(
    () => parseCriteria(searchParams),
    [searchParams],
  )

  const {
    data: results = [],
    isPending,
    isError,
    refetch,
    // True while a *new* filter combination loads and the previous results are
    // still on screen — dimming them beats flashing skeletons on every click.
    isPlaceholderData,
  } = useQuery({
    queryKey: queryKeys.catalog(criteria, bestsellersOnly),
    queryFn: () => fetchCatalog(criteria, { bestsellersOnly }),
    placeholderData: keepPreviousData,
  })

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
        {/* Below lg the sidebar would push the products off the screen, so it
            moves into a drawer instead. */}
        {!bestsellersOnly && (
          <div className="hidden lg:block">
            <FilterSidebar
              criteria={criteria}
              onChange={update}
              onClear={clear}
            />
          </div>
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

            {!bestsellersOnly && (
              <Button
                variant="secondary"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden"
              >
                Filters
                {activeFilterCount(criteria) > 0 && (
                  <span className="rounded-full bg-sage-600 px-1.5 text-xs text-canvas">
                    {activeFilterCount(criteria)}
                  </span>
                )}
              </Button>
            )}

            <label className="flex items-center gap-2 text-sm text-muted">
              Sort
              <select
                aria-label="Sort products"
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
            {isPending ? (
              'Loading products…'
            ) : (
              <>
                {results.length}{' '}
                {results.length === 1 ? 'product' : 'products'}
                {criteria.q && (
                  <>
                    {' '}
                    for <span className="text-ink">“{criteria.q}”</span>
                  </>
                )}
              </>
            )}
          </p>

          {isPending ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <QueryError
              title="The catalogue did not load"
              onRetry={() => void refetch()}
            />
          ) : results.length > 0 ? (
            <ProductGrid
              products={results}
              className={
                isPlaceholderData ? 'opacity-50 transition-opacity' : ''
              }
            />
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

      {!bestsellersOnly && (
        <Sheet
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title="Filters"
        >
          <FilterSidebar
            hideHeading
            criteria={criteria}
            onChange={update}
            onClear={clear}
          />
          <Button
            fullWidth
            className="mt-6"
            onClick={() => setFiltersOpen(false)}
          >
            Show {results.length}{' '}
            {results.length === 1 ? 'product' : 'products'}
          </Button>
        </Sheet>
      )}
    </div>
  )
}

export default CatalogPage
