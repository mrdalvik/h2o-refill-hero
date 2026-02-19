<template>
  <div v-if="modelValue" class="changelog-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="changelog-popup" role="dialog" aria-modal="true" aria-labelledby="changelog-title">
      <div class="changelog-header">
        <span id="changelog-title" class="changelog-title">{{ $t('settings.whatsNew') }}</span>
        <button
          class="changelog-close"
          aria-label="Close"
          @click="$emit('update:modelValue', false)"
        >
          &#x2715;
        </button>
      </div>
      <div class="changelog-body">
        <div
          v-for="block in CHANGELOG"
          :key="block.version"
          class="changelog-block"
        >
          <div class="changelog-version">{{ $t('settings.version') }} {{ block.version }}</div>
          <ul class="changelog-list">
            <li
              v-for="(entry, i) in block.entries"
              :key="i"
              class="changelog-entry"
            >
              {{ entry }}
            </li>
          </ul>
        </div>
      </div>
      <button class="changelog-close-btn" @click="$emit('update:modelValue', false)">
        {{ $t('settings.close') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CHANGELOG } from '@/constants/changelog'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.changelog-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.2s ease-out;
}

.changelog-popup {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  width: 320px;
  max-width: 90vw;
  max-height: 70vh;
  overflow-y: auto;
  animation: slideUp 0.25s ease-out;
}

.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.changelog-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #e5e7eb;
  letter-spacing: 1px;
}

.changelog-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
}

.changelog-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.changelog-body {
  margin-bottom: 16px;
}

.changelog-block {
  margin-bottom: 16px;
}

.changelog-block:last-child {
  margin-bottom: 0;
}

.changelog-version {
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 8px;
}

.changelog-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.changelog-entry {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 8px;
  position: relative;
}

.changelog-entry::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 8px;
  width: 4px;
  height: 4px;
  background: #6b7280;
  border-radius: 50%;
}

.changelog-entry:last-child {
  margin-bottom: 0;
}

.changelog-close-btn {
  width: 100%;
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, border-color 0.15s;
}

.changelog-close-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
