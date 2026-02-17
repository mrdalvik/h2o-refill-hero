export type ReminderFrequency = 'never' | '3' | '5'

export const SLOTS_3 = [10, 14, 18]
export const SLOTS_5 = [9, 12, 15, 18, 21]

export function getSlotsForFrequency(frequency: ReminderFrequency): number[] {
  return frequency === '5' ? SLOTS_5 : SLOTS_3
}

export function shouldShowReminder(
  frequency: ReminderFrequency,
  hour: number,
  shownSlots: number[]
): boolean {
  if (frequency === 'never') return false
  if (hour < 8 || hour >= 22) return false

  const slots = getSlotsForFrequency(frequency)
  return slots.includes(hour) && !shownSlots.includes(hour)
}
