import type { JSX } from 'react'
import { colorSwatches } from '../data/taxonomy'
import type { Category, ColorName } from '../types/product'

/**
 * Six category silhouettes standing in for photography.
 *
 * Written as inline SVG rather than files under `assets/` so the shapes can
 * inherit `currentColor` and be tinted per product — 24 photos' worth of
 * variety out of six drawings. Swapping in real images later means replacing
 * this component and nothing else.
 */
const shapes: Record<Category, JSX.Element> = {
  sofas: (
    <>
      <rect x="20" y="38" width="120" height="34" rx="8" opacity="0.55" />
      <rect x="14" y="62" width="132" height="28" rx="9" />
      <rect x="14" y="50" width="17" height="40" rx="8" opacity="0.8" />
      <rect x="129" y="50" width="17" height="40" rx="8" opacity="0.8" />
      <rect x="26" y="90" width="7" height="13" rx="2" opacity="0.7" />
      <rect x="127" y="90" width="7" height="13" rx="2" opacity="0.7" />
    </>
  ),
  chairs: (
    <>
      <rect x="52" y="22" width="56" height="42" rx="7" opacity="0.55" />
      <rect x="44" y="62" width="72" height="13" rx="5" />
      <rect x="50" y="75" width="7" height="30" rx="2" opacity="0.7" />
      <rect x="103" y="75" width="7" height="30" rx="2" opacity="0.7" />
    </>
  ),
  tables: (
    <>
      <rect x="18" y="46" width="124" height="11" rx="5" />
      <rect x="30" y="57" width="9" height="46" rx="3" opacity="0.7" />
      <rect x="121" y="57" width="9" height="46" rx="3" opacity="0.7" />
      <rect x="39" y="74" width="82" height="6" rx="3" opacity="0.45" />
    </>
  ),
  beds: (
    <>
      <rect x="16" y="26" width="15" height="60" rx="5" opacity="0.55" />
      <rect x="38" y="44" width="36" height="15" rx="6" opacity="0.8" />
      <rect x="30" y="56" width="112" height="24" rx="8" />
      <rect x="34" y="80" width="104" height="7" rx="3" opacity="0.45" />
      <rect x="36" y="87" width="7" height="14" rx="2" opacity="0.7" />
      <rect x="129" y="87" width="7" height="14" rx="2" opacity="0.7" />
    </>
  ),
  storage: (
    <>
      <rect x="32" y="24" width="96" height="78" rx="6" opacity="0.55" />
      <rect x="32" y="50" width="96" height="4" />
      <rect x="32" y="74" width="96" height="4" />
      <rect x="78" y="24" width="4" height="78" />
      <rect x="38" y="102" width="7" height="10" rx="2" opacity="0.7" />
      <rect x="115" y="102" width="7" height="10" rx="2" opacity="0.7" />
    </>
  ),
  lighting: (
    <>
      <path d="M60 26h40l9 30H51z" />
      <rect x="77" y="56" width="6" height="44" rx="3" opacity="0.7" />
      <rect x="58" y="98" width="44" height="7" rx="3" opacity="0.55" />
    </>
  ),
}

type ProductArtProps = {
  category: Category
  color: ColorName
  className?: string
}

function ProductArt({ category, color, className = '' }: ProductArtProps) {
  return (
    <div
      className={`flex items-center justify-center bg-mist ${className}`}
      style={{ color: colorSwatches[color] }}
    >
      <svg
        viewBox="0 0 160 120"
        className="h-full w-full max-h-full"
        role="presentation"
        aria-hidden="true"
        fill="currentColor"
      >
        {shapes[category]}
      </svg>
    </div>
  )
}

export default ProductArt
