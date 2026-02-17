<template>
  <div class="control-panel">
    <div class="panel-display panel-clickable" @click="$emit('open-numpad')">
      <span class="panel-value">{{ displayValue }}</span>
      <span class="panel-unit">{{ $t('unit.ml') }}</span>
      <span class="panel-hint">{{ $t('vending.hintPress') }}</span>
    </div>

    <div class="panel-numpad panel-clickable" @click="$emit('open-numpad')">
      <div class="numpad-placeholder">
        <span class="numpad-placeholder-value">---</span>
      </div>
    </div>

    <button class="panel-settings" @click="$emit('open-settings')" :title="$t('settings.title')">
      &#9881; {{ $t('settings.title') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWaterStore } from '@/stores/water'

defineEmits<{
  'open-settings': []
  'open-numpad': []
}>()

const waterStore = useWaterStore()

const displayValue = computed(() => {
  const bottles = waterStore.bottles
  return bottles.length > 0 ? String(bottles[bottles.length - 1].ml) : '---'
})
</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 140px;
  min-width: 140px;
  flex-shrink: 0;
  padding: 8px;
  background: #252540;
  border: 3px solid #4a4a6a;
  border-radius: 6px;
  border-left: 2px solid #3a3a5a;
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.2);
}

.panel-display {
  background: #0a1a0a;
  border: 3px solid #1a3a1a;
  border-radius: 4px;
  padding: 8px 12px;
  text-align: right;
  min-height: 36px;
}

.panel-clickable {
  cursor: pointer;
  transition: filter 0.15s;
}

.panel-clickable:hover {
  filter: brightness(1.1);
}

.panel-clickable:active {
  filter: brightness(0.95);
}

.panel-hint {
  display: block;
  font-size: 9px;
  color: #5a8a5a;
  margin-top: 2px;
  text-align: center;
}

.panel-value {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 18px;
  color: #4ade80;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
  letter-spacing: 2px;
}

.panel-unit {
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  color: #5a8a5a;
  margin-left: 4px;
}

.panel-numpad {
  background: #1a1a2e;
  border: 2px solid #3a3a5a;
  border-radius: 4px;
  padding: 6px;
}

.numpad-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.numpad-placeholder-value {
  font-family: 'Courier New', 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #6b7280;
  letter-spacing: 2px;
}

.panel-settings {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.panel-settings:hover {
  background: #3a3a5e;
  color: #e5e7eb;
  border-color: #6a6a9a;
}

@media (max-width: 479px) {
  .control-panel {
    width: 120px;
    min-width: 120px;
    padding: 6px;
    gap: 6px;
  }

  .panel-display {
    padding: 6px 8px;
    min-height: 30px;
  }

  .panel-value {
    font-size: 14px;
  }

  .numpad-placeholder-value {
    font-size: 12px;
  }

  .panel-settings {
    padding: 6px;
    font-size: 10px;
  }
}
</style>
