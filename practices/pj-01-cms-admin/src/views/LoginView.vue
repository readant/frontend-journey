<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import type { LoginReq } from '@/types/api'

const router = useRouter()
const userStore = useUserStore()

// 门户网站独立部署，地址通过环境变量 VITE_PORTAL_URL 配置（默认本地开发地址）
const portalUrl = import.meta.env.VITE_PORTAL_URL || 'http://localhost:3001'

function openPortal() {
  window.open(portalUrl, '_blank')
}

const loginForm = ref<LoginReq>({
  username: '',
  password: '',
})

const loading = ref(false)

async function handleLogin() {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    await userStore.login(loginForm.value)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    ElMessage.error(error?.msg || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 左侧品牌展示区 -->
    <div class="login-brand">
      <div class="brand-inner">
        <div class="brand-logo">
          <span class="logo-badge">兴</span>
          <span class="logo-text">兴华小组</span>
        </div>
        <h1 class="brand-title">内容管理系统</h1>
        <p class="brand-desc">
          统一管理官网栏目、文章与产品<br />
          让每一次内容更新都有迹可循
        </p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-area">
      <div class="login-card">
        <h2 class="login-title">欢迎回来</h2>
        <p class="login-subtitle">请登录管理后台</p>
        <el-form :model="loginForm" @keyup.enter="handleLogin">
          <el-form-item>
            <el-input v-model="loginForm.username" placeholder="用户名" size="large" :prefix-icon="'User'" />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              :prefix-icon="'Lock'"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              size="large"
              @click="handleLogin"
              class="login-button"
            >
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-footer">
          <el-link type="info" :underline="false" @click="openPortal">返回官网首页</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.login-container {
  display: flex;
  min-height: 100vh;
}

// 左侧品牌区
.login-brand {
  flex: 1.1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(900px 480px at 10% -20%, rgba(109, 93, 246, 0.55), transparent 60%),
    radial-gradient(800px 420px at 95% 120%, rgba(45, 212, 191, 0.32), transparent 60%),
    linear-gradient(135deg, #2f58c4 0%, #3b6ef5 55%, #5a6cf5 100%);

  // 网格纹理
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7), transparent 75%);
  }
}

.brand-inner {
  position: relative;
  padding: 40px;
  max-width: 440px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.brand-title {
  font-size: 38px;
  font-weight: 700;
  margin: 0 0 20px;
  line-height: 1.3;
}

.brand-desc {
  font-size: 16px;
  line-height: 1.9;
  opacity: 0.88;
  margin: 0;
}

// 右侧表单区
.login-form-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafd;
  padding: 24px;
}

.login-card {
  width: 400px;
  padding: 44px 40px 32px;
  background: #fff;
  border-radius: var(--app-radius-lg, 20px);
  box-shadow: var(--app-shadow, 0 6px 24px rgba(16, 24, 40, 0.08));
}

.login-title {
  text-align: center;
  margin: 0 0 8px;
  color: @text-primary;
  font-size: 24px;
  font-weight: 700;
}

.login-subtitle {
  text-align: center;
  color: @text-light;
  font-size: 14px;
  margin: 0 0 32px;
}

.login-button {
  width: 100%;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 4px;
}

.login-footer {
  text-align: center;
  margin-top: 8px;
}

// 响应式
@media (max-width: 860px) {
  .login-brand {
    display: none;
  }
}
</style>