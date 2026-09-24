export type Job = {
  id: string
  title: string
  team: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Apprenticeship'
  summary: string
}

export const jobs: Job[] = [
  {
    id: 'bench-joiner',
    title: 'Bench Joiner',
    team: 'Workshop',
    location: 'Chișinău',
    type: 'Full-time',
    summary:
      'Build case goods and frames from rough stock to finish. You know your way around a mortiser and you care what the inside of a drawer looks like.',
  },
  {
    id: 'upholsterer',
    title: 'Upholsterer',
    team: 'Workshop',
    location: 'Chișinău',
    type: 'Full-time',
    summary:
      'Cut, sew and fit covers for our sofas and beds. Experience with feather fill and loose covers is more useful here than speed.',
  },
  {
    id: 'workshop-apprentice',
    title: 'Workshop Apprentice',
    team: 'Workshop',
    location: 'Chișinău',
    type: 'Apprenticeship',
    summary:
      'Two years, paid, no experience needed. You will sweep a lot of floors and learn to sharpen properly before you touch a machine.',
  },
  {
    id: 'showroom-assistant',
    title: 'Showroom Assistant',
    team: 'Retail',
    location: 'Bucharest',
    type: 'Part-time',
    summary:
      'Weekends and Thursday evenings. Help people work out whether a room fits the sofa, which is usually the real question.',
  },
  {
    id: 'delivery-driver',
    title: 'Delivery Driver',
    team: 'Logistics',
    location: 'Chișinău',
    type: 'Full-time',
    summary:
      'Two-person deliveries across the country. Category B licence, a steady manner in tight stairwells, and patience with old buildings.',
  },
]
