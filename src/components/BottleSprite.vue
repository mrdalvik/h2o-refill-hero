<template>
  <div class="bottle-sprite" :class="`bottle-${size}`" :title="`${ml} мл`">
    <div class="bottle-cap"></div>
    <div class="bottle-neck"></div>
    <div class="bottle-body">
      <div class="bottle-label"></div>
      <div class="bottle-water"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BottleSize } from '@/types'

defineProps<{
  size: BottleSize
  ml: number
}>()
</script>

<style scoped>
.bottle-sprite {
  display: flex;
  flex-direction: column;
  align-items: center;
  image-rendering: pixelated;
}

.bottle-cap {
  background: #5b8cff;
  border: 2px solid #3a5fc8;
  image-rendering: pixelated;
}

.bottle-neck {
  background: #c8e6ff;
  border-left: 2px solid #8bb8e8;
  border-right: 2px solid #8bb8e8;
  image-rendering: pixelated;
}

.bottle-body {
  background: #c8e6ff;
  border: 2px solid #8bb8e8;
  border-radius: 0 0 2px 2px;
  position: relative;
  overflow: hidden;
  image-rendering: pixelated;
}

.bottle-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #8bb8e8;
  image-rendering: pixelated;
}

.bottle-water {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #6bb8ff, #3a8fd4);
  image-rendering: pixelated;
}

/* Small bottle: up to 200ml */
.bottle-small {
  width: 18px;
  height: 30px;
}
.bottle-small .bottle-cap {
  width: 8px;
  height: 4px;
}
.bottle-small .bottle-neck {
  width: 6px;
  height: 4px;
}
.bottle-small .bottle-body {
  width: 14px;
  height: 18px;
}
.bottle-small .bottle-label {
  width: 8px;
  height: 4px;
  top: 4px;
}
.bottle-small .bottle-water {
  height: 10px;
}

/* Medium bottle: 201-500ml */
.bottle-medium {
  width: 22px;
  height: 40px;
}
.bottle-medium .bottle-cap {
  width: 10px;
  height: 4px;
}
.bottle-medium .bottle-neck {
  width: 8px;
  height: 6px;
}
.bottle-medium .bottle-body {
  width: 18px;
  height: 24px;
}
.bottle-medium .bottle-label {
  width: 12px;
  height: 6px;
  top: 5px;
}
.bottle-medium .bottle-water {
  height: 14px;
}

/* Large bottle: 501-1000ml */
.bottle-large {
  width: 26px;
  height: 50px;
}
.bottle-large .bottle-cap {
  width: 12px;
  height: 5px;
}
.bottle-large .bottle-neck {
  width: 10px;
  height: 7px;
}
.bottle-large .bottle-body {
  width: 22px;
  height: 32px;
}
.bottle-large .bottle-label {
  width: 14px;
  height: 8px;
  top: 6px;
}
.bottle-large .bottle-water {
  height: 20px;
}

/* Scale bottles on larger screens */
@media (min-width: 769px) {
  .bottle-small {
    width: 22px;
    height: 36px;
  }
  .bottle-small .bottle-cap { width: 10px; height: 5px; }
  .bottle-small .bottle-neck { width: 7px; height: 5px; }
  .bottle-small .bottle-body { width: 17px; height: 22px; }
  .bottle-small .bottle-label { width: 10px; height: 5px; top: 5px; }
  .bottle-small .bottle-water { height: 12px; }

  .bottle-medium {
    width: 26px;
    height: 48px;
  }
  .bottle-medium .bottle-cap { width: 12px; height: 5px; }
  .bottle-medium .bottle-neck { width: 10px; height: 7px; }
  .bottle-medium .bottle-body { width: 22px; height: 30px; }
  .bottle-medium .bottle-label { width: 14px; height: 7px; top: 6px; }
  .bottle-medium .bottle-water { height: 18px; }

  .bottle-large {
    width: 30px;
    height: 58px;
  }
  .bottle-large .bottle-cap { width: 14px; height: 6px; }
  .bottle-large .bottle-neck { width: 12px; height: 8px; }
  .bottle-large .bottle-body { width: 26px; height: 38px; }
  .bottle-large .bottle-label { width: 16px; height: 10px; top: 7px; }
  .bottle-large .bottle-water { height: 24px; }
}
</style>
