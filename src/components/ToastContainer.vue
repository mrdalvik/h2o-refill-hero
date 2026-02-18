<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
        >
          <span class="toast-message">{{ t.message }}</span>
          <button
            v-if="t.actionLabel"
            class="toast-action"
            @click="dismissWithAction(t.id)"
          >
            {{ t.actionLabel }}
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, dismissWithAction } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0) + 24px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a1a2e;
  border: 3px solid #4a4a6a;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  font-family: 'Fusion Pixel', monospace;
  animation: toastSlide 0.25s ease-out;
}

.toast-message {
  color: #e5e7eb;
  font-size: 14px;
}

.toast-action {
  background: #3b82f6;
  border: 2px solid #2563eb;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.toast-action:hover {
  background: #60a5fa;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.toast-move {
  transition: transform 0.2s;
}

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
