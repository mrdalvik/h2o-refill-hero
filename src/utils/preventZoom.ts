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

function preventContextMenuOnTouch() {
  if (!('ontouchstart' in window)) return

  document.addEventListener(
    'contextmenu',
    (e) => {
      const target = e.target instanceof Element ? e.target : null
      if (
        target?.closest(
          'button, [role="button"], .panel-clickable, .bottle-cell, .onboarding-backdrop, .onboarding-btn, .animation-skip, .celebration-overlay, .calc-overlay, .changelog-overlay, .numpad-overlay, .settings-overlay, .dev-overlay, .bottle-popup-overlay',
        )
      ) {
        e.preventDefault()
      }
    },
    { passive: false },
  )
}

export function setupZoomPrevention() {
  preventGestureZoom()
  preventPinchZoom()
  preventDoubleTapZoom()
  preventContextMenuOnTouch()
}
