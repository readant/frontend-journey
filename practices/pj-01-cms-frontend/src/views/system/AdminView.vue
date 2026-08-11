<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/apis/admin'
import type { AdminVO } from '@/types/api'

const adminList = ref<AdminVO[]>([])
const loading = ref(false)
const searchKeyword = ref('')

// 前端搜索过滤
const filteredList = computed(() => {
  if (!searchKeyword.value) return adminList.value
  const keyword = searchKeyword.value.toLowerCase()
  return adminList.value.filter(
    (item) =>
      item.username.toLowerCase().includes(keyword) ||
      item.nickname?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword),
  )
})

async function fetchData() {
  loading.value = true
  try {
    adminList.value = await adminApi.list()
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

function handleEdit(row: AdminVO) {
  ElMessage.info(`编辑管理员: ${row.username}（功能待实现）`)
}

function handleDelete(row: AdminVO) {
  ElMessageBox.confirm(`确定要删除管理员「${row.username}」吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await adminApi.delete(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch {
      // 错误已在拦截器中处理
    }
  })
}

function handleCreate() {
  ElMessage.info('新增管理员（功能待实现）')
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="admin-page">
    <!-- 页面标题 + 操作栏 -->
    <div class="page-header">
      <h2>管理员管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>新增管理员
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名、昵称或邮箱"
        clearable
        style="width: 320px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 表格 -->
    <el-table :data="filteredList" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" min-width="120" />
      <el-table-column prop="nickname" label="昵称" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="(row as AdminVO).status === 1 ? 'success' : 'danger'">
            {{ (row as AdminVO).status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="{ row }">
          {{ (row as AdminVO).createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row as AdminVO)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row as AdminVO)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="less">
.admin-page {
  h2 {
    margin-bottom: 0;
    font-size: 20px;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>