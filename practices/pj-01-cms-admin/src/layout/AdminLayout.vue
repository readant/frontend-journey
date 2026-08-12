<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <el-container class="admin-layout">
    <el-aside width="220px">
      <AppSidebar />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.admin-layout {
  height: 100vh;
}

.el-aside {
  background: linear-gradient(180deg, #1e2a44 0%, #16203a 100%);
  overflow-y: auto;
  border-right: none;
}

.el-header {
  background-color: @header-bg;
  border-bottom: 1px solid @border-color;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.04);
}

.el-main {
  background-color: @main-bg;
  padding: 24px;
  overflow-y: auto;
}
</style>