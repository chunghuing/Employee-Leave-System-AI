<script setup lang="ts"></script>

<template>
  <div class="auth-layout">
    <el-card class="auth-layout__card">
      <router-view />
    </el-card>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-layout__card {
  width: 100%;
  max-width: 400px;
}
</style>
