<template>
  <div
    class="drink-sprite"
    :class="[`drink-${size}`, `drink-type-${drinkType}`]"
    :title="$t('bottles.tooltip', { ml })"
  >
    <template v-if="drinkType === 'water'">
      <div class="bottle-cap"></div>
      <div class="bottle-neck"></div>
      <div class="bottle-body">
        <div class="bottle-label"></div>
        <div class="bottle-highlight"></div>
        <div class="bottle-liquid"></div>
        <div class="bottle-shadow"></div>
      </div>
    </template>
    <template v-else-if="drinkType === 'coffee'">
      <div class="can-top"></div>
      <div class="can-body can-metal">
        <div class="can-highlight"></div>
      </div>
    </template>
    <template v-else-if="drinkType === 'tea'">
      <div class="bottle-cap bottle-cap-tea"></div>
      <div class="bottle-neck bottle-neck-tea"></div>
      <div class="bottle-body bottle-body-tea">
        <div class="bottle-liquid bottle-liquid-tea"></div>
      </div>
    </template>
    <template v-else-if="drinkType === 'juice'">
      <div class="tetrapak-body">
        <div class="tetrapak-spout"></div>
        <div class="tetrapak-fold"></div>
        <div class="tetrapak-liquid"></div>
      </div>
    </template>
    <template v-else-if="drinkType === 'soda'">
      <div class="can-top can-top-soda"></div>
      <div class="can-body can-body-soda">
        <div class="can-stripe"></div>
        <div class="can-highlight"></div>
      </div>
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
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.25));
}

/* Water - Stardew style: 5-6 shades, highlight, shadow */
.bottle-cap {
  background: linear-gradient(180deg, #6b9aff 0%, #5b8cff 50%, #4a7ae8 100%);
  border: 1px solid #3a5fc8;
}
.bottle-neck {
  background: linear-gradient(90deg, #b8dcff 0%, #c8e6ff 50%, #a8d0f0 100%);
  border-left: 1px solid #7aa8e0;
  border-right: 1px solid #7aa8e0;
}
.bottle-body {
  background: #c8e6ff;
  border: 1px solid #8bb8e8;
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
.bottle-highlight {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 30%;
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
}
.bottle-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #5aa8f0 0%, #3a8fd4 50%, #2a7fc4 100%);
}
.bottle-shadow {
  position: absolute;
  bottom: 0;
  left: 1px;
  right: 1px;
  height: 4px;
  background: rgba(0, 0, 0, 0.2);
}

/* Coffee can */
.can-top {
  background: linear-gradient(180deg, #5a5a5a 0%, #4a4a4a 50%, #3a3a3a 100%);
  border: 1px solid #2a2a2a;
  border-radius: 2px 2px 0 0;
}
.can-body {
  border: 1px solid #3a3a3a;
  border-top: none;
  border-radius: 0 0 2px 2px;
  position: relative;
  overflow: hidden;
}
.can-metal {
  background: linear-gradient(90deg, #4a4a4a 0%, #6a6a6a 30%, #5a5a5a 70%, #3a3a3a 100%);
}
.can-highlight {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 30%;
  height: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 100%);
}

/* Tea */
.bottle-cap-tea { background: linear-gradient(180deg, #9b8365 0%, #8b7355 100%); border-color: #6b5344; }
.bottle-neck-tea { background: #d4c4a8; border-color: #a09070; }
.bottle-body-tea { background: #d4c4a8; border-color: #a09070; }
.bottle-liquid-tea {
  background: linear-gradient(180deg, #c4a060 0%, #8b6914 50%, #6b5010 100%);
}

/* Juice tetrapak */
.tetrapak-body {
  position: relative;
  background: linear-gradient(90deg, #f5e6c8 0%, #e8d8b8 100%);
  border: 1px solid #c4a060;
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
.tetrapak-fold {
  position: absolute;
  top: 4px;
  right: 2px;
  width: 2px;
  height: 60%;
  background: rgba(0,0,0,0.1);
}
.tetrapak-liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #ffb347 0%, #e67e22 50%, #c96a18 100%);
}

/* Soda can */
.can-top-soda {
  background: linear-gradient(180deg, #d0d0d0 0%, #c0c0c0 100%);
  border-color: #909090;
}
.can-body-soda {
  background: linear-gradient(90deg, #d8d8d8 0%, #f0f0f0 30%, #e8e8e8 70%, #d0d0d0 100%);
  border-color: #a0a0a0;
}
.can-stripe {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  height: 2px;
  background: #c0c0c0;
}

/* Sizes */
.drink-small { width: 18px; height: 30px; }
.drink-small .bottle-cap { width: 8px; height: 4px; }
.drink-small .bottle-neck { width: 6px; height: 4px; }
.drink-small .bottle-body { width: 14px; height: 18px; }
.drink-small .bottle-label { width: 8px; height: 4px; top: 4px; }
.drink-small .bottle-liquid { height: 10px; }
.drink-small .bottle-highlight { height: 4px; }
.drink-small .bottle-shadow { height: 2px; }
.drink-small .can-top { width: 12px; height: 3px; }
.drink-small .can-body { width: 12px; height: 23px; }
.drink-small .tetrapak-body { width: 10px; height: 26px; }
.drink-small .tetrapak-spout { right: 25%; width: 4px; height: 3px; }
.drink-small .tetrapak-liquid { height: 18px; }

.drink-medium { width: 22px; height: 40px; }
.drink-medium .bottle-cap { width: 10px; height: 4px; }
.drink-medium .bottle-neck { width: 8px; height: 6px; }
.drink-medium .bottle-body { width: 18px; height: 24px; }
.drink-medium .bottle-label { width: 12px; height: 6px; top: 5px; }
.drink-medium .bottle-liquid { height: 14px; }
.drink-medium .bottle-highlight { height: 6px; }
.drink-medium .bottle-shadow { height: 3px; }
.drink-medium .can-top { width: 14px; height: 4px; }
.drink-medium .can-body { width: 14px; height: 32px; }
.drink-medium .tetrapak-body { width: 12px; height: 34px; }
.drink-medium .tetrapak-liquid { height: 26px; }

.drink-large { width: 26px; height: 50px; }
.drink-large .bottle-cap { width: 12px; height: 5px; }
.drink-large .bottle-neck { width: 10px; height: 7px; }
.drink-large .bottle-body { width: 22px; height: 32px; }
.drink-large .bottle-label { width: 14px; height: 8px; top: 6px; }
.drink-large .bottle-liquid { height: 20px; }
.drink-large .bottle-highlight { height: 8px; }
.drink-large .bottle-shadow { height: 4px; }
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
  .drink-medium .bottle-liquid { height: 18px; }
  .drink-medium .can-top { width: 16px; height: 5px; }
  .drink-medium .can-body { width: 16px; height: 39px; }
  .drink-medium .tetrapak-body { width: 14px; height: 41px; }
  .drink-medium .tetrapak-liquid { height: 30px; }

  .drink-large { width: 30px; height: 58px; }
  .drink-large .bottle-cap { width: 14px; height: 6px; }
  .drink-large .bottle-neck { width: 12px; height: 8px; }
  .drink-large .bottle-body { width: 26px; height: 38px; }
  .drink-large .bottle-liquid { height: 24px; }
  .drink-large .can-top { width: 18px; height: 6px; }
  .drink-large .can-body { width: 18px; height: 48px; }
  .drink-large .tetrapak-body { width: 16px; height: 50px; }
  .drink-large .tetrapak-liquid { height: 40px; }
}
</style>
