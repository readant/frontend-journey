<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@/components/icons'
import { roleApi } from '@/apis/role'
import { adminApi } from '@/apis/admin'
import type { RoleVO, AdminVO } from '@/types/api'

// 角色列表
const roleList = ref<RoleVO[]>([])
const loading = ref(false)

// 分配对话框状态
const assignVisible = ref(false)
const assignLoading = ref(false)
const adminOptions = ref<AdminVO[]>([])
const selectedAdminId = ref<number | null>(null)
const selectedRoleIds = ref<number[]>([])
const savedRoleIds = ref<number[]>([])

async function fetchRoles() {
  loading.value = true
  try {
    roleList.value = await roleApi.list()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

// 打开分配对话框
async function openAssignDialog() {
  selectedAdminId.value = null
  selectedRoleIds.value = []
  savedRoleIds.value = []
  try {
    adminOptions.value = await adminApi.list()
    assignVisible.value = true
  } catch {
    // 错误已在拦截器中处理
  }
}

// 选择管理员后回显其已分配角色
async function handleAdminChange(adminId: number) {
  selectedRoleIds.value = []
  try {
    const roles = await roleApi.getRolesByAdminId(adminId)
    selectedRoleIds.value = roles.map((r) => r.id)
    savedRoleIds.value = [...selectedRoleIds.value]
  } catch {
    // 错误已在拦截器中处理
  }
}

// 提交分配：对比差异，仅增删变化项
async function handleAssign() {
  if (!selectedAdminId.value) {
    ElMessage.warning('请先选择管理员')
    return
  }
  assignLoading.value = true
  try {
    const adminId = selectedAdminId.value
    const target = [...selectedRoleIds.value]
    const toRemove = savedRoleIds.value.filter((id) => !target.includes(id))
    const toAdd = target.filter((id) => !savedRoleIds.value.includes(id))

    for (const roleId of toRemove) {
      await roleApi.removeRole(adminId, roleId)
    }
    for (const roleId of toAdd) {
      await roleApi.assignRole(adminId, roleId)
    }
    ElMessage.success('角色分配已更新')
    assignVisible.value = false
    fetchRoles()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    assignLoading.value = false
  }
}

function handleReset() {
  selectedRoleIds.value = [...savedRoleIds.value]
}

onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <div class="role-page">
    <!-- 页面标题 + 操作栏 -->
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="openAssignDialog">
        <el-icon><User /></el-icon>给管理员分配角色
      </el-button>
    </div>

    <!-- 角色列表 -->
    <el-table :data="roleList" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色名称" min-width="140" />
      <el-table-column prop="code" label="角色编码" min-width="140">
        <template #default="{ row }">
          <el-tag>{{ (row as RoleVO).code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="220" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="(row as RoleVO).status === 1 ? 'success' : 'danger'">
            {{ (row as RoleVO).status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
    </el-table>

    <!-- 分配角色对话框 -->
    <el-dialog v-model="assignVisible" title="给管理员分配角色" width="520px" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="管理员" required>
          <el-select v-model="selectedAdminId" placeholder="请选择管理员" style="width: 100%" @change="handleAdminChange">
            <el-option
              v-for="admin in adminOptions"
              :key="admin.id"
              :label="`${admin.nickname || admin.username}（${admin.username}）`"
              :value="admin.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="selectedRoleIds">
            <el-checkbox v-for="role in roleList" :key="role.id" :value="role.id" :disabled="role.status !== 1">
              {{ role.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="assignLoading" @click="handleAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.role-page {
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
</style>