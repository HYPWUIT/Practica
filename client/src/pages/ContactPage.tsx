import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { contactSchema } from '../lib/schemas'

const details = [
  {
    heading: 'Workshop',
    lines: ['Strada Uzinelor 14', 'MD-2036 Chișinău', 'Moldova'],
  },
  {
    heading: 'Showroom',
    lines: ['Calea Victoriei 88', '010093 Bucharest', 'Thu–Sun, 10:00–18:00'],
  },
  {
    heading: 'Reach us',
    lines: ['hello@sageandoak.example', '+373 22 000 000', 'Mon–Fri, 9:00–17:00'],
  },
]

function ContactPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const send = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSent(true)
    reset()
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-xs font-semibold tracking-widest text-sage-500 uppercase">
        Contact
      </p>
      <h1 className="mt-4 text-5xl leading-tight">Ask us anything</h1>
      <p className="mt-5 max-w-prose text-lg text-muted">
        Questions about a piece, a room that seems too small for it, or a repair
        on something you bought years ago — all welcome.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <section>
          <h2 className="text-2xl">Send a message</h2>

          {sent ? (
            <div
              role="status"
              className="mt-6 rounded-xl border border-line bg-shell p-6"
            >
              <p className="text-sage-700">
                Thanks — your message was validated and then discarded. There is
                no backend to deliver it to.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => setSent(false)}
              >
                Write another
              </Button>
            </div>
          ) : (
            <form onSubmit={send} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
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
              <div className="sm:col-span-2">
                <Input
                  label="Subject"
                  error={errors.subject?.message}
                  {...register('subject')}
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Message"
                  hint="20 characters minimum — enough to tell us what you need."
                  error={errors.message?.message}
                  {...register('message')}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" loading={isSubmitting}>
                  Send message
                </Button>
              </div>
            </form>
          )}
        </section>

        <aside className="space-y-8">
          {details.map((block) => (
            <div key={block.heading}>
              <h2 className="font-sans text-xs font-semibold tracking-widest text-ink uppercase">
                {block.heading}
              </h2>
              <address className="mt-3 space-y-1 text-sm text-muted not-italic">
                {block.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </address>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

export default ContactPage
