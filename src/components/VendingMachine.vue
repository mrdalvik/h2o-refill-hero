<template>
  <div class="vending-machine-wrapper">
    <div class="vending-machine">
      <div class="machine-body">
        <div class="machine-awning">
          <div class="awning-stripes"></div>
          <h1 class="machine-title">{{ $t('app.title') }}</h1>
          <div class="awning-bolts"></div>
        </div>

        <div class="machine-main">
          <div class="machine-left">
            <WaterCounter />
            <div class="machine-window">
              <VendingGrid />
              <Transition name="removal">
                <div v-if="removingBottle" class="removal-overlay">
                  <div
                    class="removal-bottle"
                    :class="`bottle-${removingBottle.size}`"
                    :style="{ '--start-top': shelfTop(removingBottle.row), '--start-left': shelfLeft(removingBottle.col) }"
                  >
                    <BottleSprite :size="removingBottle.size" :ml="removingBottle.ml" :drink-type="removingBottle.drinkType ?? 'water'" />
                  </div>
                </div>
              </Transition>
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
      </div>
    </div>

    <NumpadDialog
      :visible="showNumpad"
      @close="showNumpad = false"
      @force-reset="onForceReset"
      @open-dev-settings="showDevSettings = true"
    />

    <DevSettingsPopup
      :visible="showDevSettings"
      @close="showDevSettings = false"
      @force-reset="onForceReset"
    />

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
      @show-onboarding="emit('show-onboarding')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWaterStore } from '@/stores/water'
import { useToast } from '@/composables/useToast'
import type { Bottle, CellPosition, DrinkType } from '@/types'
import { BOTTLE_REMOVAL_KEY } from '@/types/injectionKeys'
import { CELEBRATION_DISPLAY_MS, BOTTLE_REMOVAL_ANIMATION_MS } from '@/constants/timing'
import { shelfTop, shelfLeft } from '@/utils/shelfLayout'
import WaterCounter from './WaterCounter.vue'
import VendingGrid from './VendingGrid.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import BottleSprite from './BottleSprite.vue'
import ControlPanel from './ControlPanel.vue'
import NumpadDialog from './NumpadDialog.vue'
import SettingsDialog from './SettingsDialog.vue'
import DevSettingsPopup from './DevSettingsPopup.vue'

const emit = defineEmits<{
  'force-reset': []
  'show-onboarding': []
}>()

const { t } = useI18n()
const waterStore = useWaterStore()
const toast = useToast()

const showSettings = ref(false)
const showNumpad = ref(false)
const showDevSettings = ref(false)
const showCelebration = ref(false)
const hasShownCelebration = ref(waterStore.goalReached)
const removingBottle = ref<{ id: string; ml: number; size: 'small' | 'medium' | 'large'; drinkType: DrinkType; row: number; col: number } | null>(null)

provide(BOTTLE_REMOVAL_KEY, (bottle: Bottle, position: CellPosition, closePopup: () => void) => {
  closePopup()
  waterStore.removeBottle(bottle.id)
  removingBottle.value = { id: bottle.id, ml: bottle.ml, size: bottle.size, drinkType: bottle.drinkType ?? 'water', row: position.row, col: position.col }
  setTimeout(() => {
    removingBottle.value = null
  }, BOTTLE_REMOVAL_ANIMATION_MS)
  toast.showWithAction(
    t('toast.bottleRemoved'),
    t('toast.undo'),
    () => {
      removingBottle.value = null
      waterStore.restoreBottle(bottle, position)
    },
    { duration: 3000 }
  )
})

watch(() => waterStore.goalReached, (reached) => {
  if (reached && !hasShownCelebration.value) {
    showCelebration.value = true
    hasShownCelebration.value = true
    setTimeout(() => {
      showCelebration.value = false
    }, CELEBRATION_DISPLAY_MS)
  }
})

function onForceReset() {
  hasShownCelebration.value = false
  emit('force-reset')
}
</script>

<style scoped>
.vending-machine-wrapper {
  width: 100%;
  position: relative;
}

.vending-machine {
  width: 100%;
  min-width: 320px;
  max-width: 480px;
  margin: 0 auto;
  padding: 12px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.machine-body {
  width: 100%;
  min-width: 296px;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 4px,
      rgba(0, 0, 0, 0.03) 4px,
      rgba(0, 0, 0, 0.03) 8px
    ),
    linear-gradient(180deg, #e0e0e8 0%, #c8c8d0 30%, #a0a0b0 70%, #787888 100%);
  border: 4px solid #a0a0b0;
  border-radius: 12px;
  overflow: hidden;
  image-rendering: pixelated;
  box-shadow:
    0 0 0 2px #c0c0d0,
    0 0 0 3px #9090a0,
    8px 8px 0 0 rgba(0, 0, 0, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.machine-awning {
  background: linear-gradient(180deg, #e03535 0%, #dc2626 25%, #b91c1c 75%, #991b1b 100%);
  padding: 10px 16px;
  text-align: center;
  border-bottom: 4px solid #7f1d1d;
  box-shadow:
    0 4px 0 rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
}

.awning-stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    180deg,
    transparent 0,
    transparent 4px,
    rgba(0, 0, 0, 0.08) 4px,
    rgba(0, 0, 0, 0.08) 8px
  );
  pointer-events: none;
}

.awning-bolts {
  position: absolute;
  bottom: 4px;
  left: 8px;
  right: 8px;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.2) 80%, transparent 100%);
  pointer-events: none;
}

.machine-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 15px;
  color: #fff;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
}

.machine-main {
  display: flex;
  flex-direction: row;
  gap: 10px;
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
  position: relative;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.25) 100%);
  border: 3px solid #8a8a9a;
  border-radius: 6px;
  padding: 8px;
  height: 320px;
  min-height: 320px;
  max-height: 320px;
  flex-shrink: 0;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.2),
    0 0 0 1px #606070;
}

.machine-footer {
  padding: 2px 0;
}

.removal-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
}

.removal-bottle {
  position: absolute;
  top: var(--start-top, 45%);
  left: var(--start-left, 50%);
  transform: translate(-50%, 0);
  animation: bottleFallToWindow 1.2s ease-in forwards;
}

@keyframes bottleFallToWindow {
  0% {
    top: var(--start-top, 45%);
    transform: translate(-50%, 0) rotate(0deg);
    opacity: 1;
  }
  70% {
    top: 88%;
    transform: translate(-50%, 0) rotate(15deg);
    opacity: 1;
  }
  100% {
    top: 90%;
    transform: translate(-50%, 0) rotate(20deg);
    opacity: 0;
  }
}

.removal-enter-active,
.removal-leave-active {
  transition: opacity 0.2s;
}
.removal-enter-from,
.removal-leave-to {
  opacity: 0;
}

.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
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
    height: 240px;
    min-height: 240px;
    max-height: 240px;
  }
}

@media (min-width: 480px) and (max-width: 768px) {
  .vending-machine {
    max-width: 520px;
  }

  .machine-window {
    height: 300px;
    min-height: 300px;
    max-height: 300px;
  }
}

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
    height: 320px;
    min-height: 320px;
    max-height: 320px;
  }
}
</style>
