<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, List } from '@element-plus/icons-vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import LeaveStatusTag from '../../../components/LeaveStatusTag.vue'
import type { LeaveStatus } from '../../../types'

interface PendingRequest {
  [key: string]: unknown
  id: string
  employeeName: string
  leaveTypeName: string
  startDate: string
  endDate: string
  days: number
  reason: string
}

const STATS: { label: string; value: number; icon: typeof List; color: string }[] = [
  { label: '待審核件數', value: 5, icon: List, color: 'var(--teal)' },
  { label: '本月已核准', value: 12, icon: CircleCheck, color: 'var(--moss)' },
  { label: '本月已拒絕', value: 2, icon: CircleClose, color: 'var(--coral)' },
]

const PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 'demo-1',
    employeeName: '林雅婷',
    leaveTypeName: '年假',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    days: 3,
    reason: '家庭旅遊',
  },
  {
    id: 'demo-2',
    employeeName: '張志偉',
    leaveTypeName: '病假',
    startDate: '2026-07-15',
    endDate: '2026-07-15',
    days: 1,
    reason: '感冒回診',
  },
  {
    id: 'demo-3',
    employeeName: '李思穎',
    leaveTypeName: '事假',
    startDate: '2026-07-18',
    endDate: '2026-07-19',
    days: 2,
    reason: '搬家整理',
  },
]

const PENDING_STATUS: LeaveStatus = 'pending'

function handleAction() {
  ElMessage.info('審核功能尚未串接，敬請期待後續開發')
}
</script>

<template>
  <div>
    <PageHeader title="待審核" />

    <div class="approval-view__stats">
      <div v-for="stat in STATS" :key="stat.label" class="approval-view__stat-card">
        <div class="approval-view__stat-text">
          <span class="approval-view__stat-label">{{ stat.label }}</span>
          <span class="approval-view__stat-value">{{ stat.value }}</span>
        </div>
        <div
          class="approval-view__stat-chip"
          :style="{ backgroundColor: `color-mix(in srgb, ${stat.color} 15%, white)` }"
        >
          <el-icon :size="22" :color="stat.color"><component :is="stat.icon" /></el-icon>
        </div>
      </div>
    </div>

    <div class="approval-view__desktop">
      <div class="approval-view__card">
        <BaseTable :data="PENDING_REQUESTS">
          <el-table-column label="員工" prop="employeeName" width="140" />
          <el-table-column label="假別" prop="leaveTypeName" width="110" />
          <el-table-column label="請假日期" width="220">
            <template #default="{ row }">{{ row.startDate }} ~ {{ row.endDate }}</template>
          </el-table-column>
          <el-table-column label="天數" prop="days" width="80" />
          <el-table-column label="原因" prop="reason" />
          <el-table-column label="操作" width="200">
            <template #default>
              <el-button size="small" type="primary" @click="handleAction">核准</el-button>
              <el-button size="small" @click="handleAction">拒絕</el-button>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>

    <div class="approval-view__mobile">
      <div v-for="request in PENDING_REQUESTS" :key="request.id" class="approval-view__mobile-card">
        <div class="approval-view__mobile-top">
          <span class="approval-view__mobile-name"
            >{{ request.employeeName }}．{{ request.leaveTypeName }}</span
          >
          <LeaveStatusTag :status="PENDING_STATUS" />
        </div>
        <p class="approval-view__mobile-date">
          {{ request.startDate }} ~ {{ request.endDate }}（{{ request.days }} 天）
        </p>
        <p class="approval-view__mobile-reason">{{ request.reason }}</p>
        <div class="approval-view__mobile-actions">
          <el-button type="primary" class="approval-view__mobile-btn" @click="handleAction"
            >核准</el-button
          >
          <el-button class="approval-view__mobile-btn" @click="handleAction">拒絕</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.approval-view__stats {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.approval-view__stat-card {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(28, 34, 55, 0.06);
}

.approval-view__stat-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.approval-view__stat-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.approval-view__stat-value {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 600;
  color: var(--text-primary);
}

.approval-view__stat-chip {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.approval-view__card {
  border-radius: var(--radius-card);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.approval-view__mobile {
  display: none;
}

.approval-view__mobile-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
}

.approval-view__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.approval-view__mobile-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.approval-view__mobile-date,
.approval-view__mobile-reason {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.approval-view__mobile-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.approval-view__mobile-btn {
  flex: 1;
}

@media (max-width: 767px) {
  .approval-view__desktop {
    display: none;
  }

  .approval-view__mobile {
    display: block;
  }
}
</style>
