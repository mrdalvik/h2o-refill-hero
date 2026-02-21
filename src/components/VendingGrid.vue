<template>
  <div class="vending-grid">
    <div
      v-for="(row, rowIndex) in waterStore.cells"
      :key="rowIndex"
      class="grid-row"
    >
      <VendingCell
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :cell="cell"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWaterStore } from '@/stores/water'
import VendingCell from './VendingCell.vue'

const waterStore = useWaterStore()
</script>

<style scoped>
.vending-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.35) 100%);
  border-radius: 4px;
  padding: 6px;
  width: 100%;
  min-width: 0;
  height: 320px;
  max-height: 320px;
  flex-shrink: 0;
  overflow: hidden;
  image-rendering: pixelated;
  box-sizing: border-box;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: 76px;
  gap: 4px;
  position: relative;
  padding-bottom: 6px;
  height: 76px;
  min-height: 76px;
  max-height: 76px;
  flex-shrink: 0;
  overflow: hidden;
}

.grid-row:not(:last-child) {
  border-bottom: 4px solid #6b5344;
  margin-bottom: 2px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.grid-row::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(180deg, #a08060 0%, #8b7355 50%, #6b5344 100%);
  image-rendering: pixelated;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
}

.grid-row:last-child::after {
  display: none;
}

@media (max-width: 479px) {
  .vending-grid {
    height: 248px;
    max-height: 248px;
  }

  .grid-row {
    grid-template-rows: 62px;
    height: 62px;
    min-height: 62px;
    max-height: 62px;
  }
}

@media (min-width: 480px) and (max-width: 768px) {
  .vending-grid {
    height: 304px;
    max-height: 304px;
  }

  .grid-row {
    grid-template-rows: 76px;
    height: 76px;
    min-height: 76px;
    max-height: 76px;
  }
}
</style>
