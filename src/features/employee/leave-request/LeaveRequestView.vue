<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '../../../components/PageHeader.vue'
import { useDateRange } from '../../../composables/useDateRange'
import { useLeaveTypeStore } from '../../../stores/leaveType.store'
import { useLeaveRequestStore } from '../../../stores/leaveRequest.store'
import { ROUTE_NAMES } from '../../../constants'
import type { CreateLeaveRequestPayload } from '../../../types'

const router = useRouter()
const leaveTypeStore = useLeaveTypeStore()
const leaveRequestStore = useLeaveRequestStore()
const { startDate, endDate, days, isValidRange, reset: resetDateRange } = useDateRange()

const formRef = ref<FormInstance>()
const form = reactive({
  leaveTypeId: '',
  reason: '',
})

const rules: FormRules = {
  leaveTypeId: [{ required: true, message: '請選擇假別', trigger: 'change' }],
  reason: [{ required: true, message: '請輸入請假原因', trigger: 'blur' }],
}

const dateRangeError = ref('')
const submitError = ref('')

function disabledEndDate(date: Date) {
  if (!startDate.value) {
    return false
  }

  return date.getTime() < new Date(startDate.value).setHours(0, 0, 0, 0)
}

onMounted(() => {
  void leaveTypeStore.fetchLeaveTypes()
})

async function handleSubmit() {
  const formEl = formRef.value
  if (!formEl) {
    return
  }

  const valid = await formEl.validate().catch(() => false)

  dateRangeError.value = ''
  if (!startDate.value || !endDate.value) {
    dateRangeError.value = '請選擇開始與結束日期'
  } else if (!isValidRange.value) {
    dateRangeError.value = '結束日期不得早於開始日期'
  }

  if (!valid || dateRangeError.value) {
    return
  }

  submitError.value = ''

  const payload: CreateLeaveRequestPayload = {
    leaveTypeId: form.leaveTypeId,
    startDate: startDate.value,
    endDate: endDate.value,
    reason: form.reason,
  }

  try {
    await leaveRequestStore.submitRequest(payload)
    ElMessage.success('請假申請已送出')
    formEl.resetFields()
    resetDateRange()
    void router.push({ name: ROUTE_NAMES.EMPLOYEE_LEAVE_HISTORY })
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : '送出失敗，請稍後再試'
  }
}
</script>

<template>
  <div>
    <PageHeader title="申請請假" />
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="leave-request-view__form"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="假別" prop="leaveTypeId">
        <el-select v-model="form.leaveTypeId" placeholder="請選擇假別" style="width: 100%">
          <el-option
            v-for="leaveType in leaveTypeStore.leaveTypes"
            :key="leaveType.id"
            :label="leaveType.name"
            :value="leaveType.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="開始日期">
        <el-date-picker
          v-model="startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="請選擇開始日期"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="結束日期">
        <el-date-picker
          v-model="endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="請選擇結束日期"
          :disabled-date="disabledEndDate"
          style="width: 100%"
        />
      </el-form-item>

      <p v-if="dateRangeError" class="leave-request-view__date-error">{{ dateRangeError }}</p>
      <p v-else-if="isValidRange" class="leave-request-view__days">共 {{ days }} 天</p>

      <el-form-item label="請假原因" prop="reason">
        <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="請輸入請假原因" />
      </el-form-item>

      <el-alert
        v-if="submitError"
        :title="submitError"
        type="error"
        show-icon
        :closable="false"
        class="leave-request-view__error"
      />

      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="leaveRequestStore.submitting"
        >
          送出申請
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.leave-request-view__form {
  max-width: 480px;
}

.leave-request-view__days {
  margin: -8px 0 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.leave-request-view__date-error {
  margin: -8px 0 16px;
  font-size: 13px;
  color: var(--el-color-danger);
}

.leave-request-view__error {
  margin-bottom: 16px;
}
</style>
