import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as leaveService from '../services/leaveService'
import type { LeaveRequest } from '../types'

export const useLeaveRecordStore = defineStore('leaveRecord', () => {
  const records = ref<LeaveRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchKeyword = ref('')
  const leaveTypeFilter = ref('')

  const filteredRecords = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()

    return records.value
      .filter((record) =>
        keyword ? record.employeeName.toLowerCase().includes(keyword) : true,
      )
      .filter((record) =>
        leaveTypeFilter.value ? record.leaveTypeId === leaveTypeFilter.value : true,
      )
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
  })

  async function fetchAllRecords() {
    loading.value = true
    error.value = null

    try {
      records.value = await leaveService.getAllLeaveRequests()
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    records,
    loading,
    error,
    searchKeyword,
    leaveTypeFilter,
    filteredRecords,
    fetchAllRecords,
  }
})
