import type { Product } from '../types/product'

/**
 * The whole catalogue. Four products per category so every filter has
 * something to bite on and no facet ever comes back empty on its own.
 *
 * Prices are cents. Dimensions are centimetres.
 */
export const products: Product[] = [
  // ─── Sofas ────────────────────────────────────────────────────────────
  {
    id: 'p01',
    slug: 'alder-three-seat-sofa',
    name: 'Alder Three-Seat Sofa',
    price: 149900,
    category: 'sofas',
    material: 'linen',
    color: 'sage',
    bestseller: true,
    description:
      'A deep, low sofa with a kiln-dried beech frame and feather-wrapped cushions. The linen softens with use rather than wearing out.',
    dimensions: { width: 218, depth: 94, height: 78 },
    inStock: true,
  },
  {
    id: 'p02',
    slug: 'fenwick-loveseat',
    name: 'Fenwick Loveseat',
    price: 98900,
    category: 'sofas',
    material: 'linen',
    color: 'cream',
    bestseller: false,
    description:
      'Built for smaller rooms without feeling like a compromise. Tight back, tapered oak legs, a seat you can still fall asleep on.',
    dimensions: { width: 156, depth: 88, height: 76 },
    inStock: true,
  },
  {
    id: 'p03',
    slug: 'marlow-corner-sofa',
    name: 'Marlow Corner Sofa',
    price: 229900,
    category: 'sofas',
    material: 'leather',
    color: 'charcoal',
    bestseller: true,
    description:
      'Full-grain leather over a hardwood frame. It arrives stiff and honest, and spends the next decade becoming yours.',
    dimensions: { width: 286, depth: 186, height: 74 },
    inStock: true,
  },
  {
    id: 'p04',
    slug: 'bramble-daybed',
    name: 'Bramble Daybed',
    price: 119900,
    category: 'sofas',
    material: 'linen',
    color: 'ochre',
    bestseller: false,
    description:
      'Half sofa, half spare bed. The bolsters lift away so the whole surface opens up for a guest who stayed too late.',
    dimensions: { width: 198, depth: 86, height: 68 },
    inStock: false,
  },

  // ─── Chairs ───────────────────────────────────────────────────────────
  {
    id: 'p05',
    slug: 'thatch-dining-chair',
    name: 'Thatch Dining Chair',
    price: 24900,
    category: 'chairs',
    material: 'oak',
    color: 'natural',
    bestseller: true,
    description:
      'Solid oak, steam-bent back, no visible fixings. Stackable in threes, which matters more than it sounds at a dinner party.',
    dimensions: { width: 46, depth: 52, height: 82 },
    inStock: true,
  },
  {
    id: 'p06',
    slug: 'corbel-armchair',
    name: 'Corbel Armchair',
    price: 89900,
    category: 'chairs',
    material: 'leather',
    color: 'walnut',
    bestseller: false,
    description:
      'A reading chair with a high back and a seat angled a few degrees further than you expect. That angle is the whole point.',
    dimensions: { width: 78, depth: 84, height: 96 },
    inStock: true,
  },
  {
    id: 'p07',
    slug: 'wren-lounge-chair',
    name: 'Wren Lounge Chair',
    price: 64900,
    category: 'chairs',
    material: 'rattan',
    color: 'natural',
    bestseller: true,
    description:
      'Hand-woven rattan on an ash frame. Light enough to move with one hand, sturdy enough that you never think about it.',
    dimensions: { width: 72, depth: 76, height: 84 },
    inStock: true,
  },
  {
    id: 'p08',
    slug: 'pike-counter-stool',
    name: 'Pike Counter Stool',
    price: 18900,
    category: 'chairs',
    material: 'ash',
    color: 'charcoal',
    bestseller: false,
    description:
      'Blackened ash with a footrest set where your heel actually lands. Sized for a standard 90cm counter.',
    dimensions: { width: 40, depth: 42, height: 74 },
    inStock: true,
  },

  // ─── Tables ───────────────────────────────────────────────────────────
  {
    id: 'p09',
    slug: 'harrow-dining-table',
    name: 'Harrow Dining Table',
    price: 159900,
    category: 'tables',
    material: 'oak',
    color: 'natural',
    bestseller: true,
    description:
      'A single slab of white oak on trestle legs, finished with hardwax oil so a scratch sands out instead of staying forever.',
    dimensions: { width: 220, depth: 96, height: 75 },
    inStock: true,
  },
  {
    id: 'p10',
    slug: 'kestrel-coffee-table',
    name: 'Kestrel Coffee Table',
    price: 69900,
    category: 'tables',
    material: 'walnut',
    color: 'walnut',
    bestseller: false,
    description:
      'Book-matched walnut with a lower shelf deep enough for the things that otherwise end up on the floor.',
    dimensions: { width: 124, depth: 64, height: 38 },
    inStock: true,
  },
  {
    id: 'p11',
    slug: 'glint-side-table',
    name: 'Glint Side Table',
    price: 34900,
    category: 'tables',
    material: 'marble',
    color: 'cream',
    bestseller: false,
    description:
      'Honed Carrara on a powder-coated base. Cold to the touch in the best way, and heavy enough not to tip.',
    dimensions: { width: 42, depth: 42, height: 52 },
    inStock: true,
  },
  {
    id: 'p12',
    slug: 'foldwell-desk',
    name: 'Foldwell Desk',
    price: 84900,
    category: 'tables',
    material: 'ash',
    color: 'natural',
    bestseller: true,
    description:
      'A writing desk with a cable channel cut into the back edge and two shallow drawers that close quietly.',
    dimensions: { width: 140, depth: 68, height: 74 },
    inStock: true,
  },

  // ─── Beds ─────────────────────────────────────────────────────────────
  {
    id: 'p13',
    slug: 'meadow-bed-frame',
    name: 'Meadow Bed Frame',
    price: 139900,
    category: 'beds',
    material: 'oak',
    color: 'natural',
    bestseller: true,
    description:
      'Slatted oak with a low headboard. Assembles with a single hex key and no part of it creaks after a year.',
    dimensions: { width: 168, depth: 212, height: 92 },
    inStock: true,
  },
  {
    id: 'p14',
    slug: 'hollow-platform-bed',
    name: 'Hollow Platform Bed',
    price: 174900,
    category: 'beds',
    material: 'walnut',
    color: 'walnut',
    bestseller: false,
    description:
      'A floating platform on a recessed plinth. The mattress sits flush with the frame so there is no edge to catch a shin.',
    dimensions: { width: 172, depth: 216, height: 34 },
    inStock: true,
  },
  {
    id: 'p15',
    slug: 'cloudbank-upholstered-bed',
    name: 'Cloudbank Upholstered Bed',
    price: 189900,
    category: 'beds',
    material: 'linen',
    color: 'sage',
    bestseller: true,
    description:
      'A tall padded headboard you can actually sit against. Covers unzip for washing, which no one believes until they try it.',
    dimensions: { width: 176, depth: 214, height: 124 },
    inStock: true,
  },
  {
    id: 'p16',
    slug: 'tern-single-bed',
    name: 'Tern Single Bed',
    price: 79900,
    category: 'beds',
    material: 'ash',
    color: 'cream',
    bestseller: false,
    description:
      'A small, uncomplicated single with rounded edges throughout. Sized for a box room, built to outlast the child in it.',
    dimensions: { width: 98, depth: 202, height: 86 },
    inStock: false,
  },

  // ─── Storage ──────────────────────────────────────────────────────────
  {
    id: 'p17',
    slug: 'larkspur-sideboard',
    name: 'Larkspur Sideboard',
    price: 129900,
    category: 'storage',
    material: 'walnut',
    color: 'walnut',
    bestseller: true,
    description:
      'Four doors on soft-close hinges, one adjustable shelf per bay, and a back panel finished well enough to float in a room.',
    dimensions: { width: 186, depth: 46, height: 78 },
    inStock: true,
  },
  {
    id: 'p18',
    slug: 'quarry-bookshelf',
    name: 'Quarry Bookshelf',
    price: 94900,
    category: 'storage',
    material: 'oak',
    color: 'natural',
    bestseller: false,
    description:
      'Five bays of solid oak, rated for the weight of actual books rather than the three ornaments in the catalogue photo.',
    dimensions: { width: 92, depth: 34, height: 198 },
    inStock: true,
  },
  {
    id: 'p19',
    slug: 'brindle-wardrobe',
    name: 'Brindle Wardrobe',
    price: 164900,
    category: 'storage',
    material: 'ash',
    color: 'cream',
    bestseller: false,
    description:
      'A full-height hanging rail, two drawers below, and doors that stay shut. Ships flat and assembles in about an hour.',
    dimensions: { width: 120, depth: 58, height: 206 },
    inStock: true,
  },
  {
    id: 'p20',
    slug: 'cobble-nightstand',
    name: 'Cobble Nightstand',
    price: 29900,
    category: 'storage',
    material: 'oak',
    color: 'natural',
    bestseller: true,
    description:
      'One drawer, one open shelf, and a top just big enough for a lamp and a glass of water. Nothing else fits, by design.',
    dimensions: { width: 46, depth: 40, height: 56 },
    inStock: true,
  },

  // ─── Lighting ─────────────────────────────────────────────────────────
  {
    id: 'p21',
    slug: 'lumen-floor-lamp',
    name: 'Lumen Floor Lamp',
    price: 44900,
    category: 'lighting',
    material: 'steel',
    color: 'charcoal',
    bestseller: true,
    description:
      'A weighted base and a shade that tilts through ninety degrees, so it reads as a reading lamp or an uplighter.',
    dimensions: { width: 34, depth: 34, height: 158 },
    inStock: true,
  },
  {
    id: 'p22',
    slug: 'halo-pendant',
    name: 'Halo Pendant',
    price: 26900,
    category: 'lighting',
    material: 'steel',
    color: 'ink',
    bestseller: false,
    description:
      'A wide, shallow shade that throws light down onto a table rather than into the eyes of whoever is sitting across it.',
    dimensions: { width: 48, depth: 48, height: 22 },
    inStock: true,
  },
  {
    id: 'p23',
    slug: 'ember-table-lamp',
    name: 'Ember Table Lamp',
    price: 21900,
    category: 'lighting',
    material: 'marble',
    color: 'terracotta',
    bestseller: false,
    description:
      'A solid marble base under a linen shade, with an inline dimmer on the cord where you can actually reach it.',
    dimensions: { width: 28, depth: 28, height: 46 },
    inStock: true,
  },
  {
    id: 'p24',
    slug: 'willow-arc-lamp',
    name: 'Willow Arc Lamp',
    price: 58900,
    category: 'lighting',
    material: 'steel',
    color: 'sage',
    bestseller: true,
    description:
      'Reaches two metres over a sofa from a base that tucks behind it. The arc is fixed, which is why it never sags.',
    dimensions: { width: 210, depth: 42, height: 196 },
    inStock: true,
  },
]

/** Fast lookup for /product/:slug. */
export const productsBySlug = new Map(products.map((p) => [p.slug, p]))

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug.get(slug)
}
