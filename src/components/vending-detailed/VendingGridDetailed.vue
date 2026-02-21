<template>
  <div class="vending-grid-detailed">
    <div
      v-for="(row, rowIndex) in waterStore.cells"
      :key="rowIndex"
      class="grid-row"
    >
      <VendingCellDetailed
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :cell="cell"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWaterStore } from '@/stores/water'
import VendingCellDetailed from './VendingCellDetailed.vue'

const waterStore = useWaterStore()
</script>

<style scoped>
.vending-grid-detailed {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.35) 100%);
  border-radius: 4px;
  padding: 6px;
  width: 100%;
  min-width: 185px;
  height: 272px;
  max-height: 272px;
  flex-shrink: 0;
  overflow: hidden;
  image-rendering: pixelated;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 68px;
  gap: 4px;
  position: relative;
  padding-bottom: 6px;
  height: 68px;
  min-height: 68px;
  max-height: 68px;
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
</style>
