<template>
  <Teleport to="body">
    <div v-if="visible" class="onboarding-root">
      <!-- Step 1: greeting only, no spotlight -->
      <template v-if="step === 1">
        <div class="onboarding-backdrop" @click.self="nextStep" />
        <div class="onboarding-card onboarding-card-float">
          <p class="onboarding-progress">{{ step }} / 3</p>
          <p class="onboarding-text">{{ $t('onboarding.step1') }}</p>
          <button class="onboarding-btn" @click="nextStep">
            {{ $t('onboarding.next') }}
          </button>
        </div>
      </template>

      <!-- Step 2 & 3: spotlight on element -->
      <template v-else-if="step === 2 || step === 3">
        <div class="onboarding-backdrop" @click.self="nextStep" />
        <div
          v-if="spotlightRect"
          class="onboarding-spotlight"
        >
          <div class="spotlight-top" :style="{ height: spotlightRect.top + 'px' }" />
          <div class="spotlight-middle" :style="{ height: spotlightRect.height + 'px' }">
            <div class="spotlight-left" :style="{ width: spotlightRect.left + 'px' }" />
            <div class="spotlight-hole" :style="{ width: spotlightRect.width + 'px', height: spotlightRect.height + 'px' }">
              <div class="spotlight-border" />
            </div>
            <div class="spotlight-right" :style="{ width: (windowWidth - spotlightRect.right) + 'px' }" />
          </div>
          <div class="spotlight-bottom" :style="{ height: (windowHeight - spotlightRect.bottom) + 'px' }" />
        </div>
        <div
          v-if="spotlightRect"
          class="onboarding-card onboarding-card-tooltip"
          :style="tooltipStyle"
        >
          <p class="onboarding-progress">{{ step }} / 3</p>
          <p class="onboarding-text">{{ step === 2 ? $t('onboarding.step2') : $t('onboarding.step3') }}</p>
          <button class="onboarding-btn" @click="nextStep">
            {{ step === 3 ? $t('onboarding.start') : $t('onboarding.next') }}
          </button>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const step = ref(1)
const spotlightRect = ref<DOMRect | null>(null)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 0)

const SELECTORS = {
  2: '[data-onboarding="numpad-panel"]',
  3: '[data-onboarding="settings-btn"]',
} as const

function getTargetRect(): DOMRect | null {
  const sel = SELECTORS[step.value as 2 | 3]
  const el = document.querySelector(sel)
  return el?.getBoundingClientRect() ?? null
}

function updateSpotlight() {
  if (step.value === 1) {
    spotlightRect.value = null
    return
  }
  spotlightRect.value = getTargetRect()
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

const tooltipStyle = computed(() => {
  if (!spotlightRect.value || step.value === 1) return {}
  const rect = spotlightRect.value
  const padding = 12
  if (step.value === 2) {
    return {
      top: rect.top + rect.height / 2 - 70 + 'px',
      left: Math.max(padding, rect.left - 210) + 'px',
      maxWidth: '200px',
    }
  }
  return {
    top: Math.max(padding, rect.top - 110) + 'px',
    left: Math.max(padding, Math.min(rect.left, windowWidth.value - 220)) + 'px',
    maxWidth: '200px',
  }
})

function nextStep() {
  if (step.value < 3) {
    step.value++
    setTimeout(updateSpotlight, 100)
  } else {
    emit('close')
  }
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      step.value = 1
      spotlightRect.value = null
    }
  }
)

let resizeObserver: ResizeObserver
let resizeHandler: () => void

onMounted(() => {
  resizeObserver = new ResizeObserver(updateSpotlight)
  resizeObserver.observe(document.documentElement)
  resizeHandler = () => {
    updateSpotlight()
  }
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('scroll', resizeHandler, true)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', resizeHandler)
  window.removeEventListener('scroll', resizeHandler, true)
})
</script>

<style scoped>
.onboarding-root {
  position: fixed;
  inset: 0;
  z-index: 3000;
  pointer-events: auto;
}

.onboarding-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.25s ease-out;
}

.onboarding-card {
  position: fixed;
  background: #1a1a2e;
  border: 4px solid #4a4a6a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
  pointer-events: auto;
}

.onboarding-card-float {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 320px;
}

.onboarding-progress {
  font-family: 'Fusion Pixel', monospace;
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 8px;
}

.onboarding-card-tooltip {
  z-index: 3001;
}

.onboarding-text {
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #e5e7eb;
  margin: 0 0 16px;
}

.onboarding-btn {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border: 3px solid #1d4ed8;
  color: #fff;
  font-family: 'Fusion Pixel', monospace;
  font-size: 13px;
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  letter-spacing: 2px;
  transition: background 0.15s;
}

.onboarding-btn:hover {
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
}

/* Spotlight: dark strips around the highlighted element */
.onboarding-spotlight {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 3000;
  display: flex;
  flex-direction: column;
}

.spotlight-top {
  flex-shrink: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.spotlight-middle {
  flex-shrink: 0;
  display: flex;
  width: 100%;
}

.spotlight-left,
.spotlight-right {
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.6);
}

.spotlight-hole {
  flex-shrink: 0;
  position: relative;
}

.spotlight-border {
  position: absolute;
  inset: 2px;
  border: 3px solid rgba(59, 130, 246, 0.9);
  border-radius: 6px;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.spotlight-bottom {
  flex: 1;
  min-height: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
