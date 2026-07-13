<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'
import EmptyState from '../../../components/EmptyState.vue'
import ConfirmDialog from '../../../components/ConfirmDialog.vue'
import { useLeaveTypeStore } from '../../../stores/leaveType.store'
import type { CreateLeaveTypePayload, LeaveType } from '../../../types'

type FormMode = 'create' | 'edit'

const leaveTypeStore = useLeaveTypeStore()

const formRef = ref<FormInstance>()
const formVisible = ref(false)
const formMode = ref<FormMode>('create')
const editingId = ref<string | null>(null)
const form = reactive<CreateLeaveTypePayload>({
  name: '',
  totalDays: 0,
  description: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '請輸入假別名稱', trigger: 'blur' }],
  totalDays: [
    { required: true, message: '請輸入年度天數', trigger: 'blur' },
    { type: 'number', min: 1, message: '年度天數需為正整數', trigger: 'blur' },
  ],
  description: [{ required: true, message: '請輸入說明', trigger: 'blur' }],
}

const formSubmitting = computed(() =>
  formMode.value === 'create'
    ? leaveTypeStore.submitting
    : leaveTypeStore.processingId === editingId.value,
)

const deleteConfirmVisible = ref(false)
const deleteTarget = ref<LeaveType | null>(null)
const deleteConfirmMessage = computed(() =>
  deleteTarget.value ? `確定要刪除「${deleteTarget.value.name}」嗎？此動作無法復原。` : '',
)

onMounted(() => {
  void leaveTypeStore.fetchLeaveTypes()
})

function resetForm() {
  form.name = ''
  form.totalDays = 0
  form.description = ''
}

function openCreateForm() {
  formMode.value = 'create'
  editingId.value = null
  resetForm()
  formRef.value?.clearValidate()
  formVisible.value = true
}

function openEditForm(leaveType: LeaveType) {
  formMode.value = 'edit'
  editingId.value = leaveType.id
  form.name = leaveType.name
  form.totalDays = leaveType.totalDays
  form.description = leaveType.description
  formRef.value?.clearValidate()
  formVisible.value = true
}

async function handleFormSubmit() {
  const formEl = formRef.value
  if (!formEl) {
    return
  }

  const valid = await formEl.validate().catch(() => false)
  if (!valid) {
    return
  }

  const payload: CreateLeaveTypePayload = {
    name: form.name,
    totalDays: form.totalDays,
    description: form.description,
  }

  try {
    if (formMode.value === 'create') {
      await leaveTypeStore.createLeaveType(payload)
      ElMessage.success('假別已新增')
    } else if (editingId.value) {
      await leaveTypeStore.updateLeaveType(editingId.value, payload)
      ElMessage.success('假別已更新')
    }
    formVisible.value = false
  } catch {
    ElMessage.error(leaveTypeStore.error ?? '操作失敗，請稍後再試')
  }
}

function openDeleteConfirm(leaveType: LeaveType) {
  deleteTarget.value = leaveType
  deleteConfirmVisible.value = true
}

function resetDeleteConfirmState() {
  deleteConfirmVisible.value = false
  deleteTarget.value = null
}

async function handleDeleteConfirm() {
  const target = deleteTarget.value
  if (!target) {
    return
  }

  try {
    await leaveTypeStore.deleteLeaveType(target.id)
    ElMessage.success(`已刪除「${target.name}」`)
  } catch {
    ElMessage.error(leaveTypeStore.error ?? '刪除失敗，請稍後再試')
  } finally {
    resetDeleteConfirmState()
  }
}
</script>

<template>
  <div>
    <PageHeader title="假別管理" />

    <div class="leave-types-view__header-bar">
      <p class="leave-types-view__sub">管理公司提供的假別與年度天數</p>
      <el-button type="primary" @click="openCreateForm">＋ 新增假別</el-button>
    </div>

    <div class="leave-types-view__desktop">
      <div class="leave-types-view__card">
        <BaseTable :data="leaveTypeStore.leaveTypes" :loading="leaveTypeStore.loading">
          <el-table-column label="假別名稱" prop="name" width="220" />
          <el-table-column label="年度天數" width="140">
            <template #default="{ row }">{{ row.totalDays }} 天</template>
          </el-table-column>
          <el-table-column label="說明" prop="description" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-icon
                :size="17"
                color="var(--teal)"
                class="leave-types-view__action-icon"
                @click="openEditForm(row)"
              >
                <Edit />
              </el-icon>
              <el-icon
                :size="17"
                color="var(--coral)"
                class="leave-types-view__action-icon"
                @click="openDeleteConfirm(row)"
              >
                <Delete />
              </el-icon>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>

    <div v-loading="leaveTypeStore.loading" class="leave-types-view__mobile">
      <EmptyState v-if="leaveTypeStore.leaveTypes.length === 0" />
      <div
        v-for="type in leaveTypeStore.leaveTypes"
        :key="type.id"
        class="leave-types-view__mobile-card"
      >
        <div class="leave-types-view__mobile-top">
          <span class="leave-types-view__mobile-name">{{ type.name }}．{{ type.totalDays }} 天</span>
          <div class="leave-types-view__mobile-icons">
            <el-icon :size="16" color="var(--teal)" @click="openEditForm(type)"><Edit /></el-icon>
            <el-icon :size="16" color="var(--coral)" @click="openDeleteConfirm(type)">
              <Delete />
            </el-icon>
          </div>
        </div>
        <p class="leave-types-view__mobile-desc">{{ type.description }}</p>
      </div>
    </div>

    <el-dialog
      v-model="formVisible"
      :title="formMode === 'create' ? '新增假別' : '編輯假別'"
      width="420px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="假別名稱" prop="name">
          <el-input v-model="form.name" placeholder="請輸入假別名稱" />
        </el-form-item>
        <el-form-item label="年度天數" prop="totalDays">
          <el-input-number v-model="form.totalDays" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="說明" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="請輸入假別說明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="formSubmitting" @click="handleFormSubmit">
          送出
        </el-button>
      </template>
    </el-dialog>

    <ConfirmDialog
      v-model="deleteConfirmVisible"
      title="刪除假別"
      :message="deleteConfirmMessage"
      confirm-text="刪除"
      @confirm="handleDeleteConfirm"
      @cancel="resetDeleteConfirmState"
    />
  </div>
</template>

<style scoped>
.leave-types-view__header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.leave-types-view__sub {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.leave-types-view__card {
  border-radius: var(--radius-card);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.leave-types-view__action-icon {
  cursor: pointer;
  margin-right: 16px;
}

.leave-types-view__mobile {
  display: none;
}

.leave-types-view__mobile-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
}

.leave-types-view__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.leave-types-view__mobile-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.leave-types-view__mobile-icons {
  display: flex;
  gap: 12px;
}

.leave-types-view__mobile-desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .leave-types-view__desktop {
    display: none;
  }

  .leave-types-view__mobile {
    display: block;
  }
}
</style>
