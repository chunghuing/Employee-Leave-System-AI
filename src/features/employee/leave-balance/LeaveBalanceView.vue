<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Briefcase, FirstAidKit, Tickets } from '@element-plus/icons-vue'
import PageHeader from '../../../components/PageHeader.vue'
import LeaveRing from '../../../components/LeaveRing.vue'
import { useLeaveBalanceStore } from '../../../stores/leaveBalance.store'

const STAT_ICONS: Record<string, typeof Tickets> = {
  病假: FirstAidKit,
  事假: Briefcase,
}

function iconFor(leaveTypeName: string) {
  return STAT_ICONS[leaveTypeName] ?? Tickets
}

const leaveBalanceStore = useLeaveBalanceStore()

const heroBalance = computed(() => leaveBalanceStore.balances[0])
const restBalances = computed(() => leaveBalanceStore.balances.slice(1))

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
    <div v-loading="leaveBalanceStore.loading" class="leave-balance-view__row">
      <div v-if="heroBalance" class="leave-balance-view__hero">
        <LeaveRing
          :remaining="heroBalance.remainingDays"
          :total="heroBalance.totalDays"
          unit-label="天可用"
          :size="180"
        />
        <div class="leave-balance-view__hero-text">
          <span class="leave-balance-view__eyebrow">{{ heroBalance.leaveTypeName }}</span>
          <span class="leave-balance-view__headline">
            總額 {{ heroBalance.totalDays }} 天<br />已使用
            {{ heroBalance.totalDays - heroBalance.remainingDays }} 天
          </span>
        </div>
      </div>

      <div class="leave-balance-view__stats">
        <div
          v-for="balance in restBalances"
          :key="balance.leaveTypeId"
          class="leave-balance-view__stat-card"
        >
          <div class="leave-balance-view__stat-text">
            <span class="leave-balance-view__stat-label">{{ balance.leaveTypeName }}</span>
            <span class="leave-balance-view__stat-value"
              >剩 {{ balance.remainingDays }} / {{ balance.totalDays }} 天</span
            >
          </div>
          <div class="leave-balance-view__stat-chip">
            <el-icon :size="22" color="var(--teal)"
              ><component :is="iconFor(balance.leaveTypeName)"
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leave-balance-view__error {
  margin-bottom: 16px;
}

.leave-balance-view__row {
  display: flex;
  gap: 32px;
  align-items: stretch;
  flex-wrap: wrap;
}

.leave-balance-view__hero {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 32px;
  border-radius: var(--radius-card);
  background-color: var(--ink);
  width: 440px;
  max-width: 100%;
}

.leave-balance-view__hero-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leave-balance-view__eyebrow {
  font-size: 13px;
  color: var(--text-muted-inverse);
}

.leave-balance-view__headline {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-inverse);
}

.leave-balance-view__stats {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
}

.leave-balance-view__stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(28, 34, 55, 0.06);
}

.leave-balance-view__stat-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.leave-balance-view__stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.leave-balance-view__stat-value {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
}

.leave-balance-view__stat-chip {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background-color: var(--teal-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .leave-balance-view__row {
    flex-direction: column;
  }

  .leave-balance-view__hero {
    width: 100%;
    flex-direction: column;
    text-align: center;
  }
}
</style>
