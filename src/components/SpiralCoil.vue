<template>
  <div class="spiral-coil" :class="{ 'spiral-rotating': isRotating }">
    <svg
      class="spiral-svg"
      viewBox="0 0 28 48"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path
        class="spiral-path"
        d="M6 2 C18 2 22 10 22 16
           C22 24 10 28 6 22
           C6 30 18 34 22 38
           C22 44 10 46 6 42"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isRotating?: boolean
}>()
</script>

<style scoped>
.spiral-coil {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 32px;
  z-index: 2;
  pointer-events: none;
  image-rendering: pixelated;
}

.spiral-svg {
  width: 100%;
  height: 100%;
  transform-origin: center center;
  filter:
    drop-shadow(0 1px 0 #4a3828)
    drop-shadow(0 2px 0 #3d2a22)
    drop-shadow(1px 0 0 #a08060);
}

.spiral-path {
  stroke: #8b7355;
  stroke-width: 2.5;
}

.spiral-coil.spiral-rotating .spiral-svg {
  animation: spiralRotate 0.6s ease-out;
}

@keyframes spiralRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
}

@media (min-width: 769px) {
  .spiral-coil {
    width: 24px;
    height: 38px;
  }
}
</style>
