<template>
  <div class="tag-selector">
    <div class="section-header">
      <span class="section-icon" v-if="icon">{{ icon }}</span>
      <span class="section-title">{{ title }}</span>
      <span class="section-count" v-if="modelValue.length">{{ modelValue.length }}</span>
    </div>
    <div class="tags">
      <button
        v-for="option in options"
        :key="option"
        :class="['tag', { active: isSelected(option) }]"
        @click="toggle(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  icon: { type: String, default: '' },
  options: Array,
  modelValue: Array,
  single: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

function isSelected(option) {
  return props.modelValue.includes(option)
}

function toggle(option) {
  let newVal
  if (props.single) {
    newVal = isSelected(option) ? [] : [option]
  } else {
    if (isSelected(option)) {
      newVal = props.modelValue.filter(v => v !== option)
    } else {
      newVal = [...props.modelValue, option]
    }
  }
  emit('update:modelValue', newVal)
}
</script>

<style scoped>
.tag-selector {
  margin-bottom: 10px;
  padding: 10px 14px;
  background: var(--color-bg-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.section-icon {
  font-size: 14px;
  line-height: 1;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
}

.section-count {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 5px 14px;
  border-radius: 16px;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid transparent;
}

.tag:active {
  transform: scale(0.93);
}

.tag.active {
  background: linear-gradient(135deg, var(--color-primary), #ff8555);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(255, 107, 53, 0.3);
  font-weight: 600;
}
</style>
