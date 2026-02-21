<template>
  <div class="vending-machine-wrapper">
    <VendingMachineClassic
      v-if="!detailed"
      :removing-bottle="removingBottle"
      @open-settings="showSettings = true"
      @open-numpad="showNumpad = true"
    />
    <VendingMachineDetailed
      v-else
      :removing-bottle="removingBottle"
      @open-settings="showSettings = true"
      @open-numpad="showNumpad = true"
    />

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
import { ref, watch, provide, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWaterStore } from '@/stores/water'
import { useToast } from '@/composables/useToast'
import type { Bottle, CellPosition, DrinkType } from '@/types'
import { BOTTLE_REMOVAL_KEY, DETAILED_VENDING_KEY } from '@/types/injectionKeys'
import { CELEBRATION_DISPLAY_MS, BOTTLE_REMOVAL_ANIMATION_MS } from '@/constants/timing'
import VendingMachineClassic from './VendingMachineClassic.vue'
import VendingMachineDetailed from './vending-detailed/VendingMachineDetailed.vue'
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

const detailedVending = inject(DETAILED_VENDING_KEY)
const detailed = computed(() => detailedVending?.detailed?.value ?? false)

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
</style>
