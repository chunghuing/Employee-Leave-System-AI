import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as leaveService from '../services/leaveService'
import type { LeaveBalance } from '../types'

export const useLeaveBalanceStore = defineStore('leaveBalance', () => {
  const balances = ref<LeaveBalance[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBalance() {
    loading.value = true
    error.value = null

    try {
      balances.value = await leaveService.getMyBalance()
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    balances,
    loading,
    error,
    fetchBalance,
  }
})
