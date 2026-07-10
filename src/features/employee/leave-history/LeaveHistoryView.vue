<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import LeaveStatusTag from '../../../components/LeaveStatusTag.vue'
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
</template>

<style scoped>
.leave-history-view__error {
  margin-bottom: 16px;
}
</style>
