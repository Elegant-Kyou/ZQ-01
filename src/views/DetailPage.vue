<template>
  <div class="detail-page">
    <header class="header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <ThemeToggle />
    </header>

    <div v-if="dish" class="content">
      <!-- 图片 -->
      <div class="dish-image">
        <div class="img-placeholder">
          <span class="placeholder-emoji">🍽️</span>
          <span class="placeholder-name">{{ dish.name }}</span>
        </div>
        <img v-if="!imgErr" :src="dish.imageUrl" :alt="dish.name" @error="onImgErr" @load="imgLoaded = true" :class="{ loaded: imgLoaded }" />
      </div>

      <!-- 基本信息 -->
      <div class="dish-header">
        <h1 class="dish-name">{{ dish.name }}</h1>
        <div class="dish-meta">
          <span class="tag">{{ dish.cuisine }}</span>
          <span class="tag">{{ dish.type }}</span>
          <span class="tag">{{ dish.difficulty }}</span>
          <span class="time">⏰ {{ dish.cookingTime }}分钟</span>
        </div>
      </div>

      <!-- 食材清单 -->
      <section class="section" v-if="dish.ingredients">
        <div class="section-header">食材清单</div>
        <div class="ingredient-group" v-if="dish.ingredients.main && dish.ingredients.main.length">
          <div class="group-label">主料</div>
          <div class="ingredient-list">
            <div v-for="i in dish.ingredients.main" :key="i.name" class="ingredient-item">
              <span>{{ i.name }}</span><span class="amount">{{ i.amount }}</span>
            </div>
          </div>
        </div>
        <div class="ingredient-group" v-if="dish.ingredients.side && dish.ingredients.side.length">
          <div class="group-label">配料</div>
          <div class="ingredient-list">
            <div v-for="i in dish.ingredients.side" :key="i.name" class="ingredient-item">
              <span>{{ i.name }}</span><span class="amount">{{ i.amount }}</span>
            </div>
          </div>
        </div>
        <div class="ingredient-group" v-if="dish.ingredients.seasoning && dish.ingredients.seasoning.length">
          <div class="group-label">调料</div>
          <div class="ingredient-list">
            <div v-for="i in dish.ingredients.seasoning" :key="i.name" class="ingredient-item">
              <span>{{ i.name }}</span><span class="amount">{{ i.amount }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 做法步骤 -->
      <section class="section">
        <StepList :steps="dish.steps" />
      </section>

      <!-- 推荐搭配 -->
      <section class="section">
        <PairingSection :pairings="dish.pairings" @navigate="goToDish" />
      </section>

      <!-- 收藏 -->
      <button class="fav-btn" :class="{ active: isFav }" @click="toggleFavorite(dish.id)">
        {{ isFav ? '❤️ 已收藏' : '🤍 收藏这道菜' }}
      </button>
    </div>

    <div v-else class="loading">
      <div class="spinner">🍳</div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from '../components/ThemeToggle.vue'
import StepList from '../components/StepList.vue'
import PairingSection from '../components/PairingSection.vue'
import { getDishById } from '../api/dishes.js'
import { useFavorites } from '../composables/useFavorites.js'

const route = useRoute()
const router = useRouter()
const dish = ref(null)
const imgErr = ref(false)
const imgLoaded = ref(false)
const { isFavorite, toggleFavorite } = useFavorites()

const isFav = computed(() => dish.value ? isFavorite(dish.value.id) : false)

async function loadDish(id) {
  dish.value = null
  imgErr.value = false
  imgLoaded.value = false
  try {
    const res = await getDishById(id)
    dish.value = res.data
  } catch (e) {
    // error
  }
}

onMounted(() => loadDish(route.params.id))
watch(() => route.params.id, (newId) => { if (newId) loadDish(newId) })

function onImgErr() {
  imgErr.value = true
}

function goToDish(id) {
  if (id > 0) {
    router.push({ name: 'Detail', params: { id } })
  }
}
</script>

<style scoped>
.detail-page {
  padding: 20px;
  padding-bottom: 40px;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.back-btn {
  background: var(--color-bg-section);
  color: var(--color-text);
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  border: 1px solid var(--color-border);
}

.dish-image {
  width: 100%;
  height: 220px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: var(--color-bg-section);
  position: relative;
  margin-bottom: 16px;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dish-image img.loaded {
  opacity: 1;
}

.img-placeholder {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
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

.dish-header { margin-bottom: 20px; }

.dish-name {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.dish-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.time {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.section {
  margin-bottom: 24px;
}

.section-header {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
  padding-left: 10px;
  border-left: 3px solid var(--color-primary);
}

.ingredient-group {
  margin-bottom: 12px;
}

.group-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  border-radius: var(--border-radius-sm);
  background: var(--color-bg-section);
  font-size: 14px;
}

.amount {
  color: var(--color-text-secondary);
}

.fav-btn {
  width: 100%;
  padding: 14px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  background: var(--color-bg-section);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all var(--transition-speed);
  margin-top: 8px;
}

.fav-btn.active {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

.fav-btn:active { transform: scale(0.97); }

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120px;
  gap: 12px;
}

.spinner {
  font-size: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading p { color: var(--color-text-secondary); }
</style>
