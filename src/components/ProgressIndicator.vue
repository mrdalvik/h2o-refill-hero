<template>
  <div class="delivery-window">
    <div class="window-frame">
      <div class="window-interior">
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :class="{ 'goal-done': waterStore.goalReached }"
            :style="{ width: waterStore.percentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWaterStore } from '@/stores/water'

const waterStore = useWaterStore()
</script>

<style scoped>
.delivery-window {
  width: 100%;
}

.window-frame {
  background: #3a3a5e;
  border: 4px solid #5a5a8a;
  border-radius: 4px;
  padding: 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.window-interior {
  background: #0d0d1a;
  border: 2px solid #2a2a4e;
  border-radius: 2px;
  min-height: 36px;
  overflow: hidden;
  position: relative;
}

.progress-bar-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 12px;
  background: #1a1a2e;
  image-rendering: pixelated;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.4s ease-out;
  image-rendering: pixelated;
  position: relative;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.progress-bar-fill.goal-done {
  background: linear-gradient(90deg, #22c55e, #4ade80);
}
</style>
