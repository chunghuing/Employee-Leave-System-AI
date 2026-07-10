<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import LeaveStatusTag from '../../../components/LeaveStatusTag.vue'
import EmptyState from '../../../components/EmptyState.vue'
import { useLeaveRequestStore } from '../../../stores/leaveRequest.store'

const leaveRequestStore = useLeaveRequestStore()

onMounted(() => {
  void leaveRequestStore.fetchMyRequests()
})
</script>

<template>
  <div>
    <PageHeader title="請假紀錄" />
    <el-alert
      v-if="leaveRequestStore.error"
      :title="leaveRequestStore.error"
      type="error"
      show-icon
      :closable="false"
      class="leave-history-view__error"
    />

    <div class="leave-history-view__desktop">
      <div class="leave-history-view__card">
        <BaseTable :data="leaveRequestStore.sortedRequests" :loading="leaveRequestStore.loading">
          <el-table-column label="假別" prop="leaveTypeName" />
          <el-table-column label="請假日期" prop="startDate" sortable>
            <template #default="{ row }">{{ row.startDate }} ~ {{ row.endDate }}</template>
          </el-table-column>
          <el-table-column label="天數" prop="days" width="80" />
          <el-table-column label="原因" prop="reason" />
          <el-table-column label="狀態" width="100">
            <template #default="{ row }">
              <LeaveStatusTag :status="row.status" />
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>

    <div v-loading="leaveRequestStore.loading" class="leave-history-view__mobile">
      <EmptyState v-if="leaveRequestStore.sortedRequests.length === 0" />
      <div
        v-for="request in leaveRequestStore.sortedRequests"
        :key="request.id"
        class="leave-history-view__mobile-card"
      >
        <div class="leave-history-view__mobile-top">
          <span class="leave-history-view__mobile-type"
            >{{ request.leaveTypeName }}．{{ request.days }} 天</span
          >
          <LeaveStatusTag :status="request.status" />
        </div>
        <p class="leave-history-view__mobile-date">
          {{ request.startDate }} ~ {{ request.endDate }}
        </p>
        <p class="leave-history-view__mobile-reason">{{ request.reason }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leave-history-view__error {
  margin-bottom: 16px;
}

.leave-history-view__card {
  border-radius: var(--radius-card);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.leave-history-view__mobile {
  display: none;
}

.leave-history-view__mobile-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
}

.leave-history-view__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.leave-history-view__mobile-type {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.leave-history-view__mobile-date,
.leave-history-view__mobile-reason {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .leave-history-view__desktop {
    display: none;
  }

  .leave-history-view__mobile {
    display: block;
  }
}
</style>
