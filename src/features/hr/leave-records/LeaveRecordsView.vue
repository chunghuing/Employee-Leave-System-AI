<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import LeaveStatusTag from '../../../components/LeaveStatusTag.vue'
import type { LeaveStatus } from '../../../types'

interface OrgRecord {
  [key: string]: unknown
  id: string
  employeeName: string
  leaveTypeName: string
  startDate: string
  endDate: string
  days: number
  status: LeaveStatus
}

const RECORDS: OrgRecord[] = [
  {
    id: 'demo-1',
    employeeName: '林雅婷',
    leaveTypeName: '年假',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    days: 3,
    status: 'pending',
  },
  {
    id: 'demo-2',
    employeeName: '張志偉',
    leaveTypeName: '病假',
    startDate: '2026-07-15',
    endDate: '2026-07-15',
    days: 1,
    status: 'approved',
  },
  {
    id: 'demo-3',
    employeeName: '李思穎',
    leaveTypeName: '事假',
    startDate: '2026-07-18',
    endDate: '2026-07-19',
    days: 2,
    status: 'pending',
  },
  {
    id: 'demo-4',
    employeeName: '王小明',
    leaveTypeName: '年假',
    startDate: '2026-06-01',
    endDate: '2026-06-03',
    days: 3,
    status: 'approved',
  },
  {
    id: 'demo-5',
    employeeName: '黃俊傑',
    leaveTypeName: '事假',
    startDate: '2026-05-09',
    endDate: '2026-05-09',
    days: 1,
    status: 'rejected',
  },
]
</script>

<template>
  <div>
    <PageHeader title="請假紀錄總覽" />

    <div class="leave-records-view__filters">
      <div class="leave-records-view__search">
        <el-icon :size="16" color="var(--text-secondary, #6b7280)"><Search /></el-icon>
        <span class="leave-records-view__search-placeholder">搜尋員工姓名</span>
      </div>
      <el-select placeholder="全部狀態" class="leave-records-view__status-filter">
        <el-option label="全部狀態" value="all" />
        <el-option label="待審核" value="pending" />
        <el-option label="已核准" value="approved" />
        <el-option label="已拒絕" value="rejected" />
      </el-select>
    </div>

    <div class="leave-records-view__desktop">
      <div class="leave-records-view__card">
        <BaseTable :data="RECORDS">
          <el-table-column label="員工" prop="employeeName" width="160" />
          <el-table-column label="假別" prop="leaveTypeName" width="110" />
          <el-table-column label="請假日期" width="220">
            <template #default="{ row }">{{ row.startDate }} ~ {{ row.endDate }}</template>
          </el-table-column>
          <el-table-column label="天數" prop="days" width="80" />
          <el-table-column label="狀態" width="120">
            <template #default="{ row }">
              <LeaveStatusTag :status="row.status" />
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>

    <div class="leave-records-view__mobile">
      <div v-for="record in RECORDS" :key="record.id" class="leave-records-view__mobile-card">
        <div class="leave-records-view__mobile-top">
          <span class="leave-records-view__mobile-name">{{ record.employeeName }}</span>
          <LeaveStatusTag :status="record.status" />
        </div>
        <p class="leave-records-view__mobile-detail">
          {{ record.leaveTypeName }}．{{ record.startDate }} ~ {{ record.endDate }}（{{
            record.days
          }}
          天）
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leave-records-view__filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.leave-records-view__search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  height: 40px;
  width: 320px;
  max-width: 100%;
  border-radius: var(--radius-control);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
}

.leave-records-view__search-placeholder {
  font-size: 14px;
  color: var(--text-secondary);
}

.leave-records-view__status-filter {
  width: 160px;
}

.leave-records-view__card {
  border-radius: var(--radius-card);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.leave-records-view__mobile {
  display: none;
}

.leave-records-view__mobile-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
}

.leave-records-view__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.leave-records-view__mobile-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.leave-records-view__mobile-detail {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .leave-records-view__desktop {
    display: none;
  }

  .leave-records-view__mobile {
    display: block;
  }
}
</style>
