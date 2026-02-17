<template>
  <Teleport to="body">
    <div v-if="visible" class="numpad-overlay" @click.self="close">
      <div class="numpad-dialog">
        <div class="numpad-header">
          <span class="numpad-title">{{ $t('numpad.title') }}</span>
          <button class="numpad-close" @click="close">&#x2715;</button>
        </div>

        <div class="numpad-screen">
          <span class="numpad-value">{{ inputValue || '0' }}</span>
          <span class="numpad-unit">{{ $t('unit.ml') }}</span>
        </div>

        <div class="numpad-keys">
          <button
            v-for="key in keys"
            :key="key"
            class="numpad-key"
            :class="{
              'key-wide': key === '0',
              'key-action': key === '⌫' || key === 'C'
            }"
            @pointerup="handleKey(key)"
          >
            {{ key }}
          </button>
        </div>

        <button
          class="numpad-submit"
          :disabled="!canSubmit"
          @pointerup="submit"
        >
          {{ $t('numpad.submit') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWaterStore } from '@/stores/water'
import i18n from '@/i18n'
import { NUMPAD_MAX_DIGITS } from '@/constants/timing'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  submitted: []
  'force-reset': []
}>()

const waterStore = useWaterStore()
const inputValue = ref('')

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

const canSubmit = computed(() => {
  return inputValue.value.length > 0
})

function handleKey(key: string) {
  if (key === 'C') {
    inputValue.value = ''
  } else if (key === '⌫') {
    inputValue.value = inputValue.value.slice(0, -1)
  } else {
    if (inputValue.value.length < NUMPAD_MAX_DIGITS) {
      inputValue.value += key
    }
  }
}

function submit() {
  if (!canSubmit.value) return

  if (inputValue.value === '0000') {
    emit('force-reset')
    inputValue.value = ''
    close()
    return
  }

  if (inputValue.value === '0001') {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        if (Notification.permission === 'granted') {
          new Notification('H2O: Refill Hero', {
            body: i18n.global.t('reminder.message'),
          })
        }
      })
    }
    inputValue.value = ''
    close()
    return
  }

  const ml = parseInt(inputValue.value, 10)
  if (ml > 0) {
    waterStore.addWater(ml)
    emit('submitted')
  }

  inputValue.value = ''
  close()
}

function close() {
  inputValue.value = ''
  emit('close')
}
</script>

<style scoped>
.numpad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
  touch-action: manipulation;
}

.numpad-dialog {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  width: 280px;
  max-width: 90vw;
  image-rendering: pixelated;
  animation: slideUp 0.25s ease-out;
  box-shadow:
    0 0 0 2px #2a2a4e,
    4px 4px 0 0 rgba(0, 0, 0, 0.3);
}

.numpad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.numpad-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #9ca3af;
  letter-spacing: 2px;
}

.numpad-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
  font-family: 'Fusion Pixel', monospace;
}

.numpad-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.numpad-screen {
  background: #0a2a0a;
  border: 3px solid #1a4a1a;
  border-radius: 4px;
  padding: 10px 16px;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 6px;
  margin-bottom: 12px;
}

.numpad-value {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 28px;
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
  letter-spacing: 4px;
  min-width: 100px;
  text-align: right;
}

.numpad-unit {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #6b9b6b;
}

.numpad-keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.numpad-key {
  background: #2a2a4e;
  border: 3px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', 'Courier New', monospace;
  font-size: 18px;
  padding: 12px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s, transform 0.1s;
  image-rendering: pixelated;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.2);
}

.numpad-key:hover {
  background: #3a3a5e;
}

.numpad-key:active {
  background: #4a4a6e;
  transform: translateY(2px);
  box-shadow: none;
}

.numpad-key.key-action {
  background: #3a2a2a;
  border-color: #6a4a4a;
  color: #f87171;
  font-size: 16px;
}

.numpad-key.key-action:hover {
  background: #4a3a3a;
}

.numpad-submit {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border: 3px solid #1d4ed8;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  letter-spacing: 2px;
  transition: background 0.1s, transform 0.1s;
  image-rendering: pixelated;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3);
}

.numpad-submit:hover:not(:disabled) {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
}

.numpad-submit:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: none;
}

.numpad-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile: fullscreen numpad */
@media (max-width: 479px) {
  .numpad-overlay {
    align-items: flex-end;
  }

  .numpad-dialog {
    width: 100%;
    max-width: 100vw;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    padding: 16px 12px calc(env(safe-area-inset-bottom, 12px) + 12px);
    animation: slideUpMobile 0.25s ease-out;
  }

  .numpad-key {
    padding: 14px 8px;
    font-size: 20px;
  }

  .numpad-submit {
    padding: 14px;
    font-size: 15px;
  }

  .numpad-value {
    font-size: 32px;
  }
}

/* Tablet+ */
@media (min-width: 480px) {
  .numpad-dialog {
    width: 320px;
  }
}

@keyframes slideUpMobile {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
