<template>
  <div class="progress-indicator">
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :class="{ 'goal-done': waterStore.goalReached }"
        :style="{ width: waterStore.percentage + '%' }"
      ></div>
    </div>
    <div class="progress-label">
      <span>{{ waterStore.percentage }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWaterStore } from '@/stores/water'

const waterStore = useWaterStore()
</script>

<style scoped>
.progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.progress-bar-track {
  flex: 1;
  height: 12px;
  background: #1a1a2e;
  border: 2px solid #4a4a6a;
  border-radius: 2px;
  overflow: hidden;
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

.progress-label {
  font-family: 'Fusion Pixel', 'Courier New', monospace;
  font-size: 12px;
  color: #9ca3af;
  min-width: 36px;
  text-align: right;
}

.goal-done + .progress-label,
.progress-indicator:has(.goal-done) .progress-label {
  color: #22c55e;
}
</style>
