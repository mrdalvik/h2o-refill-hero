<template>
  <div
    class="drink-sprite"
    :class="[`drink-${size}`, `drink-type-${drinkType}`]"
    :title="$t('bottles.tooltip', { ml })"
  >
    <!-- Water: bottle with cap, neck, body -->
    <template v-if="drinkType === 'water'">
      <div class="bottle-cap"></div>
      <div class="bottle-neck"></div>
      <div class="bottle-body">
        <div class="bottle-label"></div>
        <div class="bottle-liquid"></div>
      </div>
    </template>
    <!-- Coffee: iron can -->
    <template v-else-if="drinkType === 'coffee'">
      <div class="can-top"></div>
      <div class="can-body can-metal"></div>
    </template>
    <!-- Tea: bottled tea -->
    <template v-else-if="drinkType === 'tea'">
      <div class="bottle-cap bottle-cap-tea"></div>
      <div class="bottle-neck bottle-neck-tea"></div>
      <div class="bottle-body bottle-body-tea">
        <div class="bottle-liquid bottle-liquid-tea"></div>
      </div>
    </template>
    <!-- Juice: tetrapak -->
    <template v-else-if="drinkType === 'juice'">
      <div class="tetrapak-body">
        <div class="tetrapak-spout"></div>
        <div class="tetrapak-liquid"></div>
      </div>
    </template>
    <!-- Soda: can -->
    <template v-else-if="drinkType === 'soda'">
      <div class="can-top can-top-soda"></div>
      <div class="can-body can-body-soda"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BottleSize, DrinkType } from '@/types'

defineProps<{
  size: BottleSize
  ml: number
  drinkType?: DrinkType
}>()
</script>

<style scoped>
.drink-sprite {
  display: flex;
  flex-direction: column;
  align-items: center;
  image-rendering: pixelated;
}

/* === WATER (default bottle) === */
.bottle-cap {
  background: #5b8cff;
  border: 2px solid #3a5fc8;
}
.bottle-neck {
  background: #c8e6ff;
  border-left: 2px solid #8bb8e8;
  border-right: 2px solid #8bb8e8;
}
.bottle-body {
  background: #c8e6ff;
  border: 2px solid #8bb8e8;
  border-radius: 0 0 2px 2px;
  position: relative;
  overflow: hidden;
}
.bottle-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #8bb8e8;
}
.bottle-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #6bb8ff, #3a8fd4);
}

