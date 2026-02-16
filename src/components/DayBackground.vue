<template>
  <div class="day-background" :class="`time-${timeOfDay}`">
    <div class="sky-layer"></div>
    <div v-if="timeOfDay === 'night'" class="stars">
      <div v-for="n in 30" :key="n" class="star" :style="starStyle(n)"></div>
    </div>
    <div v-if="timeOfDay === 'morning'" class="sun pixel-sun"></div>
    <div v-if="timeOfDay === 'day'" class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
    </div>
    <div v-if="timeOfDay === 'evening'" class="sunset-glow"></div>

    <div class="tree" :class="`tree-${timeOfDay}`">
      <div class="tree-trunk"></div>
      <div class="tree-foliage foliage-1"></div>
      <div class="tree-foliage foliage-2"></div>
      <div class="tree-foliage foliage-3"></div>
    </div>

    <TransitionGroup v-if="showBirds" name="bird" tag="div" class="birds-layer">
      <div
        v-for="bird in birds"
        :key="bird.id"
        class="bird"
        :class="`bird-${timeOfDay}`"
        :style="birdStyle(bird)"
      >
        {{ bird.char }}
      </div>
    </TransitionGroup>

    <div class="ground" :class="`ground-${timeOfDay}`"></div>

    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimeOfDay } from '@/composables/useTimeOfDay'
const timeOfDay = useTimeOfDay()

const birds = ref<{ id: number; char: string; top: number; delay: number }[]>([])
let birdId = 0
let birdInterval: ReturnType<typeof setInterval> | null = null

const showBirds = computed(() => timeOfDay.value !== 'night')

