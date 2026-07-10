<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import LeaveRing from '../components/LeaveRing.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__brand">
      <div class="auth-layout__brand-top">
        <div class="auth-layout__logo">
          <el-icon :size="22" color="var(--amber)"><Calendar /></el-icon>
          <span class="auth-layout__logo-text">員工請假系統</span>
        </div>
        <span class="auth-layout__logo-sub">Employee Leave System</span>
      </div>

      <div class="auth-layout__brand-mid">
        <LeaveRing :remaining="14" :total="18" unit-label="天特休可用" :size="200" />
        <p class="auth-layout__tagline">讓每一次休息，<br />都被好好安排。</p>
      </div>

      <p class="auth-layout__footnote">© 2026 員工請假系統．內部作品集示範專案</p>
    </div>

    <div class="auth-layout__form-panel">
      <div class="auth-layout__card">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
}

.auth-layout__brand {
  width: 480px;
  flex-shrink: 0;
  background-color: var(--ink);
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.auth-layout__brand-top {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-layout__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-layout__logo-text {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--text-inverse);
}

.auth-layout__logo-sub {
  font-size: 13px;
  color: var(--text-muted-inverse);
}

.auth-layout__brand-mid {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
}

.auth-layout__tagline {
  margin: 0;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--text-inverse);
}

.auth-layout__footnote {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted-inverse);
}

.auth-layout__form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-layout__card {
  width: 100%;
  max-width: 380px;
}

@media (max-width: 900px) {
  .auth-layout {
    flex-direction: column;
  }

  .auth-layout__brand {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
  }

  .auth-layout__brand-mid {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .auth-layout__tagline {
    font-size: 15px;
  }

  .auth-layout__footnote {
    display: none;
  }
}

@media (max-width: 560px) {
  .auth-layout__brand {
    flex-direction: column;
    align-items: flex-start;
  }

  .auth-layout__brand-mid {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>
