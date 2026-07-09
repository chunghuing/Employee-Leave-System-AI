<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { ROUTE_NAMES } from '../constants'

interface MenuItem {
  routeName: string
  label: string
}

const MENU_ITEMS_BY_ROLE: Record<string, MenuItem[]> = {
  employee: [
    { routeName: ROUTE_NAMES.EMPLOYEE_LEAVE_BALANCE, label: '剩餘假期' },
    { routeName: ROUTE_NAMES.EMPLOYEE_LEAVE_REQUEST, label: '申請請假' },
    { routeName: ROUTE_NAMES.EMPLOYEE_LEAVE_HISTORY, label: '請假紀錄' },
  ],
  manager: [{ routeName: ROUTE_NAMES.MANAGER_APPROVAL, label: '待審核' }],
  hr: [
    { routeName: ROUTE_NAMES.HR_LEAVE_RECORDS, label: '請假紀錄' },
    { routeName: ROUTE_NAMES.HR_LEAVE_TYPES, label: '假別管理' },
  ],
}

const COLLAPSE_BREAKPOINT_PX = 768

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)

const menuItems = computed(() => (authStore.role ? MENU_ITEMS_BY_ROLE[authStore.role] : []))

function handleResize() {
  isCollapsed.value = window.innerWidth < COLLAPSE_BREAKPOINT_PX
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleLogout() {
  authStore.logout()
  void router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<template>
  <el-container class="default-layout">
    <el-aside :width="isCollapsed ? '64px' : '200px'" class="default-layout__aside">
      <el-menu :collapse="isCollapsed" :default-active="String(route.name ?? '')" router>
        <el-menu-item
          v-for="item in menuItems"
          :key="item.routeName"
          :index="item.routeName"
          :route="{ name: item.routeName }"
        >
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="default-layout__header">
        <span v-if="authStore.currentUser">{{ authStore.currentUser.name }}</span>
        <el-button text @click="handleLogout">登出</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
}

.default-layout__aside {
  transition: width 0.2s ease;
  overflow: hidden;
}

.default-layout__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
