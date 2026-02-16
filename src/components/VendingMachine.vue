<template>
  <div class="vending-machine">
    <div class="machine-body">
      <div class="machine-header">
        <h1 class="machine-title">{{ $t('app.title') }}</h1>
        <button class="settings-btn" @click="showSettings = true" :title="$t('settings.title')">&#9881;</button>
      </div>

      <WaterCounter />

      <div class="machine-window">
        <VendingGrid />
      </div>

      <ProgressIndicator />

      <DisplayPanel @open-numpad="showNumpad = true" />

      <NumpadDialog
        :visible="showNumpad"
        @close="showNumpad = false"
        @submitted="onWaterAdded"
        @force-reset="onForceReset"
      />

      <!-- Celebration overlay -->
      <Transition name="celebration">
        <div v-if="showCelebration" class="celebration-overlay" @click="showCelebration = false">
          <div class="celebration-content">
            <div class="celebration-icon">&#127881;</div>
            <div class="celebration-text">{{ $t('celebration.title') }}</div>
            <div class="celebration-sub">{{ $t('celebration.subtitle', { current: waterStore.totalMl, goal: waterStore.dailyGoal }) }}</div>
          </div>
        </div>
      </Transition>

      <SettingsDialog
        :visible="showSettings"
        @close="showSettings = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWaterStore } from '@/stores/water'
import WaterCounter from './WaterCounter.vue'
import VendingGrid from './VendingGrid.vue'
import DisplayPanel from './DisplayPanel.vue'
import NumpadDialog from './NumpadDialog.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import SettingsDialog from './SettingsDialog.vue'

const emit = defineEmits<{
  'force-reset': []
}>()

const waterStore = useWaterStore()
const showNumpad = ref(false)
const showSettings = ref(false)
const showCelebration = ref(false)
const hasShownCelebration = ref(waterStore.goalReached)

watch(() => waterStore.goalReached, (reached) => {
  if (reached && !hasShownCelebration.value) {
    showCelebration.value = true
    hasShownCelebration.value = true
    setTimeout(() => {
      showCelebration.value = false
    }, 3000)
  }
})

function onWaterAdded() {
  // Celebration is handled by the watcher
}

function onForceReset() {
  hasShownCelebration.value = false
  emit('force-reset')
}
</script>

<style scoped>
.vending-machine {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  padding: 12px;
}

.machine-body {
  background: linear-gradient(180deg, #3a3a5e 0%, #2a2a4e 100%);
  border: 4px solid #5a5a8a;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  image-rendering: pixelated;
  box-shadow:
    0 0 0 2px #1a1a3e,
    6px 6px 0 0 rgba(0, 0, 0, 0.25);
  position: relative;
}

.machine-body::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 60%;
  bottom: 60%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  pointer-events: none;
}

.machine-header {
  text-align: center;
  padding: 4px 0;
  position: relative;
}

.settings-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
}

.settings-btn:hover {
  background: #2a2a4e;
  color: #e5e7eb;
  border-color: #6a6a9a;
}

.machine-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 16px;
  color: #e5e7eb;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}

.machine-window {
  background: rgba(0, 0, 0, 0.2);
  border: 3px solid #4a4a6a;
  border-radius: 4px;
  padding: 6px;
  min-height: 280px;
}

/* Celebration */
.celebration-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 4px;
  cursor: pointer;
}

.celebration-content {
  text-align: center;
  animation: celebrationBounce 0.5s ease-out;
}

.celebration-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.celebration-text {
  font-family: 'Fusion Pixel', monospace;
  font-size: 20px;
  color: #4ade80;
  letter-spacing: 3px;
  text-shadow: 0 0 12px rgba(74, 222, 128, 0.8);
  margin-bottom: 4px;
}

.celebration-sub {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #9ca3af;
}

.celebration-enter-active {
  transition: opacity 0.3s ease;
}
.celebration-leave-active {
  transition: opacity 0.5s ease;
}
.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}

@keyframes celebrationBounce {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* Mobile: fill width */
@media (max-width: 479px) {
  .vending-machine {
    max-width: 95vw;
    padding: 8px;
  }

  .machine-body {
    padding: 8px;
    gap: 8px;
  }

  .machine-title {
    font-size: 14px;
  }

  .machine-window {
    min-height: 240px;
  }
}

/* Tablet */
@media (min-width: 480px) and (max-width: 768px) {
  .vending-machine {
    max-width: 400px;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .vending-machine {
    max-width: 420px;
  }

  .machine-body {
    padding: 16px;
  }

  .machine-title {
    font-size: 18px;
  }

  .machine-window {
    min-height: 320px;
  }
}
</style>
