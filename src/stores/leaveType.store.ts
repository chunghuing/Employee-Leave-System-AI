import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as leaveTypeService from '../services/leaveTypeService'
import type { CreateLeaveTypePayload, LeaveType, UpdateLeaveTypePayload } from '../types'

export const useLeaveTypeStore = defineStore('leaveType', () => {
  const leaveTypes = ref<LeaveType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const submitting = ref(false)
  const processingId = ref<string | null>(null)

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

  async function createLeaveType(payload: CreateLeaveTypePayload) {
    submitting.value = true
    error.value = null

    try {
      const newLeaveType = await leaveTypeService.createLeaveType(payload)
      leaveTypes.value.push(newLeaveType)
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function updateLeaveType(id: string, payload: UpdateLeaveTypePayload) {
    processingId.value = id
    error.value = null

    try {
      const updated = await leaveTypeService.updateLeaveType(id, payload)
      const index = leaveTypes.value.findIndex((leaveType) => leaveType.id === id)

      if (index !== -1) {
        leaveTypes.value[index] = updated
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      processingId.value = null
    }
  }

  async function deleteLeaveType(id: string) {
    processingId.value = id
    error.value = null

    try {
      await leaveTypeService.deleteLeaveType(id)
      leaveTypes.value = leaveTypes.value.filter((leaveType) => leaveType.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      processingId.value = null
    }
  }

  return {
    leaveTypes,
    loading,
    error,
    submitting,
    processingId,
    fetchLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
  }
})