/* === COFFEE (iron can) === */
.can-top {
  background: #4a4a4a;
  border: 2px solid #2a2a2a;
  border-radius: 2px 2px 0 0;
}
.can-body {
  border: 2px solid #3a3a3a;
  border-top: none;
  border-radius: 0 0 2px 2px;
  position: relative;
  overflow: hidden;
}
.can-metal {
  background: linear-gradient(90deg, #5a5a5a, #6a6a6a, #4a4a4a);
}

/* === TEA (bottled tea) === */
.bottle-cap-tea { background: #8b7355; border-color: #6b5344; }
.bottle-neck-tea { background: #d4c4a8; border-color: #a09070; }
.bottle-body-tea { background: #d4c4a8; border-color: #a09070; }
.bottle-liquid-tea {
  background: linear-gradient(180deg, #c4a060, #8b6914);
}

/* === JUICE (tetrapak) === */
.tetrapak-body {
  position: relative;
  background: #f5e6c8;
  border: 2px solid #c4a060;
  overflow: hidden;
}
.tetrapak-spout {
  position: absolute;
  top: -2px;
  right: 30%;
  width: 6px;
  height: 4px;
  background: #e8d4a8;
  border: 1px solid #c4a060;
  border-radius: 0 0 2px 2px;
}
.tetrapak-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #ffb347, #e67e22);
}

/* === SODA (can) === */
.can-top-soda {
  background: #c0c0c0;
  border-color: #909090;
}
.can-body-soda {
  background: linear-gradient(90deg, #e0e0e0, #f0f0f0, #d0d0d0);
  border-color: #a0a0a0;
}

/* === SIZES === */
.drink-small {
  width: 18px;
  height: 30px;
}
.drink-small .bottle-cap { width: 8px; height: 4px; }
.drink-small .bottle-neck { width: 6px; height: 4px; }
.drink-small .bottle-body { width: 14px; height: 18px; }
.drink-small .bottle-label { width: 8px; height: 4px; top: 4px; }
.drink-small .bottle-liquid { height: 10px; }
.drink-small .can-top { width: 12px; height: 3px; }
.drink-small .can-body { width: 12px; height: 23px; }
.drink-small .tetrapak-body { width: 10px; height: 26px; }
.drink-small .tetrapak-spout { right: 25%; width: 4px; height: 3px; }
.drink-small .tetrapak-liquid { height: 18px; }

.drink-medium {
  width: 22px;
  height: 40px;
}
.drink-medium .bottle-cap { width: 10px; height: 4px; }
.drink-medium .bottle-neck { width: 8px; height: 6px; }
.drink-medium .bottle-body { width: 18px; height: 24px; }
.drink-medium .bottle-label { width: 12px; height: 6px; top: 5px; }
.drink-medium .bottle-liquid { height: 14px; }
.drink-medium .can-top { width: 14px; height: 4px; }
.drink-medium .can-body { width: 14px; height: 32px; }
.drink-medium .tetrapak-body { width: 12px; height: 34px; }
.drink-medium .tetrapak-liquid { height: 26px; }

.drink-large {
  width: 26px;
  height: 50px;
}
.drink-large .bottle-cap { width: 12px; height: 5px; }
.drink-large .bottle-neck { width: 10px; height: 7px; }
.drink-large .bottle-body { width: 22px; height: 32px; }
.drink-large .bottle-label { width: 14px; height: 8px; top: 6px; }
.drink-large .bottle-liquid { height: 20px; }
.drink-large .can-top { width: 16px; height: 5px; }
.drink-large .can-body { width: 16px; height: 41px; }
.drink-large .tetrapak-body { width: 14px; height: 43px; }
.drink-large .tetrapak-liquid { height: 34px; }

@media (min-width: 769px) {
  .drink-small { width: 22px; height: 36px; }
  .drink-small .bottle-cap { width: 10px; height: 5px; }
  .drink-small .bottle-neck { width: 7px; height: 5px; }
  .drink-small .bottle-body { width: 17px; height: 22px; }
  .drink-small .bottle-label { width: 10px; height: 5px; top: 5px; }
  .drink-small .bottle-liquid { height: 12px; }
  .drink-small .can-top { width: 14px; height: 4px; }
  .drink-small .can-body { width: 14px; height: 28px; }
  .drink-small .tetrapak-body { width: 12px; height: 30px; }
  .drink-small .tetrapak-liquid { height: 22px; }

  .drink-medium { width: 26px; height: 48px; }
  .drink-medium .bottle-cap { width: 12px; height: 5px; }
  .drink-medium .bottle-neck { width: 10px; height: 7px; }
  .drink-medium .bottle-body { width: 22px; height: 30px; }
  .drink-medium .bottle-label { width: 14px; height: 7px; top: 6px; }
  .drink-medium .bottle-liquid { height: 18px; }
  .drink-medium .can-top { width: 16px; height: 5px; }
  .drink-medium .can-body { width: 16px; height: 39px; }
  .drink-medium .tetrapak-body { width: 14px; height: 41px; }
  .drink-medium .tetrapak-liquid { height: 30px; }

  .drink-large { width: 30px; height: 58px; }
  .drink-large .bottle-cap { width: 14px; height: 6px; }
  .drink-large .bottle-neck { width: 12px; height: 8px; }
  .drink-large .bottle-body { width: 26px; height: 38px; }
  .drink-large .bottle-label { width: 16px; height: 10px; top: 7px; }
  .drink-large .bottle-liquid { height: 24px; }
  .drink-large .can-top { width: 18px; height: 6px; }
  .drink-large .can-body { width: 18px; height: 48px; }
  .drink-large .tetrapak-body { width: 16px; height: 50px; }
  .drink-large .tetrapak-liquid { height: 40px; }
}
</style>
