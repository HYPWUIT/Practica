import type { ReactNode } from 'react'
import {
  categoryOptions,
  colorOptions,
  materialOptions,
  priceBounds,
} from '../data/filters'
import { colorSwatches, lightSwatches } from '../data/taxonomy'
import type { Criteria } from '../lib/filter'
import { activeFilterCount } from '../lib/filter'
import type { Category, ColorName, Material } from '../types/product'
import Checkbox from './ui/Checkbox'
import PriceRange from './ui/PriceRange'

type FilterSidebarProps = {
  criteria: Criteria
  onChange: (patch: Partial<Criteria>) => void
  onClear: () => void
  /** The drawer already has a "Filters" header; do not print a second one. */
  hideHeading?: boolean
}

/** Adds or removes one value from a facet's selection. */
function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 font-sans text-xs font-semibold tracking-widest text-ink uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}

function FilterSidebar({
  criteria,
  onChange,
  onClear,
  hideHeading = false,
}: FilterSidebarProps) {
  const active = activeFilterCount(criteria)

  return (
    <aside aria-label="Filters">
      {(!hideHeading || active > 0) && (
        <div
          className={`flex items-center pb-4 ${
            hideHeading ? 'justify-end' : 'justify-between'
          }`}
        >
          {!hideHeading && <h2 className="text-lg">Filters</h2>}
          {active > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-sage-700 hover:underline"
            >
              Clear all ({active})
            </button>
          )}
        </div>
      )}

      <Section title="Category">
        <div className="space-y-2.5">
          {categoryOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              count={option.count}
              checked={criteria.categories.includes(option.value)}
              onChange={() =>
                onChange({
                  categories: toggle<Category>(
                    criteria.categories,
                    option.value,
                  ),
                })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Price">
        <PriceRange
          min={priceBounds.min}
          max={priceBounds.max}
          step={priceBounds.step}
          value={{ min: criteria.min, max: criteria.max }}
          onCommit={(value) => onChange(value)}
        />
      </Section>

      <Section title="Material">
        <div className="space-y-2.5">
          {materialOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              count={option.count}
              checked={criteria.materials.includes(option.value)}
              onChange={() =>
                onChange({
                  materials: toggle<Material>(criteria.materials, option.value),
                })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Colour">
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => {
            const selected = criteria.colors.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                title={`${option.label} (${option.count})`}
                onClick={() =>
                  onChange({
                    colors: toggle<ColorName>(criteria.colors, option.value),
                  })
                }
                className={`size-8 rounded-full transition-[outline-offset] ${
                  selected
                    ? 'outline-2 outline-offset-2 outline-sage-600'
                    : 'outline-1 outline-offset-1 outline-transparent hover:outline-line'
                } ${
                  // Pale swatches need an edge or they vanish on white.
                  lightSwatches.includes(option.value)
                    ? 'ring-1 ring-line ring-inset'
                    : ''
                }`}
                style={{ backgroundColor: colorSwatches[option.value] }}
              >
                <span className="sr-only">
                  {option.label} ({option.count})
                </span>
              </button>
            )
          })}
        </div>
      </Section>
    </aside>
  )
}

export default FilterSidebar
