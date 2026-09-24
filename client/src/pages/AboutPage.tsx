import { Link } from 'react-router'
import ProductArt from '../components/ProductArt'
import { buttonClasses } from '../components/ui/button-styles'

const figures = [
  { value: '2009', label: 'Workshop opened' },
  { value: '31', label: 'People on the bench' },
  { value: '10 yr', label: 'Structural guarantee' },
  { value: '92%', label: 'Timber from within 300km' },
]

const principles = [
  {
    title: 'Repairable by design',
    body: 'Fixings you can reach, covers that unzip, and spare parts kept for ten years after a piece is discontinued. A sofa should outlive the sofa bed you buy next.',
  },
  {
    title: 'Timber we can point at',
    body: 'Oak, ash and walnut from managed forests within a day of the workshop. We publish the mill for every batch, which occasionally embarrasses us into doing better.',
  },
  {
    title: 'Slow where it counts',
    body: 'Frames are dry-fitted before glue-up and every carcass is checked for square twice. It costs us a day per piece and saves the customer a decade of wobble.',
  },
]

function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
            About us
          </p>
          <h1 className="mt-4 text-5xl leading-tight">
            A workshop that grew a shop, not the other way round
          </h1>
          <p className="mt-5 text-lg text-muted">
            Sage &amp; Oak started as two benches in a rented unit in Chișinău,
            making chairs for a restaurant that never paid the final invoice. We
            kept the chairs, and the habit of building things heavier than they
            need to be.
          </p>
        </div>
        <ProductArt
          category="chairs"
          color="natural"
          className="aspect-[4/3] rounded-2xl"
        />
      </section>

      <section className="border-y border-line bg-shell">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label}>
              <dt className="font-display text-4xl text-sage-700">
                {figure.value}
              </dt>
              <dd className="mt-1 text-sm text-muted">{figure.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl">How we work</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title}>
              <h3 className="text-xl">{principle.title}</h3>
              <p className="mt-3 text-muted">{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border border-line px-6 py-12 text-center">
          <h2 className="text-2xl">Come and sit on something</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            The showroom in Bucharest keeps one of everything, including the
            pieces we have stopped making.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className={buttonClasses()}>
              Visit us
            </Link>
            <Link
              to="/career"
              className={buttonClasses({ variant: 'secondary' })}
            >
              Work with us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
