<template>
  <div class="control-panel">
    <div class="panel-display" @click="focusInput">
      <span class="panel-value">{{ displayValue }}</span>
      <span class="panel-unit">{{ $t('unit.ml') }}</span>
    </div>

    <div class="panel-numpad">
      <button
        v-for="key in keys"
        :key="key"
        class="numpad-key"
        :class="{
          'key-wide': key === '0',
          'key-action': key === '⌫' || key === 'C'
        }"
        @click="handleKey(key)"
      >
        {{ key }}
      </button>
    </div>

    <button
      class="panel-submit"
      :disabled="!canSubmit"
      @click="submit"
    >
      {{ $t('numpad.submit') }}
    </button>

    <button class="panel-settings" @click="$emit('open-settings')" :title="$t('settings.title')">
      &#9881; {{ $t('settings.title') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWaterStore } from '@/stores/water'

const emit = defineEmits<{
  'open-settings': []
  submitted: []
  'force-reset': []
}>()

const waterStore = useWaterStore()
const inputValue = ref('')

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

const displayValue = computed(() => {
  if (inputValue.value) return inputValue.value
  const bottles = waterStore.bottles
  return bottles.length > 0 ? String(bottles[bottles.length - 1].ml) : '---'
})

const canSubmit = computed(() => inputValue.value.length > 0)

function focusInput() {
  // Display is clickable for visual feedback, input happens via numpad
}

function handleKey(key: string) {
  if (key === 'C') {
    inputValue.value = ''
  } else if (key === '⌫') {
    inputValue.value = inputValue.value.slice(0, -1)
  } else {
    if (inputValue.value.length < 4) {
      inputValue.value += key
    }
  }
}

function submit() {
  if (!canSubmit.value) return

  if (inputValue.value === '0000') {
    emit('force-reset')
    inputValue.value = ''
    return
  }

  const ml = parseInt(inputValue.value, 10)
  if (ml > 0) {
    waterStore.addWater(ml)
    emit('submitted')
  }

  inputValue.value = ''
}
</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 140px;
  padding: 8px;
  background: #252540;
  border: 3px solid #4a4a6a;
  border-radius: 6px;
  border-left: 2px solid #3a3a5a;
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.2);
}

.panel-display {
  background: #0a1a0a;
  border: 3px solid #1a3a1a;
  border-radius: 4px;
  padding: 8px 12px;
  text-align: right;
  min-height: 36px;
  cursor: default;
}

.panel-value {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 18px;
  color: #4ade80;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
  letter-spacing: 2px;
}

.panel-unit {
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  color: #5a8a5a;
  margin-left: 4px;
}

.panel-numpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.numpad-key.key-wide {
  grid-column: 2 / 4;
}

.numpad-key {
  background: #3a3a5e;
  border: 2px solid #5a5a8a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', 'Courier New', monospace;
  font-size: 14px;
  padding: 8px 4px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.1s, transform 0.1s;
  box-shadow: 1px 1px 0 0 rgba(0, 0, 0, 0.3);
}

.numpad-key:hover {
  background: #4a4a6e;
}

.numpad-key:active {
  transform: translateY(1px);
  box-shadow: none;
}

.numpad-key.key-action {
  background: #4a3535;
  border-color: #6a4a4a;
  color: #f87171;
  font-size: 12px;
}

.panel-submit {
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border: 3px solid #1d4ed8;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  letter-spacing: 1px;
  transition: background 0.1s, transform 0.1s;
}

.panel-submit:hover:not(:disabled) {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
}

.panel-submit:active:not(:disabled) {
  transform: translateY(1px);
}

.panel-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.panel-settings {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.panel-settings:hover {
  background: #3a3a5e;
  color: #e5e7eb;
  border-color: #6a6a9a;
}

@media (max-width: 479px) {
  .control-panel {
    min-width: 120px;
    padding: 6px;
    gap: 6px;
  }

  .panel-display {
    padding: 6px 8px;
    min-height: 30px;
  }

  .panel-value {
    font-size: 14px;
  }

  .numpad-key {
    padding: 6px 2px;
    font-size: 12px;
  }

  .panel-submit,
  .panel-settings {
    padding: 6px;
    font-size: 10px;
  }
}
</style>
