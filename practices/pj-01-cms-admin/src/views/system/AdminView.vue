<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/apis/admin'
import type { AdminVO, AdminCreateReq, AdminUpdateReq } from '@/types/api'

const adminList = ref<AdminVO[]>([])
const loading = ref(false)
const searchKeyword = ref('')

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = ref<AdminCreateReq & { status?: number }>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1,
})

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

function openCreateDialog() {
  dialogTitle.value = '新增管理员'
  editingId.value = null
  formData.value = { username: '', password: '', nickname: '', email: '', phone: '', status: 1 }
  dialogVisible.value = true
}

function openEditDialog(row: AdminVO) {
  dialogTitle.value = '编辑管理员'
  editingId.value = row.id
  formData.value = {
    username: row.username,
    password: '',
    nickname: row.nickname || '',
    email: row.email || '',
    phone: row.phone || '',
    status: row.status,
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formData.value.username || (!editingId.value && !formData.value.password)) {
    ElMessage.warning('请填写必填项')
    return
  }

  formLoading.value = true
  try {
    if (editingId.value) {
      const updateData: AdminUpdateReq = {
        nickname: formData.value.nickname,
        email: formData.value.email,
        phone: formData.value.phone,
        status: formData.value.status,
      }
      await adminApi.update(editingId.value, updateData)
      ElMessage.success('更新成功')
    } else {
      await adminApi.create(formData.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    formLoading.value = false
  }
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

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="admin-page">
    <!-- 页面标题 + 操作栏 -->
    <div class="page-header">
      <h2>管理员管理</h2>
      <el-button type="primary" @click="openCreateDialog">
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
          <el-button type="primary" link size="small" @click="openEditDialog(row as AdminVO)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row as AdminVO)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="!!editingId" />
        </el-form-item>
        <el-form-item label="密码" :required="!editingId">
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            :placeholder="editingId ? '留空则不修改密码' : '请输入密码'"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleSubmit">
          {{ formLoading ? '提交中...' : '确定' }}
        </el-button>
      </template>
    </el-dialog>
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