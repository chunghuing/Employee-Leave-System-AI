<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import PageHeader from '../../../components/PageHeader.vue'
import BaseTable from '../../../components/BaseTable.vue'

interface LeaveTypeRow {
  [key: string]: unknown
  id: string
  name: string
  annualDays: string
  description: string
}

const LEAVE_TYPES: LeaveTypeRow[] = [
  { id: 'lt-001', name: '年假', annualDays: '18 天', description: '滿一年後每年享有的特休假' },
  { id: 'lt-002', name: '病假', annualDays: '30 天', description: '因病就診或休養使用' },
  { id: 'lt-003', name: '事假', annualDays: '14 天', description: '處理個人重要事務使用' },
]

function handleAction() {
  ElMessage.info('假別管理功能尚未串接，敬請期待後續開發')
}
</script>

<template>
  <div>
    <PageHeader title="假別管理" />

    <div class="leave-types-view__header-bar">
      <p class="leave-types-view__sub">管理公司提供的假別與年度天數</p>
      <el-button type="primary" @click="handleAction">＋ 新增假別</el-button>
    </div>

    <div class="leave-types-view__desktop">
      <div class="leave-types-view__card">
        <BaseTable :data="LEAVE_TYPES">
          <el-table-column label="假別名稱" prop="name" width="220" />
          <el-table-column label="年度天數" prop="annualDays" width="140" />
          <el-table-column label="說明" prop="description" />
          <el-table-column label="操作" width="120">
            <template #default>
              <el-icon
                :size="17"
                color="var(--teal)"
                class="leave-types-view__action-icon"
                @click="handleAction"
              >
                <Edit />
              </el-icon>
              <el-icon
                :size="17"
                color="var(--coral)"
                class="leave-types-view__action-icon"
                @click="handleAction"
              >
                <Delete />
              </el-icon>
            </template>
          </el-table-column>
        </BaseTable>
      </div>
    </div>

    <div class="leave-types-view__mobile">
      <div v-for="type in LEAVE_TYPES" :key="type.id" class="leave-types-view__mobile-card">
        <div class="leave-types-view__mobile-top">
          <span class="leave-types-view__mobile-name">{{ type.name }}．{{ type.annualDays }}</span>
          <div class="leave-types-view__mobile-icons">
            <el-icon :size="16" color="var(--teal)" @click="handleAction"><Edit /></el-icon>
            <el-icon :size="16" color="var(--coral)" @click="handleAction"><Delete /></el-icon>
          </div>
        </div>
        <p class="leave-types-view__mobile-desc">{{ type.description }}</p>
      </div>
    </div>
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
