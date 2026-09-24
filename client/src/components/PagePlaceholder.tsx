type PagePlaceholderProps = {
  title: string
  /** Which plan phase replaces this stub — keeps the skeleton self-documenting. */
  phase: string
  description: string
}

function PagePlaceholder({ title, phase, description }: PagePlaceholderProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
        {phase}
      </p>
      <h1 className="mt-3 text-4xl">{title}</h1>
      <p className="mt-4 max-w-prose text-muted">{description}</p>
      <div className="mt-10 rounded-lg border border-dashed border-line bg-shell p-10 text-sm text-muted">
        Placeholder — this route resolves and the shell renders around it.
      </div>
    </section>
  )
}

export default PagePlaceholder
