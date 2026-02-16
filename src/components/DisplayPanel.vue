<template>
  <div class="display-panel" @click="$emit('open-numpad')">
    <div class="display-screen">
      <span class="display-text">{{ displayText }}</span>
    </div>
    <div class="display-hint">&#9654; {{ $t('vending.hintPress') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWaterStore } from '@/stores/water'

const { t } = useI18n()
const waterStore = useWaterStore()

defineEmits<{
  'open-numpad': []
}>()

const lastBottle = computed(() => {
  const bottles = waterStore.bottles
  return bottles.length > 0 ? bottles[bottles.length - 1] : null
})

const displayText = computed(() => {
  if (lastBottle.value) {
    return `${lastBottle.value.ml} ${t('unit.ml')}`
  }
  return t('vending.emptyDisplay')
})
</script>

<style scoped>
.display-panel {
  cursor: pointer;
  background: #0d0d1a;
  border: 3px solid #4a4a6a;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  transition: border-color 0.2s;
  image-rendering: pixelated;
}

.display-panel:hover {
  border-color: #6b6b9a;
}

.display-panel:active {
  border-color: #8b8bba;
  background: #111128;
}

.display-screen {
  background: #0a2a0a;
  border: 2px solid #1a4a1a;
  border-radius: 2px;
  padding: 6px 12px;
  margin-bottom: 6px;
}

.display-text {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 20px;
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
  letter-spacing: 3px;
}

.display-hint {
  font-family: 'Fusion Pixel', monospace;
  font-size: 10px;
  color: #6b7280;
  letter-spacing: 1px;
}
</style>
