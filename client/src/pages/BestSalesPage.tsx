import CatalogPage from './CatalogPage'

/** The catalogue preset to bestsellers, with the filter sidebar hidden. */
function BestSalesPage() {
  return (
    <CatalogPage
      bestsellersOnly
      title="Best sales"
      subtitle="The pieces that leave the workshop fastest."
    />
  )
}

export default BestSalesPage
