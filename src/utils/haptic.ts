export function triggerHaptic(durationMs = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(durationMs)
  }
}
