<template>
  <div class="customer-animation">
    <div class="animation-scene">
      <div
        v-for="(customer, i) in customers"
        :key="i"
        class="customer"
        :class="`customer-${i + 1}`"
        :style="{ animationDelay: `${i * 0.3}s`, '--color': customer.color, '--hair': customer.hair }"
      >
        <!-- Pixel person -->
        <div class="person-head"></div>
        <div class="person-body"></div>
        <div class="person-legs">
          <div class="leg leg-left"></div>
          <div class="leg leg-right"></div>
        </div>
      </div>
      <div class="vending-silhouette"></div>
    </div>
    <div class="animation-text">Покупатели забирают воду...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const emit = defineEmits<{
  done: []
}>()

const customers = [
  { color: '#ef4444', hair: '#92400e' },
  { color: '#3b82f6', hair: '#1e1b4b' },
  { color: '#22c55e', hair: '#fbbf24' },
]

onMounted(() => {
  setTimeout(() => {
    emit('done')
  }, 5000)
})
</script>

<style scoped>
.customer-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 20px;
}

.animation-scene {
  position: relative;
  width: 280px;
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.vending-silhouette {
  width: 80px;
  height: 120px;
  background: #3a3a5e;
  border: 3px solid #5a5a8a;
  border-radius: 4px;
  position: absolute;
  right: 30px;
  bottom: 0;
  image-rendering: pixelated;
}

.vending-silhouette::before {
  content: 'H2O';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Fusion Pixel', monospace;
  font-size: 10px;
  color: #4ade80;
  letter-spacing: 1px;
}

.customer {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: customerWalk 5s ease-in-out forwards;
  image-rendering: pixelated;
}

.customer-1 { left: -40px; animation-delay: 0s; }
.customer-2 { left: -40px; animation-delay: 0.3s; }
.customer-3 { left: -40px; animation-delay: 0.6s; }

.person-head {
  width: 10px;
  height: 10px;
  background: #fcd9b6;
  border: 2px solid #d4a574;
  position: relative;
  image-rendering: pixelated;
}

.person-head::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -2px;
  right: -2px;
  height: 5px;
  background: var(--hair, #1e1b4b);
  image-rendering: pixelated;
}

.person-body {
  width: 14px;
  height: 14px;
  background: var(--color, #3b82f6);
  border: 2px solid rgba(0,0,0,0.2);
  image-rendering: pixelated;
}

.person-legs {
  display: flex;
  gap: 2px;
}

.leg {
  width: 5px;
  height: 8px;
  background: #4a4a6a;
  border: 1px solid #3a3a5a;
  image-rendering: pixelated;
}

.customer-1 .leg { animation: walk 0.4s steps(2) infinite; }
.customer-2 .leg { animation: walk 0.35s steps(2) infinite; animation-delay: 0.1s; }
.customer-3 .leg { animation: walk 0.45s steps(2) infinite; animation-delay: 0.2s; }

.animation-text {
  margin-top: 24px;
  font-family: 'Fusion Pixel', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
  animation: textPulse 1.5s ease-in-out infinite;
}

@keyframes customerWalk {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(140px);
  }
  60% {
    transform: translateX(140px) scale(1);
  }
  65% {
    transform: translateX(140px) scale(1.05);
  }
  70% {
    transform: translateX(140px) scale(1);
  }
  100% {
    transform: translateX(350px);
  }
}

@keyframes walk {
  0% { height: 8px; }
  50% { height: 6px; }
  100% { height: 8px; }
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
