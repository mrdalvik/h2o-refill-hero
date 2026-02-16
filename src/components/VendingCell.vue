<template>
  <div class="vending-cell" :class="{ 'cell-empty': cell.bottles.length === 0 }">
    <div v-if="cell.bottles.length > 0" class="cell-bottles">
      <div
        v-for="(bottle, index) in cell.bottles"
        :key="bottle.id"
        class="cell-bottle-wrapper"
        :class="{ 'second-row': index === 1 }"
      >
        <BottleSprite :size="bottle.size" :ml="bottle.ml" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cell } from '@/types'
import BottleSprite from './BottleSprite.vue'

defineProps<{
  cell: Cell
}>()
</script>

<style scoped>
.vending-cell {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 60px;
  background: rgba(200, 220, 240, 0.08);
  border-radius: 2px;
  padding: 2px;
}

.cell-empty {
  opacity: 0.4;
}

.cell-bottles {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.cell-bottle-wrapper {
  animation: bottleAppear 0.3s ease-out;
}

.cell-bottle-wrapper.second-row {
  position: absolute;
  top: 0;
  z-index: 1;
}

@keyframes bottleAppear {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (min-width: 769px) {
  .vending-cell {
    min-height: 70px;
    padding: 3px;
  }
}
</style>
