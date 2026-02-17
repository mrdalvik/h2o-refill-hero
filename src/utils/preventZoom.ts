const DOUBLE_TAP_THRESHOLD_MS = 300

function preventGestureZoom() {
  const handler = (e: Event) => e.preventDefault()
  const opts: AddEventListenerOptions = { passive: false }

  document.addEventListener('gesturestart', handler, opts)
  document.addEventListener('gesturechange', handler, opts)
  document.addEventListener('gestureend', handler, opts)
}

function preventPinchZoom() {
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault()
    },
    { passive: false },
  )
}

function preventDoubleTapZoom() {
  let lastTouchEnd = 0

  document.addEventListener(
    'touchstart',
    (e) => {
      if (
        e.target instanceof Element &&
        (e.target.closest('.numpad-overlay') || e.target.closest('.settings-overlay'))
      ) {
        return
      }
      if (Date.now() - lastTouchEnd < DOUBLE_TAP_THRESHOLD_MS) {
        e.preventDefault()
      }
    },
    { passive: false },
  )

  document.addEventListener('touchend', () => {
    lastTouchEnd = Date.now()
  }, { passive: true })
}

export function setupZoomPrevention() {
  preventGestureZoom()
  preventPinchZoom()
  preventDoubleTapZoom()
}
