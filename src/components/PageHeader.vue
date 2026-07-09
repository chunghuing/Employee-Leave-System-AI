<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="page-header">
    <h1 class="page-header__title">{{ title }}</h1>
    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-header__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
</style>
