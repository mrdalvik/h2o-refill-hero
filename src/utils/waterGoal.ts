export function calculateDailyGoal(
  weightKg: number,
  activity: 'low' | 'medium' | 'high'
): number {
  const baseMlPerKg = 30
  const multipliers = { low: 1.0, medium: 1.2, high: 1.5 }
  return Math.round((weightKg * baseMlPerKg * multipliers[activity]) / 100) * 100
}
