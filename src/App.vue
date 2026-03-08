<template>
  <div id="app-root" :data-theme="theme">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useTheme } from './composables/useTheme.js'

const { theme } = useTheme()
</script>

<style scoped>
#app-root {
  min-height: 100vh;
}
</style>
