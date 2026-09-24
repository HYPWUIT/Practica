import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchJobs, queryKeys } from '../api/catalog'
import QueryError from '../components/QueryError'
import JobListSkeleton from '../components/skeletons/JobListSkeleton'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import { applicationSchema } from '../lib/schemas'

function CareerPage() {
  const [applied, setApplied] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const {
    data: jobs = [],
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: queryKeys.jobs(), queryFn: fetchJobs })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      email: '',
      position: '',
      portfolio: '',
      coverLetter: '',
    },
  })

  const apply = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    setApplied(
      jobs.find((job) => job.id === values.position)?.title ?? values.position,
    )
    reset()
  })

  /** "Apply" on a listing preselects the role and scrolls to the form. */
  const startApplication = (jobId: string) => {
    setApplied(null)
    setValue('position', jobId, { shouldValidate: true })
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
        Careers
      </p>
      <h1 className="mt-4 text-5xl leading-tight">Come work the bench</h1>
      <p className="mt-5 max-w-prose text-lg text-muted">
        We hire for care over speed and train for everything else. All roles are
        at the Chișinău workshop unless stated otherwise.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl">Open positions</h2>

        {isPending ? (
          <JobListSkeleton />
        ) : isError ? (
          <QueryError
            title="The positions did not load"
            className="mt-6"
            onRetry={() => void refetch()}
          />
        ) : (
        <ul className="mt-6 space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="rounded-xl border border-line p-5 transition-colors hover:border-sage-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl">{job.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {job.team} · {job.location}
                  </p>
                </div>
                <Badge tone={job.type === 'Full-time' ? 'sage' : 'neutral'}>
                  {job.type}
                </Badge>
              </div>
              <p className="mt-3 text-muted">{job.summary}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => startApplication(job.id)}
              >
                Apply for this role
              </Button>
            </li>
          ))}
        </ul>
        )}
      </section>

      <section ref={formRef} className="mt-16 scroll-mt-24">
        <h2 className="text-2xl">Apply</h2>

        {applied ? (
          <div
            role="status"
            className="mt-6 rounded-xl border border-line bg-shell p-6"
          >
            <p className="text-sage-700">
              Thanks — your application for {applied} was validated and then
              discarded. There is no backend to send it to.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => setApplied(null)}
            >
              Apply for another role
            </Button>
          </div>
        ) : (
          <form onSubmit={apply} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Select
              label="Position"
              placeholder="Choose a position"
              options={jobs.map((job) => ({
                value: job.id,
                label: job.title,
              }))}
              error={errors.position?.message}
              {...register('position')}
            />
            <Input
              label="Portfolio (optional)"
              type="url"
              placeholder="https://"
              error={errors.portfolio?.message}
              {...register('portfolio')}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Why this role?"
                hint="A short note is plenty — 50 characters minimum."
                error={errors.coverLetter?.message}
                {...register('coverLetter')}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" loading={isSubmitting}>
                Send application
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}

export default CareerPage
