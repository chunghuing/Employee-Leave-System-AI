<script setup lang="ts">
withDefaults(
  defineProps<{
    description?: string
  }>(),
  {
    description: '暫無資料',
  },
)
</script>

<template>
  <el-empty :description="description">
    <slot />
  </el-empty>
</template>
