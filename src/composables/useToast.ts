import { ref, type Ref } from 'vue'

export interface ToastItem {
  id: number
  message: string
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

const toasts: Ref<ToastItem[]> = ref([])
let nextId = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export function useToast() {
  function dismiss(id: number) {
    const t = timers.get(id)
    if (t) {
      clearTimeout(t)
      timers.delete(id)
    }
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  function scheduleDismiss(id: number, duration: number) {
    const t = setTimeout(() => {
      dismiss(id)
      timers.delete(id)
    }, duration)
    timers.set(id, t)
  }

  function show(message: string, options?: { duration?: number }) {
    const id = ++nextId
    const duration = options?.duration ?? 2500
    toasts.value = [...toasts.value, { id, message, duration }]
    scheduleDismiss(id, duration)
    return id
  }

  function showWithAction(
    message: string,
    actionLabel: string,
    onAction: () => void,
    options?: { duration?: number }
  ) {
    const id = ++nextId
    const duration = options?.duration ?? 3000
    toasts.value = [...toasts.value, { id, message, duration, actionLabel, onAction }]
    scheduleDismiss(id, duration)
    return id
  }

  function dismissWithAction(id: number) {
    const toast = toasts.value.find((t) => t.id === id)
    if (toast?.onAction) {
      toast.onAction()
    }
    dismiss(id)
  }

  return { toasts, show, showWithAction, dismiss, dismissWithAction }
}
