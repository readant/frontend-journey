<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { CategoryVO } from '@/types/api'

const router = useRouter()
const route = useRoute()

const categories = ref<CategoryVO[]>([])

// 管理后台独立部署，地址通过环境变量 VITE_ADMIN_URL 配置（默认本地开发地址）
const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3002'

function openAdmin() {
  window.open(adminUrl, '_blank')
}

const menuList = ref<{ path: string; title: string }[]>([
  { path: '/', title: '首页' },
])

onMounted(async () => {
  try {
    const tree = await siteApi.categories()
    // 只展示顶层栏目，子栏目在栏目页里通过 el-tree 展示
    categories.value = tree.filter((item) => item.status === 1)
    menuList.value = [
      { path: '/', title: '首页' },
      ...categories.value.map((item) => ({ path: `/articles?categoryId=${item.id}`, title: item.name })),
    ]
  } catch {
    // 栏目加载失败不阻塞页面渲染
  }
})

function handleMenuSelect(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="front-layout">
    <header class="site-header">
      <div class="header-inner">
        <div class="logo" @click="router.push('/')">
          <span class="logo-badge">兴</span>
          <h1>兴华小组</h1>
        </div>
        <el-menu
          class="site-menu"
          mode="horizontal"
          :default-active="route.path"
          :ellipsis="false"
          @select="handleMenuSelect"
        >
          <el-menu-item v-for="item in menuList" :key="item.path" :index="item.path">
            {{ item.title }}
          </el-menu-item>
        </el-menu>
        <el-button class="admin-entry" text type="primary" @click="openAdmin">
          管理后台
        </el-button>
      </div>
    </header>

    <main class="site-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col footer-about">
          <div class="footer-logo">
            <span class="footer-badge">兴</span>
            <strong>兴华学习小组</strong>
          </div>
          <p>一群热爱编程的学习者组成的互助社区，以真实业务项目为主线，坚持分享、结对与复盘，让每一次成长都有迹可循。</p>
        </div>
        <div class="footer-col">
          <h4>快速导航</h4>
          <ul>
            <li v-for="item in menuList" :key="item.path" @click="handleMenuSelect(item.path)">
              {{ item.title }}
            </li>
            <li @click="router.push('/products')">产品中心</li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>联系我们</h4>
          <ul>
            <li>邮箱：contact@xinghua.dev</li>
            <li>地址：示例市高新区科创路 1 号</li>
            <li>时间：每周六 14:00 - 17:00 分享会</li>
          </ul>
        </div>
      </div>
      <div class="footer-copyright">
        <p>© {{ new Date().getFullYear() }} 兴华学习小组 · 用代码点亮学习之路 · 本站为学习演示项目</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(230, 234, 242, 0.7);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.logo {
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  .logo-badge {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, @primary-color 0%, @accent-color 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 110, 245, 0.35);
  }

  h1 {
    font-size: 19px;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, @primary-deep 0%, @primary-color 60%, @accent-color 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.site-menu {
  flex: 1;
  border-bottom: none;
  padding-left: 32px;
  background: transparent;

  :deep(.el-menu-item) {
    font-size: 15px;
    border-bottom: none;
    transition: color 0.2s;

    &.is-active {
      font-weight: 600;
    }
  }
}

.admin-entry {
  flex-shrink: 0;
}

.site-main {
  flex: 1;
}

.site-footer {
  background: #141a24;
  color: #aeb6c4;
  font-size: 13px;
  padding: 48px 24px 0;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 40px;
}

.footer-col {
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 18px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: #fff;
      }
    }
  }
}

.footer-about {
  p {
    line-height: 1.9;
    margin: 14px 0 0;
    max-width: 380px;
  }
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;

  .footer-badge {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: linear-gradient(135deg, @primary-color 0%, @accent-color 100%);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  strong {
    font-size: 17px;
    color: #fff;
  }
}

.footer-copyright {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 0;
  text-align: center;

  p {
    margin: 0;
    color: #6b7484;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>