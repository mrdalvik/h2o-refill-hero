<template>
  <Teleport to="body">
    <div v-if="visible" class="settings-overlay" @click.self="$emit('close')">
      <div class="settings-dialog">
        <div class="settings-header">
          <span class="settings-title">{{ $t('settings.title') }}</span>
          <button class="settings-close" @click="$emit('close')">&#x2715;</button>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.dailyGoal') }}</div>
          <div class="goal-input-row">
            <input
              v-model.number="goalInput"
              type="number"
              min="100"
              max="10000"
              step="100"
              class="goal-input"
              @change="onGoalChange"
            />
            <span class="goal-unit">{{ $t('unit.ml') }}</span>
          </div>
          <div class="goal-presets">
            <button
              v-for="preset in GOAL_PRESETS"
              :key="preset"
              class="goal-preset-btn"
              :class="{ 'goal-preset-active': waterStore.dailyGoal === preset }"
              @click="setGoal(preset)"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-label">{{ $t('settings.language') }}</div>
          <div class="language-grid">
            <button
              v-for="(label, code) in SUPPORTED_LOCALES"
              :key="code"
              class="language-btn"
              :class="{ 'language-active': currentLocale === code }"
              @click="changeLocale(code as SupportedLocale)"
            >
              <span class="lang-flag">{{ flags[code as SupportedLocale] }}</span>
              <span class="lang-name">{{ label }}</span>
            </button>
          </div>
        </div>

        <button class="settings-done" @click="$emit('close')">
          {{ $t('settings.close') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWaterStore } from '@/stores/water'
import { SUPPORTED_LOCALES, saveLocale, type SupportedLocale } from '@/i18n'

const props = defineProps<{
  visible: boolean
}>()

defineEmits<{
  close: []
}>()

const { locale } = useI18n()
const waterStore = useWaterStore()

const GOAL_PRESETS = [1500, 2000, 2500, 3000]
const goalInput = ref(waterStore.dailyGoal)

watch(() => props.visible, (visible) => {
  if (visible) goalInput.value = waterStore.dailyGoal
})

watch(() => waterStore.dailyGoal, (val) => {
  goalInput.value = val
})

function setGoal(ml: number) {
  waterStore.dailyGoal = ml
  waterStore.persist()
}

function onGoalChange() {
  const val = Math.round(Number(goalInput.value))
  const clamped = Math.min(10000, Math.max(100, isNaN(val) ? 2000 : val))
  waterStore.dailyGoal = clamped
  goalInput.value = clamped
  waterStore.persist()
}

const currentLocale = computed(() => locale.value)

const flags: Record<SupportedLocale, string> = {
  ru: '🇷🇺',
  en: '🇬🇧',
  zh: '🇨🇳',
  es: '🇪🇸',
  hi: '🇮🇳',
  pt: '🇧🇷',
  ja: '🇯🇵',
  de: '🇩🇪',
  fr: '🇫🇷',
}

function changeLocale(code: SupportedLocale) {
  locale.value = code
  saveLocale(code)
  document.documentElement.lang = code
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.2s ease-out;
}

.settings-dialog {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  image-rendering: pixelated;
  animation: slideUp 0.25s ease-out;
  box-shadow:
    0 0 0 2px #2a2a4e,
    4px 4px 0 0 rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.settings-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 16px;
  color: #e5e7eb;
  letter-spacing: 2px;
}

.settings-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
  font-family: 'Fusion Pixel', monospace;
}

.settings-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.settings-section {
  margin-bottom: 16px;
}

.settings-label {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.goal-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.goal-input {
  width: 100px;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #e5e7eb;
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 4px;
}

.goal-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.goal-unit {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
}

.goal-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.goal-preset-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.goal-preset-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.goal-preset-btn.goal-preset-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.language-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
  image-rendering: pixelated;
}

.language-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.language-btn.language-active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.lang-flag {
  font-size: 16px;
  line-height: 1;
}

.lang-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-done {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border: 3px solid #1d4ed8;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  letter-spacing: 2px;
  transition: background 0.1s, transform 0.1s;
  image-rendering: pixelated;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.3);
}

.settings-done:hover {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
}

.settings-done:active {
  transform: translateY(2px);
  box-shadow: none;
}

@media (max-width: 479px) {
  .settings-overlay {
    align-items: flex-end;
  }

  .settings-dialog {
    width: 100%;
    max-width: 100vw;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    padding: 16px 12px calc(env(safe-area-inset-bottom, 12px) + 12px);
    max-height: 70vh;
  }

  .language-grid {
    grid-template-columns: 1fr 1fr;
  }
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
