<template>
  <div class="water-counter" :class="{ 'goal-reached': waterStore.goalReached }">
    <div class="counter-display">
      {{ $t('vending.waterCounter', { current: waterStore.totalMl, goal: waterStore.dailyGoal }) }}
    </div>
    <div v-if="waterStore.goalReached" class="counter-badge">
      {{ $t('vending.goalReached') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWaterStore } from '@/stores/water'

const waterStore = useWaterStore()
</script>

<style scoped>
.water-counter {
  text-align: center;
  padding: 8px 12px;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  border-radius: 6px;
  image-rendering: pixelated;
}

.counter-display {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 18px;
  color: #4ade80;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  min-width: 14ch;
}

.counter-separator {
  margin: 0 4px;
  color: #6b7280;
}

.counter-goal {
  color: #9ca3af;
}

.goal-reached .counter-display {
  color: #22c55e;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
}

.counter-badge {
  margin-top: 4px;
  font-size: 11px;
  color: #22c55e;
  font-family: 'Fusion Pixel', monospace;
  letter-spacing: 1px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
