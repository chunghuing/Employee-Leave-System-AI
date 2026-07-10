<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '../../../components/PageHeader.vue'
import { useLeaveBalanceStore } from '../../../stores/leaveBalance.store'

const leaveBalanceStore = useLeaveBalanceStore()

onMounted(() => {
  void leaveBalanceStore.fetchBalance()
})
</script>

<template>
  <div>
    <PageHeader title="剩餘假期" />
    <el-alert
      v-if="leaveBalanceStore.error"
      :title="leaveBalanceStore.error"
      type="error"
      show-icon
      :closable="false"
      class="leave-balance-view__error"
    />
    <el-row v-loading="leaveBalanceStore.loading" :gutter="16">
      <el-col
        v-for="balance in leaveBalanceStore.balances"
        :key="balance.leaveTypeId"
        :span="8"
      >
        <el-card class="leave-balance-view__card" shadow="hover">
          <div class="leave-balance-view__type">{{ balance.leaveTypeName }}</div>
          <div class="leave-balance-view__remaining">
            {{ balance.remainingDays }}<span class="leave-balance-view__unit">天</span>
          </div>
          <div class="leave-balance-view__total">總天數：{{ balance.totalDays }} 天</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.leave-balance-view__error {
  margin-bottom: 16px;
}

.leave-balance-view__card {
  margin-bottom: 16px;
  text-align: center;
}

.leave-balance-view__type {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.leave-balance-view__remaining {
  margin: 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.leave-balance-view__unit {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 400;
}

.leave-balance-view__total {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