function starStyle(n: number) {
  const seed = n * 7919
  const x = ((seed * 13) % 97)
  const y = ((seed * 17) % 43)
  const size = (n % 3) + 1
  const delay = (n % 5) * 0.7
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size * 2}px`,
    height: `${size * 2}px`,
    animationDelay: `${delay}s`,
  }
}

function spawnBird() {
  if (timeOfDay.value === 'night') return
  const top = 10 + Math.random() * 50
  const delay = Math.random() * 2
  const id = ++birdId
  birds.value.push({
    id,
    char: Math.random() > 0.5 ? '›' : '‹',
    top,
    delay,
  })
  setTimeout(() => {
    birds.value = birds.value.filter((b) => b.id !== id)
  }, 8000)
}

function birdStyle(bird: { top: number; delay: number }) {
  return {
    top: `${bird.top}%`,
    animationDelay: `${bird.delay}s`,
  }
}

onMounted(() => {
  birdInterval = setInterval(() => {
    if (Math.random() < 0.15) spawnBird()
  }, 4000)
})

onUnmounted(() => {
  if (birdInterval) clearInterval(birdInterval)
})
</script>

<style scoped>
.day-background {
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
  transition: background 2s ease;
}

.sky-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  transition: background 2s ease;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 60px;
}

/* Ground - pixel asphalt */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 5;
  image-rendering: pixelated;
  background-repeat: repeat-x;
  background-size: 24px 24px;
}

.ground-morning {
  background-color: #4a4a4a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 11px, #3a3a3a 11px, #3a3a3a 12px),
    linear-gradient(0deg, transparent 0, transparent 11px, #3a3a3a 11px, #3a3a3a 12px);
  background-size: 24px 24px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.2);
}

.ground-day {
  background-color: #5a5a5a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 11px, #4a4a4a 11px, #4a4a4a 12px),
    linear-gradient(0deg, transparent 0, transparent 11px, #4a4a4a 11px, #4a4a4a 12px);
  background-size: 24px 24px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.15);
}

.ground-evening {
  background-color: #4a3a3a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 11px, #3a2a2a 11px, #3a2a2a 12px),
    linear-gradient(0deg, transparent 0, transparent 11px, #3a2a2a 11px, #3a2a2a 12px);
  background-size: 24px 24px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.25);
}

.ground-night {
  background-color: #1a1a1a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 11px, #0d0d0d 11px, #0d0d0d 12px),
    linear-gradient(0deg, transparent 0, transparent 11px, #0d0d0d 11px, #0d0d0d 12px);
  background-size: 24px 24px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.4);
}

/* Tree */
.tree {
  position: absolute;
  left: 5%;
  bottom: 60px;
  z-index: 3;
  image-rendering: pixelated;
}

.tree-trunk {
  width: 16px;
  height: 48px;
  background: #5c4033;
  border: 2px solid #4a3328;
  margin-left: 8px;
  border-radius: 2px;
}

.tree-foliage {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 48px;
  height: 40px;
  border-radius: 4px;
  animation: rustle 3s ease-in-out infinite;
}

.foliage-1 {
  background: #228b22;
  box-shadow: 8px 0 0 #2d9d2d, 16px 4px 0 #1a6b1a;
  animation-delay: 0s;
}

.foliage-2 {
  left: 12px;
  bottom: 52px;
  width: 40px;
  height: 36px;
  background: #2d9d2d;
  box-shadow: 6px 0 0 #228b22, 12px 2px 0 #1a6b1a;
  animation-delay: 0.5s;
}

.foliage-3 {
  left: 4px;
  bottom: 64px;
  width: 36px;
  height: 32px;
  background: #1a6b1a;
  box-shadow: 6px 0 0 #228b22;
  animation-delay: 1s;
}

.tree-morning .tree-foliage { filter: brightness(1.1) saturate(0.9); }
.tree-day .tree-foliage { filter: brightness(1); }
.tree-evening .tree-foliage { filter: brightness(0.85) hue-rotate(-10deg); }
.tree-night .tree-foliage {
  background: #1a2a1a !important;
  box-shadow: 8px 0 0 #0d1a0d, 16px 4px 0 #0a150a !important;
  filter: brightness(0.4);
}

.tree-evening .tree-trunk,
.tree-night .tree-trunk {
  background: #3a2820;
  border-color: #2a1a15;
}

/* Birds */
.birds-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.bird {
  position: absolute;
  left: -30px;
  font-size: 14px;
  font-family: 'Fusion Pixel', monospace;
  animation: birdFly 8s linear forwards;
}

.bird-morning,
.bird-day {
  color: #2d2d2d;
  text-shadow: 1px 0 0 #1a1a1a;
}

.bird-evening {
  color: #4a3a2a;
  text-shadow: 1px 0 0 #2a2015;
}

/* Morning */
.time-morning {
  background: linear-gradient(180deg, #FFD4A0 0%, #FFECD2 40%, #FFF5E6 100%);
}

.pixel-sun {
  position: absolute;
  top: 8%;
  right: 15%;
  width: 40px;
  height: 40px;
  background: #FFD700;
  border: 3px solid #FFA500;
  border-radius: 2px;
  z-index: 1;
  image-rendering: pixelated;
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.6),
    6px 0 0 #FFA500,
    -6px 0 0 #FFA500,
    0 6px 0 #FFA500,
    0 -6px 0 #FFA500;
  animation: sunGlow 3s ease-in-out infinite;
}

/* Day */
.time-day {
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F0FF 100%);
}

.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  z-index: 1;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.85);
  image-rendering: pixelated;
  border-radius: 2px;
}

.cloud-1 {
  top: 12%;
  left: -10%;
  width: 60px;
  height: 20px;
  box-shadow:
    10px -8px 0 0 rgba(255,255,255,0.85),
    20px -4px 0 0 rgba(255,255,255,0.85),
    30px -8px 0 0 rgba(255,255,255,0.85);
  animation: cloudMove 30s linear infinite;
}

.cloud-2 {
  top: 22%;
  left: -5%;
  width: 48px;
  height: 16px;
  box-shadow:
    8px -6px 0 0 rgba(255,255,255,0.85),
    16px -3px 0 0 rgba(255,255,255,0.85),
    24px -6px 0 0 rgba(255,255,255,0.85);
  animation: cloudMove 40s linear infinite;
  animation-delay: -15s;
}

/* Evening */
.time-evening {
  background: linear-gradient(180deg, #C77DBA 0%, #FF9966 40%, #FFB88C 100%);
}

.sunset-glow {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 60px;
  background: radial-gradient(ellipse, rgba(255, 120, 50, 0.5), transparent);
  z-index: 1;
}

/* Night */
.time-night {
  background: linear-gradient(180deg, #0C1445 0%, #1A237E 40%, #283593 100%);
}

.stars {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 0;
  image-rendering: pixelated;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

@keyframes sunGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.6), 6px 0 0 #FFA500, -6px 0 0 #FFA500, 0 6px 0 #FFA500, 0 -6px 0 #FFA500; }
  50% { box-shadow: 0 0 30px rgba(255,215,0,0.9), 6px 0 0 #FFA500, -6px 0 0 #FFA500, 0 6px 0 #FFA500, 0 -6px 0 #FFA500; }
}

@keyframes cloudMove {
  from { transform: translateX(-100px); }
  to { transform: translateX(calc(100vw + 100px)); }
}

@keyframes rustle {
  0%, 100% { transform: translateX(0) scale(1); }
  25% { transform: translateX(1px) scale(1.02); }
  50% { transform: translateX(-1px) scale(0.98); }
  75% { transform: translateX(1px) scale(1.01); }
}

@keyframes birdFly {
  from { left: -30px; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  to { left: 100vw; opacity: 0; }
}

.bird-enter-active,
.bird-leave-active {
  transition: opacity 0.3s;
}
.bird-enter-from,
.bird-leave-to {
  opacity: 0;
}
</style>
