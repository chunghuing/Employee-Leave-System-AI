<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '../../../components/PageHeader.vue'
import LeaveRing from '../../../components/LeaveRing.vue'
import { useDateRange } from '../../../composables/useDateRange'
import { useLeaveTypeStore } from '../../../stores/leaveType.store'
import { useLeaveRequestStore } from '../../../stores/leaveRequest.store'
import { useLeaveBalanceStore } from '../../../stores/leaveBalance.store'
import { ROUTE_NAMES } from '../../../constants'
import type { CreateLeaveRequestPayload } from '../../../types'

const router = useRouter()
const leaveTypeStore = useLeaveTypeStore()
const leaveRequestStore = useLeaveRequestStore()
const leaveBalanceStore = useLeaveBalanceStore()
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

const selectedBalance = computed(
  () =>
    leaveBalanceStore.balances.find((balance) => balance.leaveTypeId === form.leaveTypeId) ??
    leaveBalanceStore.balances[0],
)
const remainingAfterSubmit = computed(() => {
  if (!selectedBalance.value) {
    return undefined
  }
  const usedDays = isValidRange.value ? days.value : 0
  return Math.max(0, selectedBalance.value.remainingDays - usedDays)
})

function disabledEndDate(date: Date) {
  if (!startDate.value) {
    return false
  }

  return date.getTime() < new Date(startDate.value).setHours(0, 0, 0, 0)
}

onMounted(() => {
  void leaveTypeStore.fetchLeaveTypes()
  void leaveBalanceStore.fetchBalance()
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
    <div class="leave-request-view__row">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="leave-request-view__form"
        @submit.prevent="handleSubmit"
      >
        <div class="leave-request-view__head">
          <h2 class="leave-request-view__heading">申請請假</h2>
          <p class="leave-request-view__sub">詳細填寫假別與日期，送出後將通知主管審核</p>
        </div>

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
            class="leave-request-view__submit"
            :loading="leaveRequestStore.submitting"
          >
            送出申請
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="selectedBalance" class="leave-request-view__side-card">
        <LeaveRing
          :remaining="selectedBalance.remainingDays"
          :total="selectedBalance.totalDays"
          unit-label="天可用"
          :size="140"
        />
        <div class="leave-request-view__side-text">
          <p class="leave-request-view__side-label">目前{{ selectedBalance.leaveTypeName }}餘額</p>
          <p class="leave-request-view__side-note">
            <template v-if="isValidRange">
              送出本次申請後將剩下 {{ remainingAfterSubmit }} 天
            </template>
            <template v-else> 選擇假別與日期後，將顯示送出後的剩餘天數 </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leave-request-view__row {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.leave-request-view__form {
  width: 560px;
  max-width: 100%;
  padding: 32px;
  border-radius: var(--radius-card);
  background-color: var(--surface);
  border: 1px solid var(--border-color);
}

.leave-request-view__head {
  margin-bottom: 20px;
}

.leave-request-view__heading {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.leave-request-view__sub {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.leave-request-view__days {
  margin: -8px 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--teal);
}

.leave-request-view__date-error {
  margin: -8px 0 16px;
  font-size: 13px;
  color: var(--coral);
}

.leave-request-view__error {
  margin-bottom: 16px;
}

.leave-request-view__submit {
  width: 100%;
}

.leave-request-view__side-card {
  width: 320px;
  max-width: 100%;
  padding: 32px;
  border-radius: var(--radius-card);
  background-color: var(--ink);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.leave-request-view__side-text {
  text-align: center;
}

.leave-request-view__side-label {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--text-muted-inverse);
}

.leave-request-view__side-note {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted-inverse);
}

@media (max-width: 767px) {
  .leave-request-view__row {
    flex-direction: column;
  }

  .leave-request-view__side-card {
    width: 100%;
    flex-direction: row;
    text-align: left;
  }

  .leave-request-view__side-text {
    text-align: left;
  }
}
</style>
