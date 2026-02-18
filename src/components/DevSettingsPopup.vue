<template>
  <Teleport to="body">
    <div v-if="visible" class="dev-overlay" @click.self="$emit('close')">
      <div class="dev-popup">
        <div class="dev-header">
          <span class="dev-title">{{ $t('devSettings.title') }}</span>
          <button class="dev-close" aria-label="Close" @click="$emit('close')">&#x2715;</button>
        </div>
        <div class="dev-body">
          <button class="dev-btn" @click="restartDay">
            {{ $t('devSettings.restartDay') }}
          </button>
          <button class="dev-btn" @click="sendTestReminder">
            {{ $t('devSettings.testReminder') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import i18n from '@/i18n'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  'force-reset': []
}>()

function restartDay() {
  emit('force-reset')
  emit('close')
}

function sendTestReminder() {
  if ('Notification' in window) {
    Notification.requestPermission().then(() => {
      if (Notification.permission === 'granted') {
        new Notification('H2O: Refill Hero', {
          body: i18n.global.t('reminder.message'),
        })
      }
    })
  }
  emit('close')
}
</script>

<style scoped>
.dev-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  animation: fadeIn 0.2s ease-out;
}

.dev-popup {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  min-width: 260px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.dev-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dev-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #9ca3af;
  letter-spacing: 2px;
}

.dev-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
}

.dev-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.dev-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dev-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
  transition: background 0.15s;
}

.dev-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
