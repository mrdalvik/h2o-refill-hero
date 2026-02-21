<template>
  <div class="day-background detailed" :class="`time-${timeOfDay}`">
    <div class="sky-layer"></div>
    <div v-if="timeOfDay === 'night'" class="stars">
      <div v-for="n in 45" :key="n" class="star" :class="`star-${starSize(n)}`" :style="starStyle(n)"></div>
    </div>
    <div v-if="timeOfDay === 'morning'" class="sun pixel-sun-detailed"></div>
    <div v-if="timeOfDay === 'day'" class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>
    <div v-if="timeOfDay === 'evening'" class="sunset-detailed">
      <div class="sunset-sun"></div>
      <div class="sunset-stripes"></div>
    </div>

    <div class="tree" :class="`tree-${timeOfDay}`">
      <div class="tree-trunk">
        <div class="trunk-bark"></div>
      </div>
      <div class="tree-foliage foliage-1"></div>
      <div class="tree-foliage foliage-2"></div>
      <div class="tree-foliage foliage-3"></div>
      <div class="tree-foliage foliage-4"></div>
    </div>

    <TransitionGroup v-if="showBirds" name="bird" tag="div" class="birds-layer">
      <div
        v-for="bird in birds"
        :key="bird.id"
        class="bird"
        :class="[`bird-${timeOfDay}`, `bird-${bird.type}`]"
        :style="birdStyle(bird)"
      >
        {{ bird.char }}
      </div>
    </TransitionGroup>

    <div class="ground" :class="`ground-${timeOfDay}`">
      <div class="ground-border"></div>
    </div>

    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimeOfDay } from '@/composables/useTimeOfDay'
const timeOfDay = useTimeOfDay()

const birds = ref<{ id: number; char: string; top: number; delay: number; type: number }[]>([])
let birdId = 0
let birdInterval: ReturnType<typeof setInterval> | null = null

const showBirds = computed(() => timeOfDay.value !== 'night')

function starSize(n: number) {
  return (n % 3) + 1
}

