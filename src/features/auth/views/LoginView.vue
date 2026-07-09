<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuth } from '../../../composables/useAuth'
import type { LoginCredentials } from '../../../types'

const { login } = useAuth()

const formRef = ref<FormInstance>()
const form = reactive<LoginCredentials>({
  email: '',
  password: '',
})

const rules: FormRules<LoginCredentials> = {
  email: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
}

const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  const formEl = formRef.value
  if (!formEl) {
    return
  }

  const valid = await formEl.validate().catch(() => false)
  if (!valid) {
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await login(form)
    ElMessage.success('登入成功')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登入失敗，請稍後再試'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <h1 class="login-view__title">員工請假系統</h1>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="帳號" prop="email">
        <el-input v-model="form.email" placeholder="請輸入帳號" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="form.password" type="password" placeholder="請輸入密碼" show-password />
      </el-form-item>
      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
        class="login-view__error"
      />
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="isSubmitting"
          class="login-view__submit"
        >
          登入
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-view__title {
  margin: 0 0 24px;
  text-align: center;
  font-size: 20px;
}

.login-view__error {
  margin-bottom: 16px;
}

.login-view__submit {
  width: 100%;
}
</style>
