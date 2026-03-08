<template>
  <div class="dish-card" :class="{ flipping }" @click="$emit('viewDetail')">
    <div class="card-inner">
      <div class="card-image">
        <div class="image-placeholder">
          <span class="placeholder-emoji">🍽️</span>
          <span class="placeholder-name">{{ dish.name }}</span>
        </div>
        <img v-if="!imgError" :src="dish.imageUrl" :alt="dish.name" @error="onImageError" @load="imgLoaded = true" :class="{ loaded: imgLoaded }" />
      </div>
      <div class="card-info">
        <h2 class="dish-name">{{ dish.name }}</h2>
        <div class="dish-tags">
          <span class="tag cuisine">{{ dish.cuisine }}</span>
          <span class="tag type">{{ dish.type }}</span>
          <span class="tag difficulty">{{ dish.difficulty }}</span>
        </div>
        <div class="cooking-time">⏰ 约{{ dish.cookingTime }}分钟</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  dish: Object,
  flipping: { type: Boolean, default: false }
})

defineEmits(['viewDetail'])

const imgError = ref(false)
const imgLoaded = ref(false)

function onImageError() {
  imgError.value = true
}
</script>

<style scoped>
.dish-card {
  background: var(--color-bg-card);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 20px var(--color-shadow);
  transition: all var(--transition-speed);
  cursor: pointer;
}

.dish-card:active {
  transform: scale(0.98);
}

.dish-card.flipping {
  animation: flipCard 0.5s ease;
}

@keyframes flipCard {
  0% { transform: rotateY(0); }
  50% { transform: rotateY(90deg); opacity: 0.5; }
  100% { transform: rotateY(0); opacity: 1; }
}

.card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
  background: var(--color-bg-section);
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--color-bg-section);
}

.placeholder-emoji {
  font-size: 60px;
  line-height: 1;
}

.placeholder-name {
  font-size: 16px;
  color: var(--color-text-secondary);
  max-width: 80%;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-image img.loaded {
  opacity: 1;
}

.card-info {
  padding: 16px 20px 20px;
}

.dish-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--color-text);
}

.dish-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.cooking-time {
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