function starStyle(n: number) {
  const seed = n * 7919
  const x = ((seed * 13) % 97)
  const y = ((seed * 17) % 43)
  const delay = (n % 5) * 0.7
  const color = n % 3 === 0 ? 'warm' : n % 3 === 1 ? 'cool' : 'white'
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    '--star-color': color === 'warm' ? '#fffef0' : color === 'cool' ? '#e8e8ff' : '#f8f8ff',
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
    type: (id % 3) + 1,
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
.day-background.detailed {
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
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

/* Stepped sky gradients - Stardew style */
.time-morning .sky-layer {
  background:
    linear-gradient(180deg, #FFD4A0 0%, #FFD4A0 32px, #FFE4B5 32px, #FFE4B5 64px, #FFF8DC 64px, #FFF8DC 96px, #FFEFD5 96px, #FFEFD5 100%);
}

.time-day .sky-layer {
  background:
    linear-gradient(180deg, #87CEEB 0%, #87CEEB 32px, #B0E0E6 32px, #B0E0E6 64px, #E0F7FA 64px, #E0F7FA 96px, #ADD8E6 96px, #ADD8E6 100%);
}

.time-evening .sky-layer {
  background:
    linear-gradient(180deg, #C77DBA 0%, #C77DBA 32px, #E8A0BF 32px, #E8A0BF 64px, #FFB88C 64px, #FFB88C 96px, #FFA07A 96px, #FFA07A 100%);
}

.time-night .sky-layer {
  background:
    linear-gradient(180deg, #0C1445 0%, #0C1445 32px, #1A237E 32px, #1A237E 64px, #2C3E7A 64px, #2C3E7A 96px, #1a1a3e 96px, #1a1a3e 100%);
}

/* Ground - detailed tiles */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 5;
  image-rendering: pixelated;
}

.ground-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
}

.ground-morning {
  background-color: #4a4a4a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 7px, #3a3a3a 7px, #3a3a3a 8px),
    linear-gradient(0deg, transparent 0, transparent 7px, #3a3a3a 7px, #3a3a3a 8px),
    linear-gradient(90deg, #4a4a4a 0%, #454545 50%, #4a4a4a 100%);
  background-size: 16px 16px, 16px 16px, 16px 16px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.25);
}

.ground-day {
  background-color: #5a5a5a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 7px, #4a4a4a 7px, #4a4a4a 8px),
    linear-gradient(0deg, transparent 0, transparent 7px, #4a4a4a 7px, #4a4a4a 8px),
    linear-gradient(90deg, #5a5a5a 0%, #555555 50%, #5a5a5a 100%);
  background-size: 16px 16px, 16px 16px, 16px 16px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.2);
}

.ground-evening {
  background-color: #4a3a3a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 7px, #3a2a2a 7px, #3a2a2a 8px),
    linear-gradient(0deg, transparent 0, transparent 7px, #3a2a2a 7px, #3a2a2a 8px);
  background-size: 16px 16px, 16px 16px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.3);
}

.ground-night {
  background-color: #1a1a1a;
  background-image:
    linear-gradient(90deg, transparent 0, transparent 7px, #0d0d0d 7px, #0d0d0d 8px),
    linear-gradient(0deg, transparent 0, transparent 7px, #0d0d0d 7px, #0d0d0d 8px),
    linear-gradient(90deg, #1a1a1a 0%, #252530 50%, #1a1a1a 100%);
  background-size: 16px 16px, 16px 16px, 16px 16px;
  box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.5);
}

/* Tree - Stardew detailed */
.tree {
  position: absolute;
  left: 3%;
  bottom: 120px;
  z-index: 3;
  image-rendering: pixelated;
}

.tree-trunk {
  width: 28px;
  height: 88px;
  background: linear-gradient(90deg, #4a3328 0%, #5c4033 30%, #4a3328 70%, #3d2a22 100%);
  border: 2px solid #2d1f18;
  margin-left: 14px;
  border-radius: 3px;
  position: relative;
  box-shadow: 2px 0 0 rgba(0, 0, 0, 0.2);
}

.trunk-bark {
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  background: repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
}

.tree-foliage {
  position: absolute;
  bottom: 72px;
  left: 0;
  border-radius: 6px;
  animation: rustle 3s ease-in-out infinite;
}

.foliage-1 {
  width: 88px;
  height: 72px;
  background: #228b22;
  box-shadow:
    14px 0 0 #2d9d2d,
    28px 8px 0 #1a6b1a,
    0 2px 0 rgba(0, 0, 0, 0.15);
  animation-delay: 0s;
}

.foliage-2 {
  left: 22px;
  bottom: 96px;
  width: 72px;
  height: 64px;
  background: #2d9d2d;
  box-shadow:
    12px 0 0 #228b22,
    24px 4px 0 #1a6b1a,
    0 2px 0 rgba(0, 0, 0, 0.12);
  animation-delay: 0.5s;
}

.foliage-3 {
  left: 8px;
  bottom: 120px;
  width: 64px;
  height: 56px;
  background: #1a6b1a;
  box-shadow:
    12px 0 0 #228b22,
    0 2px 0 rgba(0, 0, 0, 0.1);
  animation-delay: 1s;
}

.foliage-4 {
  left: 16px;
  bottom: 108px;
  width: 56px;
  height: 48px;
  background: #3cb371;
  box-shadow: 8px 0 0 #2d9d2d;
  animation-delay: 0.25s;
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
  background: linear-gradient(90deg, #2a1a15 0%, #3a2820 100%);
  border-color: #1a1008;
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

.bird-1 { font-size: 12px; }
.bird-2 { font-size: 14px; }
.bird-3 { font-size: 16px; }

.bird-morning,
.bird-day {
  color: #2d2d2d;
  text-shadow: 1px 0 0 #1a1a1a, 0 1px 0 rgba(0,0,0,0.2);
}

.bird-evening {
  color: #4a3a2a;
  text-shadow: 1px 0 0 #2a2015;
}

/* Morning sun - pixel rays */
.pixel-sun-detailed {
  position: absolute;
  top: 8%;
  right: 15%;
  width: 40px;
  height: 40px;
  z-index: 1;
  image-rendering: pixelated;
}

.pixel-sun-detailed::before {
  content: '';
  position: absolute;
  inset: -4px;
  background:
    linear-gradient(0deg, #FFA500 0, #FFA500 4px, transparent 4px) 50% 0 / 4px 8px repeat-x,
    linear-gradient(90deg, #FFA500 0, #FFA500 4px, transparent 4px) 0 50% / 8px 4px repeat-y,
    linear-gradient(45deg, #FFA500 0, #FFA500 4px, transparent 4px) 0 0 / 6px 6px repeat,
    linear-gradient(-45deg, #FFA500 0, #FFA500 4px, transparent 4px) 0 0 / 6px 6px repeat;
  opacity: 0.8;
}

.pixel-sun-detailed::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  border: 2px solid #FF8C00;
  border-radius: 2px;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
  animation: sunGlow 3s ease-in-out infinite;
}

@keyframes sunGlow {
  0%, 100% { box-shadow: 0 0 16px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 24px rgba(255, 215, 0, 0.8); }
}

/* Day clouds - fluffier */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 35%;
  z-index: 1;
  overflow: hidden;
}

.cloud {
  position: absolute;
  image-rendering: pixelated;
  border-radius: 2px;
}

.cloud-1 {
  top: 10%;
  left: -10%;
  width: 64px;
  height: 24px;
  background: #f8f8ff;
  box-shadow:
    8px -10px 0 0 #f0f0ff,
    16px -6px 0 0 #ffffff,
    24px -10px 0 0 #e8f0f8,
    32px -4px 0 0 #f8f8ff,
    0 2px 0 rgba(0, 0, 0, 0.05);
  animation: cloudMove 30s linear infinite;
}

.cloud-2 {
  top: 20%;
  left: -5%;
  width: 48px;
  height: 18px;
  background: #e8f0f8;
  box-shadow:
    6px -8px 0 0 #f0f0ff,
    14px -4px 0 0 #ffffff,
    22px -8px 0 0 #d8e8f0,
    0 2px 0 rgba(0, 0, 0, 0.05);
  animation: cloudMove 40s linear infinite;
  animation-delay: -15s;
}

.cloud-3 {
  top: 28%;
  left: 20%;
  width: 40px;
  height: 14px;
  background: #ffffff;
  box-shadow:
    6px -6px 0 0 #f8f8ff,
    12px -3px 0 0 #e8f0f8,
    0 1px 0 rgba(0, 0, 0, 0.05);
  animation: cloudMove 35s linear infinite;
  animation-delay: -25s;
}

/* Evening sunset */
.sunset-detailed {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1;
  pointer-events: none;
}

.sunset-sun {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 24px;
  background: linear-gradient(180deg, #FF8C00 0%, #FF6347 50%, #DC143C 100%);
  border-radius: 24px 24px 0 0;
  box-shadow:
    0 0 20px rgba(255, 140, 0, 0.6),
    0 -2px 0 #FFA500;
}

.sunset-stripes {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background:
    linear-gradient(180deg, transparent 0, rgba(255, 120, 50, 0.3) 24px, rgba(255, 100, 80, 0.2) 48px, transparent 72px);
}

/* Night stars - stepped twinkle */
.stars {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.star {
  position: absolute;
  border-radius: 0;
  image-rendering: pixelated;
  background: var(--star-color, #f8f8ff);
  animation: twinkleStep 2.5s ease-in-out infinite;
}

.star-1 {
  width: 2px;
  height: 2px;
}

.star-2 {
  width: 3px;
  height: 3px;
}

.star-3 {
  width: 4px;
  height: 4px;
}

@keyframes twinkleStep {
  0%, 100% { opacity: 1; }
  25% { opacity: 0.6; }
  50% { opacity: 0.3; }
  75% { opacity: 0.7; }
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
