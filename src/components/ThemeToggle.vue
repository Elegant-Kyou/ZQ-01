<template>
  <button class="theme-toggle" @click="toggleTheme" :title="theme === 'light' ? '切换暗色模式' : '切换亮色模式'">
    <span class="icon">{{ theme === 'light' ? '🌙' : '☀️' }}</span>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-bg-section);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-speed);
  border: 1px solid var(--color-border);
}

.theme-toggle:active {
  transform: scale(0.9);
}

.icon {
  font-size: 18px;
  line-height: 1;
}
</style>
