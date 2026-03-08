<template>
  <div class="result-page">
    <header class="header">
      <button class="back-btn" @click="$router.push('/')">← 返回</button>
      <ThemeToggle />
    </header>

    <div v-if="dish" class="content">
      <DishCard :dish="dish" :flipping="flipping" @viewDetail="goDetail" />

      <div class="actions">
        <button class="btn btn-detail" @click="goDetail">
          📖 查看做法 →
        </button>
        <button class="btn btn-change" @click="changeDish" :disabled="loading">
          🔄 吃点别的
        </button>
        <button class="btn btn-home" @click="$router.push('/')">
          🏠 重新选择
        </button>
      </div>
    </div>

    <div v-else-if="loading" class="loading">
      <div class="spinner">🍳</div>
      <p>正在挑选...</p>
    </div>

    <div v-else class="empty">
      <div class="empty-icon">😅</div>
      <p>没有找到符合条件的菜品</p>
      <button class="btn btn-home" @click="$router.push('/')">重新选择条件</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DishCard from '../components/DishCard.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { getRandomDish, getDishById } from '../api/dishes.js'

const route = useRoute()
const router = useRouter()
const dish = ref(null)
const loading = ref(false)
const flipping = ref(false)

const queryParams = {
  cuisine: route.query.cuisine ? route.query.cuisine.split(',').filter(Boolean) : [],
  type: route.query.type ? route.query.type.split(',').filter(Boolean) : [],
  flavor: route.query.flavor ? route.query.flavor.split(',').filter(Boolean) : [],
  difficulty: route.query.difficulty || ''
}
const isRandom = route.query.random === 'true'

onMounted(async () => {
  const dishId = route.query.dishId
  if (dishId) {
    loading.value = true
    try {
      const res = await getDishById(dishId)
      dish.value = res.data
    } catch (e) {
      // fallback
    } finally {
      loading.value = false
    }
  }
})

async function changeDish() {
  loading.value = true
  flipping.value = true
  try {
    const params = isRandom ? {} : queryParams
    const res = await getRandomDish(params)
    if (res.data) {
      setTimeout(() => {
        dish.value = res.data
        flipping.value = false
      }, 250)
    } else {
      flipping.value = false
      alert('没有更多符合条件的菜品了')
    }
  } catch (e) {
    flipping.value = false
    alert('请求失败')
  } finally {
    loading.value = false
  }
}

function goDetail() {
  if (dish.value) {
    router.push({ name: 'Detail', params: { id: dish.value.id } })
  }
}
</script>

<style scoped>
.result-page {
  padding: 20px;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  background: var(--color-bg-section);
  color: var(--color-text);
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  border: 1px solid var(--color-border);
}

.actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  width: 100%;
  padding: 14px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--transition-speed);
}

.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.6; }

.btn-detail {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 3px 12px rgba(255,107,53,0.3);
}

.btn-change {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 3px 12px rgba(102,126,234,0.3);
}

.btn-home {
  background: var(--color-bg-section);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.loading, .empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.empty-icon { font-size: 60px; }
.empty p, .loading p { color: var(--color-text-secondary); font-size: 16px; }
</style>
