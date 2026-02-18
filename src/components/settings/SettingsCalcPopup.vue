<template>
  <div v-if="modelValue" class="calc-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="calc-popup" role="dialog" aria-modal="true" aria-labelledby="calc-title">
      <div class="calc-header">
        <span id="calc-title" class="calc-title">{{ $t('settings.calcTitle') }}</span>
        <button
          class="calc-close"
          aria-label="Close"
          @click="$emit('update:modelValue', false)"
        >
          &#x2715;
        </button>
      </div>
      <div class="calc-body">
        <div class="calc-field">
          <label class="calc-label" for="calc-weight">{{ $t('settings.weight') }}</label>
          <div class="calc-input-row">
            <input
              id="calc-weight"
              v-model.number="weight"
              type="number"
              min="30"
              max="200"
              class="calc-input"
              :placeholder="$t('settings.weightPlaceholder')"
            />
            <span class="calc-unit">{{ $t('settings.kg') }}</span>
          </div>
        </div>
        <div class="calc-field">
          <label class="calc-label">{{ $t('settings.activity') }}</label>
          <div class="activity-options">
            <button
              v-for="opt in ACTIVITY_OPTIONS"
              :key="opt.value"
              class="activity-btn"
              :class="{ 'activity-active': activity === opt.value }"
              @click="activity = opt.value"
            >
              {{ $t(opt.label) }}
            </button>
          </div>
        </div>
        <p class="calc-disclaimer">{{ $t('settings.calcDisclaimer') }}</p>
      </div>
      <button class="calc-submit" @click="apply">
        {{ $t('settings.calcApply') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { calculateDailyGoal } from '@/utils/waterGoal'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const props = defineProps<{
  modelValue: boolean
  initialWeight: number
  initialActivity: 'low' | 'medium' | 'high'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  apply: [goal: number]
}>()

const weight = ref(props.initialWeight)
const activity = ref(props.initialActivity)

const ACTIVITY_OPTIONS = [
  { value: 'low' as const, label: 'settings.activityLow' },
  { value: 'medium' as const, label: 'settings.activityMedium' },
  { value: 'high' as const, label: 'settings.activityHigh' },
]

watch(() => props.modelValue, (open) => {
  if (open) {
    weight.value = props.initialWeight
    activity.value = props.initialActivity
  }
})

watch(
  () => [props.initialWeight, props.initialActivity] as const,
  ([w, a]) => {
    weight.value = w
    activity.value = a
  }
)

function apply() {
  const w = Math.min(200, Math.max(30, Number(weight.value) || 70))
  const goal = calculateDailyGoal(w, activity.value)
  const clamped = Math.min(10000, Math.max(100, goal))
  localStorage.setItem(STORAGE_KEYS.CALC_PREFS, JSON.stringify({ weight: w, activity: activity.value }))
  emit('apply', clamped)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.calc-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.2s ease-out;
}

.calc-popup {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  width: 280px;
  max-width: 90vw;
  animation: slideUp 0.25s ease-out;
}

.calc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.calc-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #e5e7eb;
  letter-spacing: 1px;
}

.calc-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
}

.calc-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.calc-body {
  margin-bottom: 12px;
}

.calc-field {
  margin-bottom: 12px;
}

.calc-label {
  display: block;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.calc-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calc-input {
  width: 80px;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 4px;
}

.calc-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.calc-unit {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
}

.activity-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.activity-btn {
  text-align: left;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.activity-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.activity-btn.activity-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.calc-disclaimer {
  font-family: 'Fusion Pixel', monospace;
  font-size: 9px;
  color: #6b7280;
  line-height: 1.4;
  margin: 12px 0 0;
}

.calc-submit {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border: 3px solid #1d4ed8;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  letter-spacing: 1px;
}

.calc-submit:hover {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
