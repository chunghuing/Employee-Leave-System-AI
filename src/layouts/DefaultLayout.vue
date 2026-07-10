<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Calendar,
  Document,
  DocumentAdd,
  Fold,
  List,
  PieChart,
  Setting,
  SwitchButton,
  Tickets,
  User,
} from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.store'
import { ROUTE_NAMES } from '../constants'

interface MenuItem {
  routeName: string
  label: string
  icon: typeof PieChart
}

const MENU_ITEMS_BY_ROLE: Record<string, MenuItem[]> = {
  employee: [
    { routeName: ROUTE_NAMES.EMPLOYEE_LEAVE_BALANCE, label: '剩餘假期', icon: PieChart },
    { routeName: ROUTE_NAMES.EMPLOYEE_LEAVE_REQUEST, label: '申請請假', icon: DocumentAdd },
    { routeName: ROUTE_NAMES.EMPLOYEE_LEAVE_HISTORY, label: '請假紀錄', icon: Tickets },
  ],
  manager: [{ routeName: ROUTE_NAMES.MANAGER_APPROVAL, label: '待審核', icon: List }],
  hr: [
    { routeName: ROUTE_NAMES.HR_LEAVE_RECORDS, label: '請假紀錄', icon: Document },
    { routeName: ROUTE_NAMES.HR_LEAVE_TYPES, label: '假別管理', icon: Setting },
  ],
}

const ROLE_LABELS: Record<string, string> = {
  employee: '員工',
  manager: '主管',
  hr: 'HR',
}

const MOBILE_BREAKPOINT_PX = 768

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMobile = ref(false)
const isDrawerOpen = ref(false)

const menuItems = computed(() => (authStore.role ? MENU_ITEMS_BY_ROLE[authStore.role] : []))
const pageTitle = computed(
  () => menuItems.value.find((item) => item.routeName === route.name)?.label ?? '',
)
const roleLabel = computed(() => (authStore.role ? ROLE_LABELS[authStore.role] : ''))

function handleResize() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT_PX
  if (!isMobile.value) {
    isDrawerOpen.value = false
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
}

function closeDrawer() {
  if (isMobile.value) {
    isDrawerOpen.value = false
  }
}

function handleLogout() {
  authStore.logout()
  void router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<template>
  <div class="default-layout">
    <div v-if="isMobile && isDrawerOpen" class="default-layout__overlay" @click="closeDrawer"></div>

    <aside
      class="default-layout__aside"
      :class="{
        'default-layout__aside--mobile': isMobile,
        'default-layout__aside--open': !isMobile || isDrawerOpen,
      }"
    >
      <div class="default-layout__brand">
        <el-icon :size="20" color="var(--amber)"><Calendar /></el-icon>
        <span class="default-layout__brand-text">員工請假系統</span>
      </div>

      <nav class="default-layout__nav" @click="closeDrawer">
        <router-link
          v-for="item in menuItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="default-layout__nav-item"
          :class="{ 'default-layout__nav-item--active': route.name === item.routeName }"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <div class="default-layout__main">
      <header class="default-layout__header">
        <div class="default-layout__header-left">
          <button
            v-if="isMobile"
            type="button"
            class="default-layout__hamburger"
            aria-label="開啟選單"
            @click="toggleDrawer"
          >
            <el-icon :size="20"><Fold /></el-icon>
          </button>
          <h1 class="default-layout__title">{{ pageTitle }}</h1>
        </div>
        <div class="default-layout__header-right">
          <div v-if="authStore.currentUser" class="default-layout__user">
            <span class="default-layout__user-name">{{ authStore.currentUser.name }}</span>
            <span class="default-layout__user-role">．{{ roleLabel }}</span>
          </div>
          <div class="default-layout__avatar">
            <el-icon :size="16" color="var(--teal)"><User /></el-icon>
          </div>
          <button
            type="button"
            class="default-layout__logout"
            aria-label="登出"
            @click="handleLogout"
          >
            <el-icon :size="19"><SwitchButton /></el-icon>
          </button>
        </div>
      </header>
      <main class="default-layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--canvas);
}

.default-layout__overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 15, 29, 0.55);
  z-index: 20;
}

.default-layout__aside {
  width: 240px;
  flex-shrink: 0;
  background-color: var(--ink);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.default-layout__aside--mobile {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 30;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}

.default-layout__aside--mobile.default-layout__aside--open {
  transform: translateX(0);
}

.default-layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
}

.default-layout__brand-text {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-inverse);
}

.default-layout__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.default-layout__nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-control);
  color: var(--text-muted-inverse);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.default-layout__nav-item:hover {
  color: var(--text-inverse);
}

.default-layout__nav-item--active {
  background-color: var(--ink-soft);
  color: var(--text-inverse);
}

.default-layout__nav-item--active .el-icon {
  color: var(--amber);
}

.default-layout__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.default-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border-color);
}

.default-layout__header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.default-layout__hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-primary);
}

.default-layout__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  color: var(--text-primary);
}

.default-layout__header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.default-layout__user {
  font-size: 14px;
  color: var(--text-secondary);
}

.default-layout__avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background-color: var(--teal-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.default-layout__logout {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}

.default-layout__content {
  flex: 1;
  padding: 32px;
}

@media (max-width: 767px) {
  .default-layout__content {
    padding: 20px;
  }

  .default-layout__header {
    padding: 14px 16px;
  }

  .default-layout__user,
  .default-layout__avatar {
    display: none;
  }
}
</style>
