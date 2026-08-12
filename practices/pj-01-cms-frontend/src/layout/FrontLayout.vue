<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { CategoryVO } from '@/types/api'

const router = useRouter()
const route = useRoute()

const categories = ref<CategoryVO[]>([])

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
        <el-button class="admin-entry" text type="primary" @click="router.push('/admin')">
          管理后台
        </el-button>
      </div>
    </header>

    <main class="site-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <p>© {{ new Date().getFullYear() }} 兴华学习小组 · 用代码点亮学习之路</p>
    </footer>
  </div>
</template>

<style scoped lang="less">
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.logo {
  cursor: pointer;
  flex-shrink: 0;

  h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    color: #409eff;
  }
}

.site-menu {
  flex: 1;
  border-bottom: none;
  padding-left: 24px;

  :deep(.el-menu-item) {
    font-size: 15px;
  }
}

.admin-entry {
  flex-shrink: 0;
}

.site-main {
  flex: 1;
  background: #f7f8fa;
}

.site-footer {
  padding: 20px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
  background: #fff;
  border-top: 1px solid #eee;

  p {
    margin: 0;
  }
}
</style>