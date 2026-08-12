<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

interface MenuItem {
  path: string
  title: string
  icon: string
  children?: MenuItem[]
}

const menuList: MenuItem[] = [
  {
    path: '/dashboard',
    title: '数据看板',
    icon: 'Odometer',
  },
  {
    path: '/content',
    title: '内容管理',
    icon: 'Document',
    children: [
      { path: '/content/categories', title: '栏目管理', icon: 'FolderOpened' },
      { path: '/content/articles', title: '文章管理', icon: 'Notebook' },
      { path: '/content/products', title: '产品管理', icon: 'Goods' },
    ],
  },
  {
    path: '/system',
    title: '系统管理',
    icon: 'Setting',
    children: [
      { path: '/system/admins', title: '管理员管理', icon: 'User' },
      { path: '/system/roles', title: '角色管理', icon: 'Key' },
      { path: '/system/logs', title: '操作日志', icon: 'List' },
    ],
  },
]

const activeMenu = computed(() => route.path)

function handleMenuSelect(index: string) {
  router.push(index)
}
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-logo">
      <span class="logo-badge">兴</span>
      <h2>兴华小组后台</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      :router="false"
      @select="handleMenuSelect"
    >
      <template v-for="item in menuList" :key="item.path">
        <el-sub-menu v-if="item.children" :index="item.path">
          <template #title>
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
            <el-icon><component :is="child.icon" /></el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .logo-badge {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: linear-gradient(135deg, @primary-color, @accent-color);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 110, 245, 0.4);
  }

  h2 {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
}

.el-menu {
  border-right: none;
  flex: 1;
  padding: 8px 0;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #aeb9cb;
  --el-menu-hover-text-color: #fff;
  --el-menu-active-color: #fff;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    margin: 2px 8px;
    border-radius: 8px;
    transition: background 0.2s, color 0.2s;
  }

  :deep(.el-menu-item.is-active) {
    background: linear-gradient(90deg, rgba(59, 110, 245, 0.9), rgba(109, 93, 246, 0.75));
    color: #fff !important;
    box-shadow: 0 4px 12px rgba(59, 110, 245, 0.35);
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-color: rgba(255, 255, 255, 0.08);
  }

  :deep(.el-sub-menu .el-menu) {
    background-color: transparent;
  }
}
</style>