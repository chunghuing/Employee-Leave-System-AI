import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as leaveService from '../services/leaveService'
import type { CreateLeaveRequestPayload, LeaveRequest } from '../types'

export const useLeaveRequestStore = defineStore('leaveRequest', () => {
  const requests = ref<LeaveRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const submitting = ref(false)

  const sortedRequests = computed(() =>
    [...requests.value].sort((a, b) => b.startDate.localeCompare(a.startDate)),
  )

  async function fetchMyRequests() {
    loading.value = true
    error.value = null

    try {
      requests.value = await leaveService.getMyLeaveRequests()
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  async function submitRequest(payload: CreateLeaveRequestPayload) {
    submitting.value = true
    error.value = null

    try {
      const newRequest = await leaveService.createLeaveRequest(payload)
      requests.value.push(newRequest)
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  return {
    requests,
    loading,
    error,
    submitting,
    sortedRequests,
    fetchMyRequests,
    submitRequest,
  }
})
