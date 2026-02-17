<template>
  <DayBackground>
    <div class="app-content">
      <CustomerAnimation
        v-if="showAnimation"
        @done="onAnimationDone"
      />
      <VendingMachine
        v-show="!showAnimation"
        @force-reset="onForceReset"
      />
    </div>
  </DayBackground>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import DayBackground from './components/DayBackground.vue'
import CustomerAnimation from './components/CustomerAnimation.vue'
import VendingMachine from './components/VendingMachine.vue'
import { useDayReset } from './composables/useDayReset'
import { useWaterReminder } from './composables/useWaterReminder'
import { useTimeOfDay } from './composables/useTimeOfDay'

const { showAnimation, forceReset } = useDayReset()
useWaterReminder()
const timeOfDay = useTimeOfDay()

const SKY_COLORS: Record<string, string> = {
  morning: '#FFD4A0',
  day: '#87CEEB',
  evening: '#C77DBA',
  night: '#0C1445',
}

watch(timeOfDay, (t) => {
  const color = SKY_COLORS[t] ?? '#87CEEB'
  document.documentElement.style.setProperty('--sky-top', color)
  const meta = document.getElementById('theme-color') as HTMLMetaElement | null
  if (meta) meta.content = color
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

html, body {
  font-family: var(--font-pixel), 'Courier New', monospace;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  image-rendering: pixelated;
  overflow-x: hidden;
  touch-action: manipulation;
  -ms-touch-action: manipulation;
  background: var(--sky-top, #87CEEB);
}

body {
  min-height: 100vh;
  min-height: 100dvh;
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
