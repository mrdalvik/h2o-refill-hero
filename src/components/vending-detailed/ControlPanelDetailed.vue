<template>
  <div class="control-panel-detailed" data-onboarding="numpad-panel">
    <div class="panel-display panel-clickable" @click="$emit('open-numpad')">
      <span class="panel-value">{{ displayValue }}</span>
      <span class="panel-unit">{{ $t('unit.ml') }}</span>
      <span class="panel-hint">{{ $t('vending.hintPress') }}</span>
    </div>

    <div class="panel-numpad panel-clickable" @click="$emit('open-numpad')">
      <div class="numpad-placeholder">
        <span v-for="key in keys" :key="key" class="numpad-key-placeholder">{{ key }}</span>
      </div>
    </div>

    <button class="panel-settings" data-onboarding="settings-btn" @click="$emit('open-settings')" :title="$t('settings.title')">
      <span class="settings-icon">&#9881;</span>
      {{ $t('settings.title') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineEmits<{
  'open-settings': []
  'open-numpad': []
}>()

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

const displayValue = computed(() => '---')
</script>

<style scoped>
.control-panel-detailed {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 140px;
  min-width: 140px;
  flex-shrink: 0;
  padding: 10px;
  background: linear-gradient(180deg, #2a2a45 0%, #1a1a35 100%);
  border: 3px solid #4a4a6a;
  border-left: 4px solid #5a5a7a;
  border-radius: 6px;
  box-shadow:
    inset 2px 0 4px rgba(0, 0, 0, 0.2),
    0 2px 0 rgba(0, 0, 0, 0.15);
  image-rendering: pixelated;
}

.panel-display {
  background: linear-gradient(180deg, #0a1a0a 0%, #051005 100%);
  border: 3px solid #1a3a1a;
  border-radius: 4px;
  padding: 8px 12px;
  text-align: right;
  min-height: 36px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.4);
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
  background: linear-gradient(180deg, #1a1a2e 0%, #0a0a1e 100%);
  border: 2px solid #3a3a5a;
  border-radius: 4px;
  padding: 6px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.numpad-placeholder {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.numpad-key-placeholder {
  background: linear-gradient(180deg, #2a2a4e 0%, #1a1a3e 100%);
  border: 2px solid #4a4a6a;
  border-top-color: #5a5a7a;
  color: #6b7280;
  font-family: 'Fusion Pixel', 'Courier New', monospace;
  font-size: 12px;
  padding: 6px 2px;
  border-radius: 3px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.panel-settings {
  background: linear-gradient(180deg, #2a2a4e 0%, #1a1a3e 100%);
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-family: 'Fusion Pixel', monospace;
  font-size: 11px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.settings-icon {
  font-size: 12px;
}

.panel-settings:hover {
  background: linear-gradient(180deg, #3a3a5e 0%, #2a2a4e 100%);
  color: #e5e7eb;
  border-color: #6a6a9a;
}

@media (max-width: 479px) {
  .control-panel-detailed {
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

  .numpad-key-placeholder {
    padding: 4px 2px;
    font-size: 10px;
  }

  .panel-settings {
    padding: 6px;
    font-size: 10px;
  }
}
</style>
