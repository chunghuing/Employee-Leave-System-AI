import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as leaveTypeService from '../services/leaveTypeService'
import type { LeaveType } from '../types'

export const useLeaveTypeStore = defineStore('leaveType', () => {
  const leaveTypes = ref<LeaveType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLeaveTypes() {
    loading.value = true
    error.value = null

    try {
      leaveTypes.value = await leaveTypeService.getLeaveTypes()
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    leaveTypes,
    loading,
    error,
    fetchLeaveTypes,
  }
})
