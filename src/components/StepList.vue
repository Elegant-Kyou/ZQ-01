<template>
  <div class="step-list">
    <div class="section-header">做法步骤</div>
    <div class="steps">
      <div v-for="(step, index) in steps" :key="index" class="step-item">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-text">{{ step }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: Array
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

.steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  margin-top: 1px;
}

.step-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
}
</style>
