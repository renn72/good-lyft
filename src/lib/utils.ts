import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFormattedDate(date: Date | null) {
    const d = new Date(date || '')
    return d.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function getDateFromDate(date: Date) {
    const d = new Date(date)
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

export function getAge(birthDate: Date | null, eventDate?: Date | null) {
    if (!eventDate) {
        eventDate = new Date()
    }
    if (!birthDate) {
        return 0
    }
    const age = eventDate.getFullYear() - birthDate.getFullYear()
    const m = eventDate.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) {
        return age - 1
    }
    return age
}
