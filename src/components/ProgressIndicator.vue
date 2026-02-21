<template>
  <div class="delivery-window">
    <div class="window-frame">
      <div class="window-interior">
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :class="{ 'goal-done': waterStore.goalReached }"
            :style="{ width: waterStore.percentage + '%' }"
          >
            <div class="progress-bar-highlight"></div>
          </div>
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
  background: linear-gradient(180deg, #4a4a6e 0%, #3a3a5e 50%, #2a2a4e 100%);
  border: 4px solid #5a5a8a;
  border-radius: 4px;
  padding: 6px;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 2px 0 rgba(0, 0, 0, 0.2);
  image-rendering: pixelated;
}

.window-interior {
  background: linear-gradient(180deg, #0d0d1a 0%, #050510 100%);
  border: 2px solid #2a2a4e;
  border-radius: 2px;
  min-height: 36px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.5);
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
  background: linear-gradient(180deg, #4a90f0 0%, #3b82f6 50%, #2563eb 100%);
  transition: width 0.4s ease-out;
  image-rendering: pixelated;
  position: relative;
}

.progress-bar-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
}

.progress-bar-fill.goal-done {
  background: linear-gradient(180deg, #34d399 0%, #22c55e 50%, #16a34a 100%);
}
</style>
