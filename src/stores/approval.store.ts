import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as approvalService from '../services/approvalService'
import type { LeaveRequest } from '../types'

export const useApprovalStore = defineStore('approval', () => {
  const pendingRequests = ref<LeaveRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const processingId = ref<string | null>(null)

  async function fetchPendingApprovals() {
    loading.value = true
    error.value = null

    try {
      pendingRequests.value = await approvalService.getPendingApprovals()
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  async function approve(id: string) {
    processingId.value = id
    error.value = null

    try {
      await approvalService.approveLeaveRequest(id)
      pendingRequests.value = pendingRequests.value.filter((request) => request.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      processingId.value = null
    }
  }

  async function reject(id: string) {
    processingId.value = id
    error.value = null

    try {
      await approvalService.rejectLeaveRequest(id)
      pendingRequests.value = pendingRequests.value.filter((request) => request.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      processingId.value = null
    }
  }

  return {
    pendingRequests,
    loading,
    error,
    processingId,
    fetchPendingApprovals,
    approve,
    reject,
  }
})
