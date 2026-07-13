<script setup lang="ts">
import { onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import LeaveStatusTag from '../../../components/LeaveStatusTag.vue'
import EmptyState from '../../../components/EmptyState.vue'
import { useLeaveRecordStore } from '../../../stores/leaveRecord.store'
import { useLeaveTypeStore } from '../../../stores/leaveType.store'

const leaveRecordStore = useLeaveRecordStore()
const leaveTypeStore = useLeaveTypeStore()

onMounted(() => {
  void leaveRecordStore.fetchAllRecords()
  void leaveTypeStore.fetchLeaveTypes()
})
</script>

<template>
  <div>
    <PageHeader title="請假紀錄總覽" />

    <el-alert
      v-if="leaveRecordStore.error"
      :title="leaveRecordStore.error"
      type="error"
      show-icon
      :closable="false"
      class="leave-records-view__error"
    />

    <div class="leave-records-view__filters">
      <el-input
        v-model="leaveRecordStore.searchKeyword"
        placeholder="搜尋員工姓名"
        clearable
        class="leave-records-view__search"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select placeholder="全部狀態" class="leave-records-view__status-filter">
        <el-option label="全部狀態" value="all" />
        <el-option label="待審核" value="pending" />
        <el-option label="已核准" value="approved" />
        <el-option label="已拒絕" value="rejected" />
      </el-select>
      <el-select
        v-model="leaveRecordStore.leaveTypeFilter"
        placeholder="全部假別"
        clearable
        class="leave-records-view__type-filter"
      >
        <el-option
          v-for="leaveType in leaveTypeStore.leaveTypes"
          :key="leaveType.id"
          :label="leaveType.name"
          :value="leaveType.id"
        />
      </el-select>
    </div>

    <div class="leave-records-view__desktop">
      <div class="leave-records-view__card">
        <BaseTable :data="leaveRecordStore.filteredRecords" :loading="leaveRecordStore.loading">
          <el-table-column label="員工" prop="employeeName" width="160" />
          <el-table-column label="假別" prop="leaveTypeName" width="110" />
          <el-table-column label="請假日期" prop="startDate" width="220" sortable>
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

    <div v-loading="leaveRecordStore.loading" class="leave-records-view__mobile">
      <EmptyState v-if="leaveRecordStore.filteredRecords.length === 0" />
      <div
        v-for="record in leaveRecordStore.filteredRecords"
        :key="record.id"
        class="leave-records-view__mobile-card"
      >
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
.leave-records-view__error {
  margin-bottom: 16px;
}

.leave-records-view__filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.leave-records-view__search {
  width: 320px;
  max-width: 100%;
}

.leave-records-view__status-filter,
.leave-records-view__type-filter {
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
