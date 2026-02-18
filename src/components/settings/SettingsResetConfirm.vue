<template>
  <div v-if="modelValue" class="calc-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="calc-popup reset-popup" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <div class="calc-header">
        <span id="reset-title" class="calc-title">{{ $t('settings.resetConfirmTitle') }}</span>
        <button
          class="calc-close"
          aria-label="Close"
          @click="$emit('update:modelValue', false)"
        >
          &#x2715;
        </button>
      </div>
      <p class="reset-message">{{ $t('settings.resetConfirmMessage') }}</p>
      <div class="reset-actions">
        <button class="reset-cancel-btn" @click="$emit('update:modelValue', false)">
          {{ $t('settings.resetCancel') }}
        </button>
        <button class="reset-confirm-btn" @click="$emit('confirm')">
          {{ $t('settings.resetConfirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>

<style scoped>
.calc-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.2s ease-out;
}

.calc-popup {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 8px;
  padding: 16px;
  width: 280px;
  max-width: 90vw;
  animation: slideUp 0.25s ease-out;
}

.calc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.calc-title {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: #e5e7eb;
  letter-spacing: 1px;
}

.calc-close {
  background: none;
  border: 2px solid #4a4a6a;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 2px;
}

.calc-close:hover {
  background: #2a2a4e;
  color: #fff;
}

.reset-message {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #d1d5db;
  line-height: 1.5;
  margin: 0 0 16px;
}

.reset-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.reset-cancel-btn {
  background: #2a2a4e;
  border: 2px solid #4a4a6a;
  color: #d1d5db;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.reset-cancel-btn:hover {
  background: #3a3a5e;
  border-color: #6a6a9a;
}

.reset-confirm-btn {
  background: #7f1d1d;
  border: 2px solid #991b1b;
  color: #fecaca;
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.reset-confirm-btn:hover {
  background: #991b1b;
  border-color: #b91c1c;
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
