// Utilitários de data sem dependências externas

const MONTH_NAMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
]

const MONTH_NAMES_CAPS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function formatDatePtBR(date: Date): string {
  return `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`
}

export function getMonthName(month: number): string {
  return MONTH_NAMES_CAPS[month]
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function eachDayOfMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const numDays = getDaysInMonth(year, month)
  for (let i = 1; i <= numDays; i++) {
    days.push(new Date(year, month, i))
  }
  return days
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function calculateDuration(startTime: string, endTime: string): string | null {
  if (!startTime || !endTime) return null
  
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  let diffMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  if (diffMinutes < 0) diffMinutes += 24 * 60
  
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  
  if (hours === 0) return `${minutes}min`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}min`
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
