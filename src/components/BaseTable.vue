<script setup lang="ts" generic="T extends Record<string, unknown>">
import EmptyState from './EmptyState.vue'

defineProps<{
  data: T[]
  loading?: boolean
}>()
</script>

<template>
  <el-table v-loading="loading" :data="data" style="width: 100%">
    <template #empty>
      <EmptyState />
    </template>
    <slot />
  </el-table>
</template>
