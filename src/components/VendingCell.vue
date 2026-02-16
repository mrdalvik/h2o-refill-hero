<template>
  <div class="vending-cell" :class="{ 'cell-empty': cell.bottles.length === 0 }">
    <div v-if="cell.bottles.length > 0" class="cell-bottles">
      <div
        v-for="(bottle, index) in cell.bottles"
        :key="bottle.id"
        class="cell-bottle-wrapper"
        :class="{ 'second-row': index === 1 }"
        @click="showBottlePopup(bottle)"
      >
        <BottleSprite :size="bottle.size" :ml="bottle.ml" />
      </div>
    </div>

    <Teleport to="body">
      <div v-if="popupBottle" class="bottle-popup-overlay" @click.self="popupBottle = null">
        <div class="bottle-popup">
          <div class="bottle-popup-title">{{ $t('bottles.popupTitle') }}</div>
          <div class="bottle-popup-ml">{{ popupBottle.ml }} {{ $t('unit.ml') }}</div>
          <div class="bottle-popup-time">{{ formatTime(popupBottle.addedAt) }}</div>
          <button class="bottle-popup-close" @click="popupBottle = null">&#x2715;</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Cell, Bottle } from '@/types'
import BottleSprite from './BottleSprite.vue'

const { locale } = useI18n()

defineProps<{
  cell: Cell
}>()

const popupBottle = ref<Bottle | null>(null)

function showBottlePopup(bottle: Bottle) {
  popupBottle.value = bottle
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
  })
}
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
  cursor: pointer;
}

.cell-bottle-wrapper:hover {
  filter: brightness(1.1);
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

.bottle-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.bottle-popup {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px 20px;
  min-width: 180px;
  position: relative;
  animation: slideUp 0.25s ease-out;
}

.bottle-popup-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  color: #9ca3af;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.bottle-popup-ml {
  font-family: 'Fusion Pixel', monospace;
  font-size: 20px;
  color: #4ade80;
  margin-bottom: 4px;
}

.bottle-popup-time {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #9ca3af;
}

.bottle-popup-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
}

.bottle-popup-close:hover {
  background: #2a2a4e;
  color: #fff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 769px) {
  .vending-cell {
    min-height: 70px;
    padding: 3px;
  }
}
</style>
