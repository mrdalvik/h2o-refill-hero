<template>
  <Teleport to="body">
    <div v-if="visible" class="numpad-overlay" @click.self="close">
      <div class="numpad-dialog" role="dialog" aria-modal="true" aria-labelledby="numpad-title">
        <div class="numpad-header">
          <span id="numpad-title" class="numpad-title">
            {{ $t('numpad.title') }}
            <button
              class="mode-toggle-btn"
              @click="toggleMode"
            >
              {{ numpadMode === 'simple' ? $t('numpad.keyboard') : $t('numpad.modeSimple') }}
            </button>
          </span>
          <button class="numpad-close" aria-label="Close" @click="close">&#x2715;</button>
        </div>

        <!-- Simple mode: drinks + volumes, add immediately -->
        <template v-if="numpadMode === 'simple'">
          <div class="simple-drinks">
            <button
              v-for="dt in DRINK_TYPES"
              :key="dt"
              class="simple-drink-btn"
              :class="{ 'simple-drink-active': selectedDrink === dt }"
              @pointerup="selectDrink(dt)"
            >
              {{ DRINK_EMOJI[dt] }} {{ $t(`drinks.${dt}`) }}
            </button>
          </div>
          <div class="simple-volumes">
            <button
              v-for="vol in SIMPLE_VOLUMES"
              :key="vol"
              class="simple-volume-btn"
              @pointerup="addSimple(vol)"
            >
              {{ vol }} {{ $t('unit.ml') }}
            </button>
          </div>
        </template>

        <!-- Extended mode: dropdown + numpad + submit -->
        <template v-else>
          <div class="extended-drink-row">
            <label class="extended-drink-label">{{ $t('drinks.label') }}</label>
            <select
              v-model="extendedDrink"
              class="extended-drink-select"
              :title="$t('numpad.title')"
            >
              <option
                v-for="dt in DRINK_TYPES"
                :key="dt"
                :value="dt"
              >
                {{ DRINK_EMOJI[dt] }} {{ $t(`drinks.${dt}`) }}
              </option>
            </select>
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
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWaterStore } from '@/stores/water'
import { useToast } from '@/composables/useToast'
import { triggerHaptic } from '@/utils/haptic'
import { NUMPAD_MAX_DIGITS, DEV_SETTINGS_CODE } from '@/constants/timing'
import { DRINK_TYPES, DRINK_EMOJI, SIMPLE_VOLUMES } from '@/constants/drinks'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import type { DrinkType } from '@/types'

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  submitted: []
  'force-reset': []
  'open-dev-settings': []
}>()

const { t } = useI18n()
const waterStore = useWaterStore()
const toast = useToast()
const inputValue = ref('')
const selectedDrink = ref<DrinkType | null>(null)
const extendedDrink = ref<DrinkType>('water')

function loadNumpadMode(): 'simple' | 'extended' {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.NUMPAD_MODE)
    if (s === 'simple' || s === 'extended') return s
  } catch { /* ignore */ }
  return 'simple'
}

const numpadMode = ref<'simple' | 'extended'>(loadNumpadMode())

function setMode(mode: 'simple' | 'extended') {
  numpadMode.value = mode
  localStorage.setItem(STORAGE_KEYS.NUMPAD_MODE, mode)
  if (mode === 'simple') selectedDrink.value = null
}

function toggleMode() {
  setMode(numpadMode.value === 'simple' ? 'extended' : 'simple')
}

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

function addWaterWithFeedback(ml: number, drinkType: DrinkType = 'water') {
  waterStore.addWater(ml, drinkType)
  toast.show(t('toast.added', { ml }), { duration: 1000 })
  triggerHaptic(50)
  emit('submitted')
  close()
}

function selectDrink(dt: DrinkType) {
  selectedDrink.value = dt
}

function addSimple(ml: number) {
  const drink = selectedDrink.value ?? 'water'
  addWaterWithFeedback(ml, drink)
  selectedDrink.value = null
}

const canSubmit = computed(() => {
  if (inputValue.value.length === 0) return false
  return parseInt(inputValue.value, 10) > 0
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

  if (parseInt(inputValue.value, 10) === DEV_SETTINGS_CODE) {
    inputValue.value = ''
    close()
    emit('open-dev-settings')
    return
  }

  const ml = parseInt(inputValue.value, 10)
  if (ml > 0) {
    addWaterWithFeedback(ml, extendedDrink.value)
  }

  inputValue.value = ''
  close()
}

function close() {
  inputValue.value = ''
  selectedDrink.value = null
  emit('close')
}

watch(() => numpadMode.value, (mode) => {
  if (mode === 'extended') extendedDrink.value = 'water'
})
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

.mode-toggle-btn {
  margin-left: 8px;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 4px;
  vertical-align: middle;
}

.mode-toggle-btn:hover {
  background: #3a3a5e;
  color: #e5e7eb;
}

/* Simple mode */
.simple-drinks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.simple-drink-btn {
  flex: 1;
  min-width: calc(50% - 3px);
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 14px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.simple-drink-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.simple-drink-btn.simple-drink-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.simple-volumes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.simple-volume-btn {
  background: linear-gradient(180deg, #2d4a2d, #1a3a1a);
  border: 3px solid #2a5a2a;
  color: #4ade80;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 14px 6px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s, transform 0.1s;
}

.simple-volume-btn:hover {
  background: linear-gradient(180deg, #3d5a3d, #2a4a2a);
}

.simple-volume-btn:active {
  transform: translateY(2px);
}

/* Extended mode */
.extended-drink-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.extended-drink-label {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

.extended-drink-select {
  flex: 1;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.extended-drink-select:focus {
  outline: none;
  border-color: #3b82f6;
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
}

.numpad-key:hover {
  background: #3a3a5e;
}

.numpad-key:active {
  background: #4a4a6e;
  transform: translateY(2px);
}

.numpad-key.key-action {
  background: #3a2a2a;
  border-color: #6a4a4a;
  color: #f87171;
  font-size: 16px;
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
}

.numpad-submit:hover:not(:disabled) {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
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
  }

  .simple-drink-btn {
    min-width: calc(50% - 3px);
    padding: 16px 8px;
  }

  .simple-volume-btn {
    padding: 16px 6px;
  }
}

@media (min-width: 480px) {
  .numpad-dialog {
    width: 320px;
  }
}
</style>
