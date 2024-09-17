import { z } from 'zod'

export const ageDivisionsData: Array<{
  name: string
  minAge: number | string
  maxAge: number | string
  notes: string
}> = [
  { name: 'Open', minAge: '', maxAge: '', notes: 'Open' },
  { name: 'Teen', minAge: 13, maxAge: 19, notes: 'Teen' },
  { name: 'Master', minAge: 50, maxAge: '', notes: 'Masters' },
  {
    name: 'First Timers',
    minAge: '',
    maxAge: '',
    notes: 'First powerlifting event',
  },
]

export const eventsData = [
  'Squat, Bench, Deadlift',
  'Squat only',
  'Bench only',
  'Deadlift only',
  'Push Pull',
  'Squat, Bench',
  'Squat, Deadlift',
]

export const equipmentData = [
  'Bare',
  'Sleeeves',
  'Wraps',
  'Single Ply',
  'Multi Ply',
  'Unlimited',
]

export const wcMData = [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140]

export const wcFData = [
  44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140,
]

export const winnerFormular = ['Total', 'Dots', 'Wilks']
