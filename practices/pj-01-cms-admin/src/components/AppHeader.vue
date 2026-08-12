<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 门户网站独立部署，地址通过环境变量 VITE_PORTAL_URL 配置（默认本地开发地址）
const portalUrl = import.meta.env.VITE_PORTAL_URL || 'http://localhost:3001'

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout()
    router.push('/login')
  })
}

function openPortal() {
  window.open(portalUrl, '_blank')
}
</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <span class="header-title">兴华小组官网 - 管理后台</span>
    </div>
    <div class="header-right">
      <el-button text type="primary" @click="openPortal" style="margin-right: 16px">
        查看官网
      </el-button>
      <el-dropdown @command="handleLogout">
        <span class="user-info">
          <el-icon><User /></el-icon>
          <span>{{ userStore.username }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="less">
.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #409eff;
  }
}
</style>