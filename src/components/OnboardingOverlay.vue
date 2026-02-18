<template>
  <Teleport to="body">
    <div v-if="visible" class="onboarding-overlay">
      <div class="onboarding-card">
        <p class="onboarding-text">{{ $t('onboarding.text') }}</p>
        <button class="onboarding-btn" @click="$emit('close')">
          {{ $t('onboarding.gotIt') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 24px;
  animation: fadeIn 0.3s ease-out;
}

.onboarding-card {
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 12px;
  padding: 24px;
  max-width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.35s ease-out;
}

.onboarding-text {
  font-family: 'Fusion Pixel', monospace;
  font-size: 15px;
  line-height: 1.6;
  color: #e5e7eb;
  margin: 0 0 20px;
  white-space: pre-line;
}

.onboarding-btn {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border: 3px solid #1d4ed8;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  letter-spacing: 2px;
  transition: background 0.15s;
}

.onboarding-btn:hover {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
