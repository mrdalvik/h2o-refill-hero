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
import DayBackground from './components/DayBackground.vue'
import CustomerAnimation from './components/CustomerAnimation.vue'
import VendingMachine from './components/VendingMachine.vue'
import { useDayReset } from './composables/useDayReset'
import { useWaterReminder } from './composables/useWaterReminder'

const { showAnimation, forceReset } = useDayReset()
useWaterReminder()

function onAnimationDone() {
  showAnimation.value = false
}

function onForceReset() {
  forceReset()
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Fusion Pixel', 'Courier New', monospace;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  image-rendering: pixelated;
  overflow-x: hidden;
  touch-action: manipulation;
  -ms-touch-action: manipulation;
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
