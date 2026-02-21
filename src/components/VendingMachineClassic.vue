<template>
  <div class="vending-machine classic">
    <div class="machine-body">
      <div class="machine-awning">
        <h1 class="machine-title">{{ $t('app.title') }}</h1>
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
            @open-settings="$emit('open-settings')"
            @open-numpad="$emit('open-numpad')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shelfTop, shelfLeft } from '@/utils/shelfLayout'
import WaterCounter from './WaterCounter.vue'
import VendingGrid from './VendingGrid.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import BottleSprite from './BottleSprite.vue'
import ControlPanel from './ControlPanel.vue'

defineProps<{
  removingBottle: { id: string; ml: number; size: 'small' | 'medium' | 'large'; drinkType: import('@/types').DrinkType; row: number; col: number } | null
}>()

defineEmits<{
  'open-settings': []
  'open-numpad': []
}>()
</script>

<style scoped>
.vending-machine.classic {
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
  position: relative;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.15) 100%);
  border: 3px solid #8a8a9a;
  border-radius: 6px;
  padding: 8px;
  height: 288px;
  min-height: 288px;
  flex-shrink: 0;
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

@media (max-width: 479px) {
  .vending-machine.classic {
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

@media (min-width: 480px) and (max-width: 768px) {
  .vending-machine.classic {
    max-width: 520px;
  }

  .machine-window {
    min-height: 280px;
  }
}

@media (min-width: 769px) {
  .vending-machine.classic {
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
