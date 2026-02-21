<template>
  <div class="water-counter" :class="{ 'goal-reached': waterStore.goalReached }">
    <div class="counter-frame">
      <div class="counter-display">
        {{ $t('vending.waterCounter', { current: waterStore.totalMl, goal: waterStore.dailyGoal }) }}
      </div>
      <div v-if="waterStore.goalReached" class="counter-badge">
        <span class="badge-icon">&#10003;</span>
        {{ $t('vending.goalReached') }}
      </div>
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
}

.counter-frame {
  padding: 8px 10px;
  background: linear-gradient(180deg, #3a3a5e 0%, #2a2a4e 50%, #1a1a3e 100%);
  border: 3px solid #5a5a8a;
  border-radius: 6px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 2px 0 rgba(0, 0, 0, 0.2),
    2px 0 0 #4a4a7a;
  image-rendering: pixelated;
}

.counter-display {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 16px;
  color: #4ade80;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.goal-reached .counter-display {
  color: #22c55e;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
}

@media (max-width: 479px) {
  .counter-frame {
    padding: 6px 8px;
  }

  .counter-display {
    font-size: 14px;
  }
}

.counter-badge {
  margin-top: 6px;
  font-size: 11px;
  color: #22c55e;
  font-family: 'Fusion Pixel', monospace;
  letter-spacing: 1px;
  animation: pulse 1.5s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.badge-icon {
  font-size: 12px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
