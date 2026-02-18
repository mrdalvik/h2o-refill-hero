<template>
  <ToastContainer />
  <OnboardingOverlay
    :visible="showOnboarding"
    @close="closeOnboarding"
  />
  <DayBackground>
    <div class="app-content">
      <CustomerAnimation
        v-if="showAnimation"
        @done="onAnimationDone"
      />
      <VendingMachine
        v-show="!showAnimation"
        @force-reset="onForceReset"
        @show-onboarding="showOnboarding = true"
      />
    </div>
  </DayBackground>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ToastContainer from './components/ToastContainer.vue'
import OnboardingOverlay from './components/OnboardingOverlay.vue'
import DayBackground from './components/DayBackground.vue'
import CustomerAnimation from './components/CustomerAnimation.vue'
import VendingMachine from './components/VendingMachine.vue'
import { useDayReset } from './composables/useDayReset'
import { useWaterReminder } from './composables/useWaterReminder'
import { useTimeOfDay } from './composables/useTimeOfDay'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const { showAnimation, forceReset } = useDayReset()
const showOnboarding = ref(false)

onMounted(() => {
  const seen = localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN)
  if (!seen) {
    showOnboarding.value = true
  }
})

function closeOnboarding() {
  showOnboarding.value = false
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, '1')
}
useWaterReminder()
const timeOfDay = useTimeOfDay()

const SKY_COLORS: Record<string, string> = {
  morning: '#FFD4A0',
  day: '#87CEEB',
  evening: '#C77DBA',
  night: '#0C1445',
}

const GROUND_COLORS: Record<string, string> = {
  morning: '#4a4a4a',
  day: '#5a5a5a',
  evening: '#4a3a3a',
  night: '#1a1a1a',
}

watch(timeOfDay, (t) => {
  const sky = SKY_COLORS[t] ?? '#87CEEB'
  const ground = GROUND_COLORS[t] ?? '#5a5a5a'
  document.documentElement.style.setProperty('--sky-top', sky)
  document.documentElement.style.setProperty('--ground-color', ground)
  const meta = document.getElementById('theme-color') as HTMLMetaElement | null
  if (meta) meta.content = sky
}, { immediate: true })

function onAnimationDone() {
  showAnimation.value = false
}

function onForceReset() {
  forceReset()
}
</script>

<style>
:root {
  /* Theme (updated by JS, fallbacks for initial load) */
  --sky-top: #87CEEB;
  --ground-color: #5a5a5a;

  /* Typography */
  --font-pixel: 'Fusion Pixel', monospace;
  --font-mono: 'Courier New', 'Fusion Pixel', monospace;

  /* Panel colors */
  --color-panel-bg: #1a1a2e;
  --color-panel-border: #4a4a6a;
  --color-panel-surface: #2a2a4e;
  --color-panel-surface-hover: #3a3a5e;

  /* Accent colors */
  --color-accent-green: #4ade80;
  --color-accent-green-glow: rgba(74, 222, 128, 0.5);
  --color-accent-blue: #3b82f6;
  --color-accent-blue-dark: #2563eb;
  --color-accent-blue-deeper: #1d4ed8;
  --color-accent-red: #f87171;

  /* Text colors */
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-text-muted: #6b7280;

  /* Goal reached */
  --color-goal-reached: #22c55e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  min-height: 100%;
  min-height: 100dvh;
  background: linear-gradient(
    to bottom,
    var(--sky-top, #87CEEB) 0%,
    var(--sky-top, #87CEEB) calc(100% - 120px),
    var(--ground-color, #5a5a5a) calc(100% - 120px),
    var(--ground-color, #5a5a5a) 100%
  );
  background-attachment: fixed;
  background-color: var(--sky-top, #87CEEB);
}

body {
  font-family: var(--font-pixel), 'Courier New', monospace;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  image-rendering: pixelated;
  overflow-x: hidden;
  touch-action: manipulation;
  -ms-touch-action: manipulation;
  min-height: 100vh;
  min-height: 100dvh;
  background: transparent;
}

#app {
  min-height: 100vh;
  min-height: 100dvh;
  touch-action: manipulation;
  -ms-touch-action: manipulation;
}
</style>

<style scoped>
.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 16px 16px 120px;
  touch-action: manipulation;
}
</style>
