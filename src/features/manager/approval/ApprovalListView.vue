<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import LeaveStatusTag from '../../../components/LeaveStatusTag.vue'
import EmptyState from '../../../components/EmptyState.vue'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { useApprovalStore } from '../../../stores/approval.store'
import type { LeaveRequest } from '../../../types'

type ApprovalAction = 'approve' | 'reject'

const approvalStore = useApprovalStore()

const detailVisible = ref(false)
const detailRequest = ref<LeaveRequest | null>(null)

const confirmVisible = ref(false)
const confirmAction = ref<ApprovalAction | null>(null)
const confirmTarget = ref<LeaveRequest | null>(null)

const confirmTitle = computed(() => (confirmAction.value === 'approve' ? '核准請假申請' : '駁回請假申請'))
const confirmButtonText = computed(() => (confirmAction.value === 'approve' ? '核准' : '駁回'))
const confirmMessage = computed(() => {
  if (!confirmTarget.value || !confirmAction.value) {
    return ''
  }

  const actionLabel = confirmAction.value === 'approve' ? '核准' : '駁回'

  return `確定要${actionLabel} ${confirmTarget.value.employeeName} 的${confirmTarget.value.leaveTypeName}申請嗎？`
})

onMounted(() => {
  void approvalStore.fetchPendingApprovals()
})

function openDetail(request: LeaveRequest) {
  detailRequest.value = request
  detailVisible.value = true
}

function openConfirm(action: ApprovalAction, request: LeaveRequest) {
  confirmAction.value = action
  confirmTarget.value = request
  confirmVisible.value = true
}

function resetConfirmState() {
  confirmVisible.value = false
  confirmAction.value = null
  confirmTarget.value = null
}

async function handleConfirm() {
  const action = confirmAction.value
  const target = confirmTarget.value

  if (!action || !target) {
    return
  }

  try {
    if (action === 'approve') {
      await approvalStore.approve(target.id)
      ElMessage.success(`已核准 ${target.employeeName} 的請假申請`)
    } else {
      await approvalStore.reject(target.id)
      ElMessage.success(`已駁回 ${target.employeeName} 的請假申請`)
    }
  } catch {
    ElMessage.error(approvalStore.error ?? '操作失敗，請稍後再試')
  } finally {
    resetConfirmState()
  }
}
</script>

<template>
  <div>
    <PageHeader title="待審核" />
    <p class="approval-view__sub">檢視所有待審核的請假申請，並完成核准或駁回</p>

    <div class="approval-view__desktop">
      <div class="approval-view__card">
        <BaseTable :data="approvalStore.pendingRequests" :loading="approvalStore.loading">
          <el-table-column label="員工" prop="employeeName" width="140" />
          <el-table-column label="假別" prop="leaveTypeName" width="110" />
          <el-table-column label="請假日期" width="200">
            <template #default="{ row }">{{ row.startDate }} ~ {{ row.endDate }}</template>
          </el-table-column>
          <el-table-column label="天數" prop="days" width="80" />
          <el-table-column label="原因" prop="reason" show-overflow-tooltip />
          <el-table-column label="狀態" width="100">
            <template #default="{ row }"><LeaveStatusTag :status="row.status" /></template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="{ row }">
              <el-button size="small" @click="openDetail(row)">詳情</el-button>
              <el-button
                size="small"
                type="primary"
                :loading="approvalStore.processingId === row.id"
                @click.stop="openConfirm('approve', row)"
                >核准</el-button
              >
              <el-button
                size="small"
                :loading="approvalStore.processingId === row.id"
                @click.stop="openConfirm('reject', row)"
                >拒絕</el-button
              >
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>

    <div class="approval-view__mobile">
      <EmptyState
        v-if="!approvalStore.loading && approvalStore.pendingRequests.length === 0"
        description="目前沒有待審核的請假申請"
      />
      <div
        v-for="request in approvalStore.pendingRequests"
        :key="request.id"
        class="approval-view__mobile-card"
        @click="openDetail(request)"
      >
        <div class="approval-view__mobile-top">
          <span class="approval-view__mobile-name"
            >{{ request.employeeName }}．{{ request.leaveTypeName }}</span
          >
          <LeaveStatusTag :status="request.status" />
        </div>
        <p class="approval-view__mobile-date">
          {{ request.startDate }} ~ {{ request.endDate }}（{{ request.days }} 天）
        </p>
        <p class="approval-view__mobile-reason">{{ request.reason }}</p>
        <div class="approval-view__mobile-actions">
          <el-button
            type="primary"
            class="approval-view__mobile-btn"
            :loading="approvalStore.processingId === request.id"
            @click.stop="openConfirm('approve', request)"
            >核准</el-button
          >
          <el-button
            class="approval-view__mobile-btn"
            :loading="approvalStore.processingId === request.id"
            @click.stop="openConfirm('reject', request)"
            >拒絕</el-button
          >
        </div>
      </div>
    </div>

    <el-dialog v-model="detailVisible" title="申請詳情" width="420px">
      <div v-if="detailRequest" class="approval-view__detail">
        <div class="approval-view__detail-row">
          <span>員工</span>
          <strong>{{ detailRequest.employeeName }}</strong>
        </div>
        <div class="approval-view__detail-row">
          <span>假別</span>
          <strong>{{ detailRequest.leaveTypeName }}</strong>
        </div>
        <div class="approval-view__detail-row">
          <span>請假日期</span>
          <strong>{{ detailRequest.startDate }} ~ {{ detailRequest.endDate }}（{{
            detailRequest.days
          }} 天）</strong>
        </div>
        <div class="approval-view__detail-row">
          <span>狀態</span>
          <LeaveStatusTag :status="detailRequest.status" />
        </div>
        <div class="approval-view__detail-reason">
          <span>原因</span>
          <p>{{ detailRequest.reason }}</p>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">關閉</el-button>
      </template>
    </el-dialog>

    <ConfirmDialog
      v-model="confirmVisible"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-text="confirmButtonText"
      @confirm="handleConfirm"
      @cancel="resetConfirmState"
    />
  </div>
</template>

<style scoped>
.approval-view__sub {
  margin: -8px 0 24px;
  font-size: 14px;
  color: var(--text-secondary);
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
  cursor: pointer;
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

.approval-view__detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
}

.approval-view__detail-row span {
  color: var(--text-secondary);
}

.approval-view__detail-reason {
  padding-top: 12px;
}

.approval-view__detail-reason span {
  font-size: 14px;
  color: var(--text-secondary);
}

.approval-view__detail-reason p {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--text-primary);
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
