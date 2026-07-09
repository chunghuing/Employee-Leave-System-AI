<script setup lang="ts">
import { computed } from 'vue'
import type { LeaveStatus } from '../types'
import { LEAVE_STATUS_LABELS } from '../constants'

const props = defineProps<{
  status: LeaveStatus
}>()

const TAG_TYPE_BY_STATUS: Record<LeaveStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

const type = computed(() => TAG_TYPE_BY_STATUS[props.status])
const label = computed(() => LEAVE_STATUS_LABELS[props.status])
</script>

<template>
  <el-tag :type="type">{{ label }}</el-tag>
</template>
