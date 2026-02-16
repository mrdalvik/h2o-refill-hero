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
      <div class="shelf-divider"></div>
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
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 4px;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  position: relative;
  padding-bottom: 4px;
}

.grid-row:not(:last-child) {
  border-bottom: 3px solid #8b7355;
  margin-bottom: 2px;
}

.shelf-divider {
  display: none;
}

.grid-row::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    180deg,
    #a08060,
    #8b7355
  );
  image-rendering: pixelated;
  border-radius: 0 0 1px 1px;
}

.grid-row:last-child::after {
  display: none;
}
</style>
