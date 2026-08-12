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
    path: '/admin/dashboard',
    title: '数据看板',
    icon: 'Odometer',
  },
  {
    path: '/admin/content',
    title: '内容管理',
    icon: 'Document',
    children: [
      { path: '/admin/content/categories', title: '栏目管理', icon: 'FolderOpened' },
      { path: '/admin/content/articles', title: '文章管理', icon: 'Notebook' },
      { path: '/admin/content/products', title: '产品管理', icon: 'Goods' },
    ],
  },
  {
    path: '/admin/system',
    title: '系统管理',
    icon: 'Setting',
    children: [
      { path: '/admin/system/admins', title: '管理员管理', icon: 'User' },
      { path: '/admin/system/roles', title: '角色管理', icon: 'Key' },
      { path: '/admin/system/logs', title: '操作日志', icon: 'List' },
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
      <h2>兴华小组</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      :router="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
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
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h2 {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.el-menu {
  border-right: none;
  flex: 1;
}
</style>