<template>
  <div class="home-page">
    <!-- 装饰性浮动食物 -->
    <div class="floating-decor" aria-hidden="true">
      <span class="float-item f1">🍜</span>
      <span class="float-item f2">🥟</span>
      <span class="float-item f3">🍲</span>
      <span class="float-item f4">🥢</span>
    </div>

    <!-- 顶栏：Logo + 标题 + 主题切换 -->
    <header class="top-bar">
      <div class="brand">
        <div class="brand-icon">🍳</div>
        <div class="brand-text">
          <h1 class="brand-title">今天<span class="highlight">吃什么</span>？</h1>
          <p class="brand-sub">{{ greeting }}，让我帮你决定</p>
        </div>
      </div>
      <ThemeToggle />
    </header>

    <!-- 中间滚动区：筛选条件 -->
    <main class="filter-area">
      <TagSelector title="菜系" icon="🏮" :options="filters.cuisines" v-model="selected.cuisine" />
      <TagSelector title="类型" icon="🍽️" :options="filters.types" v-model="selected.type" />
      <TagSelector title="口味" icon="👅" :options="filters.flavors" v-model="selected.flavor" />
      <TagSelector title="难度" icon="⭐" :options="filters.difficulties" v-model="selected.difficulty" :single="true" />
    </main>

    <!-- 底部固定：摘要 + 按钮 -->
    <footer class="bottom-bar">
      <div class="selection-summary" v-if="hasSelection">
        <span class="summary-label">已选：</span>
        <span class="summary-tags">{{ selectionText }}</span>
        <button class="clear-btn" @click="clearAll">清除</button>
      </div>
      <div class="action-btns">
        <button class="btn btn-primary" @click="goWithFilter" :disabled="loading">
          <span>🎲 就吃这个！</span>
        </button>
        <button class="btn btn-magic" @click="goRandom" :disabled="loading">
          <span>✨ 随缘</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TagSelector from '../components/TagSelector.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { getRandomDish, getFilters } from '../api/dishes.js'

const router = useRouter()
const loading = ref(false)

const filters = reactive({
  cuisines: ['川菜', '鲁菜', '粤菜', '苏菜', '浙菜', '闽菜', '湘菜', '徽菜'],
  types: ['热菜', '凉菜', '汤羹'],
  flavors: ['辣', '甜', '酸', '咸', '清淡'],
  difficulties: ['简单', '适中', '挑战']
})

const selected = reactive({
  cuisine: [],
  type: [],
  flavor: [],
  difficulty: []
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const hasSelection = computed(() => {
  return selected.cuisine.length || selected.type.length || selected.flavor.length || selected.difficulty.length
})

const selectionText = computed(() => {
  return [...selected.cuisine, ...selected.type, ...selected.flavor, ...selected.difficulty].join('、')
})

function clearAll() {
  selected.cuisine = []
  selected.type = []
  selected.flavor = []
  selected.difficulty = []
}

onMounted(async () => {
  try {
    const res = await getFilters()
    if (res.data) {
      Object.assign(filters, {
        cuisines: res.data.cuisines || filters.cuisines,
        types: res.data.types || filters.types,
        flavors: res.data.flavors || filters.flavors,
        difficulties: res.data.difficulties || filters.difficulties
      })
    }
  } catch (e) {
    // 使用默认值
  }
})

async function goWithFilter() {
  loading.value = true
  try {
    const res = await getRandomDish({
      cuisine: selected.cuisine,
      type: selected.type,
      flavor: selected.flavor,
      difficulty: selected.difficulty[0] || ''
    })
    if (res.data) {
      router.push({
        name: 'Result',
        query: {
          dishId: res.data.id,
          cuisine: selected.cuisine.join(','),
          type: selected.type.join(','),
          flavor: selected.flavor.join(','),
          difficulty: selected.difficulty[0] || ''
        }
      })
    } else {
      alert('没有找到符合条件的菜品，请调整筛选条件')
    }
  } catch (e) {
    alert('请求失败，请检查后端服务是否启动')
  } finally {
    loading.value = false
  }
}

async function goRandom() {
  loading.value = true
  try {
    const res = await getRandomDish({})
    if (res.data) {
      router.push({
        name: 'Result',
        query: { dishId: res.data.id, random: 'true' }
      })
    }
  } catch (e) {
    alert('请求失败，请检查后端服务是否启动')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home-page {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ========== 浮动装饰 ========== */
.floating-decor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.float-item {
  position: absolute;
  font-size: 24px;
  opacity: 0.06;
  animation: floatAround 20s ease-in-out infinite;
}
.f1 { top: 10%; left: 85%; animation-duration: 22s; }
.f2 { top: 35%; left: 5%; animation-delay: -3s; animation-duration: 18s; }
.f3 { top: 60%; left: 80%; animation-delay: -7s; animation-duration: 25s; }
.f4 { top: 80%; left: 15%; animation-delay: -11s; animation-duration: 20s; }

@keyframes floatAround {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(12px, -15px) rotate(8deg); }
  50% { transform: translate(-8px, 12px) rotate(-4deg); }
  75% { transform: translate(15px, 8px) rotate(6deg); }
}

/* ========== 顶栏 ========== */
.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 3px 12px rgba(255, 107, 53, 0.3);
  flex-shrink: 0;
}

.brand-title {
  font-size: 20px;
  font-weight: 900;
  color: var(--color-text);
  line-height: 1.2;
}

.brand-title .highlight {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-sub {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 1px;
}

/* ========== 筛选区（可滚动） ========== */
.filter-area {
  flex: 1;
  overflow-y: auto;
  padding: 4px 16px 8px;
  position: relative;
  z-index: 1;
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条但保持滚动功能 */
.filter-area::-webkit-scrollbar {
  display: none;
}
.filter-area {
  scrollbar-width: none;
}

/* ========== 底部固定区 ========== */
.bottom-bar {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  padding: 8px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.selection-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--color-primary-light);
  border-radius: var(--border-radius-sm);
  margin-bottom: 8px;
  animation: fadeSlideIn 0.3s ease;
}

.summary-label {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
  white-space: nowrap;
}

.summary-tags {
  font-size: 11px;
  color: var(--color-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear-btn {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  white-space: nowrap;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 按钮 ========== */
.action-btns {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 14px 12px;
  border-radius: var(--border-radius);
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all var(--transition-speed);
  position: relative;
  overflow: hidden;
}

.btn:active {
  transform: scale(0.96);
}

.btn:disabled {
  opacity: 0.6;
}

.btn-primary {
  flex: 1.5;
  background: linear-gradient(135deg, var(--color-primary), #ff8555);
  color: white;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.35);
}

.btn-magic {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.3);
}
</style>
