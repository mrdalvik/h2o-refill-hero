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
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimeOfDay } from '@/composables/useTimeOfDay'

const timeOfDay = useTimeOfDay()

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
  justify-content: center;
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
</style>
