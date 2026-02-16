<template>
  <div class="vending-machine">
    <div class="machine-body">
      <div class="machine-awning">
        <h1 class="machine-title">{{ $t('app.title') }}</h1>
      </div>

      <div class="machine-main">
        <div class="machine-left">
          <WaterCounter />
          <div class="machine-window">
            <VendingGrid />
          </div>
          <div class="machine-footer">
            <ProgressIndicator />
          </div>
        </div>

        <div class="machine-right">
          <ControlPanel
            @open-settings="showSettings = true"
            @open-numpad="showNumpad = true"
          />
        </div>
      </div>

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
import ProgressIndicator from './ProgressIndicator.vue'
import ControlPanel from './ControlPanel.vue'
import NumpadDialog from './NumpadDialog.vue'
import SettingsDialog from './SettingsDialog.vue'

const emit = defineEmits<{
  'force-reset': []
}>()

const waterStore = useWaterStore()
const showSettings = ref(false)
const showNumpad = ref(false)
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
  min-width: 320px;
  max-width: 480px;
  margin: 0 auto;
  padding: 12px;
  box-sizing: border-box;
}

.machine-body {
  width: 100%;
  background: linear-gradient(180deg, #e8e8f0 0%, #d0d0dc 100%);
  border: 4px solid #a0a0b0;
  border-radius: 12px;
  overflow: hidden;
  image-rendering: pixelated;
  box-shadow:
    0 0 0 2px #c0c0d0,
    8px 8px 0 0 rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
}

.machine-awning {
  background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
  padding: 10px 16px;
  text-align: center;
  border-bottom: 4px solid #991b1b;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
}

.machine-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 15px;
  color: #fff;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.machine-main {
  display: flex;
  flex-direction: row;
  gap: 0;
  padding: 10px;
}

.machine-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.machine-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.machine-window {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.15) 100%);
  border: 3px solid #8a8a9a;
  border-radius: 6px;
  padding: 8px;
  min-height: 260px;
  flex: 1;
}

.machine-footer {
  padding: 2px 0;
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

/* Mobile */
@media (max-width: 479px) {
  .vending-machine {
    max-width: 95vw;
    padding: 8px;
  }

  .machine-main {
    padding: 8px;
  }

  .machine-title {
    font-size: 14px;
  }

  .machine-window {
    min-height: 200px;
  }
}

/* Tablet */
@media (min-width: 480px) and (max-width: 768px) {
  .vending-machine {
    max-width: 520px;
  }

  .machine-window {
    min-height: 280px;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .vending-machine {
    max-width: 540px;
  }

  .machine-main {
    padding: 12px;
  }

  .machine-title {
    font-size: 16px;
  }

  .machine-window {
    min-height: 300px;
  }
}
</style>
