<template>
  <div class="pairing-section" v-if="hasAnyPairing">
    <div class="section-header">推荐搭配</div>
    <div class="pairing-group" v-if="pairings.staple && pairings.staple.length">
      <div class="group-label">🍚 主食</div>
      <div class="pairing-items">
        <button
          v-for="item in pairings.staple"
          :key="'s' + item.id"
          class="pairing-chip"
          @click="item.id > 0 && $emit('navigate', item.id)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
    <div class="pairing-group" v-if="pairings.dishes && pairings.dishes.length">
      <div class="group-label">🥗 配菜</div>
      <div class="pairing-items">
        <button
          v-for="item in pairings.dishes"
          :key="'d' + item.id"
          class="pairing-chip clickable"
          @click="$emit('navigate', item.id)"
        >
          {{ item.name }} →
        </button>
      </div>
    </div>
    <div class="pairing-group" v-if="pairings.soup && pairings.soup.length">
      <div class="group-label">🍲 汤品</div>
      <div class="pairing-items">
        <button
          v-for="item in pairings.soup"
          :key="'soup' + item.id"
          class="pairing-chip clickable"
          @click="$emit('navigate', item.id)"
        >
          {{ item.name }} →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pairings: Object
})

defineEmits(['navigate'])

const hasAnyPairing = computed(() => {
  if (!props.pairings) return false
  return (props.pairings.staple?.length > 0) ||
         (props.pairings.dishes?.length > 0) ||
         (props.pairings.soup?.length > 0)
})
</script>

<style scoped>
.section-header {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 14px;
  padding-left: 10px;
  border-left: 3px solid var(--color-primary);
}

.pairing-group {
  margin-bottom: 12px;
}

.group-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.pairing-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pairing-chip {
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--color-bg-section);
  color: var(--color-text);
  font-size: 13px;
  border: 1px solid var(--color-border);
  transition: all var(--transition-speed);
}

.pairing-chip.clickable:active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
