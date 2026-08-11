<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { categoryApi } from '@/apis/category'
import type { CategoryVO, CategoryReq } from '@/types/api'

// 栏目树数据
const categoryTree = ref<CategoryVO[]>([])
const loading = ref(false)

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = ref<CategoryReq>({
  name: '',
  parentId: null,
  sortOrder: 0,
  status: 1,
})

// 排除自身及后代作为父级候选（避免循环引用）
const parentOptions = computed(() => {
  const excludeIds = new Set<number>()
  if (editingId.value != null) {
    collectSelfAndChildren(categoryTree.value, editingId.value, excludeIds)
  }
  return buildOptions(categoryTree.value, excludeIds)
})

function collectSelfAndChildren(tree: CategoryVO[], targetId: number, set: Set<number>) {
  for (const node of tree) {
    if (node.id === targetId || set.has(node.id)) {
      set.add(node.id)
      node.children.forEach((c) => collectSelfAndChildren([c], targetId, set))
    } else if (node.children?.length) {
      collectSelfAndChildren(node.children, targetId, set)
    }
  }
}

function buildOptions(tree: CategoryVO[], excludeIds: Set<number>): { value: number; label: string; children?: unknown[] }[] {
  return tree
    .filter((node) => !excludeIds.has(node.id))
    .map((node) => ({
      value: node.id,
      label: node.name,
      children: node.children?.length ? buildOptions(node.children, excludeIds) : undefined,
    }))
}

async function fetchTree() {
  loading.value = true
  try {
    categoryTree.value = await categoryApi.tree()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

function openCreateDialog(parent: CategoryVO | null) {
  dialogTitle.value = '新增栏目'
  editingId.value = null
  formData.value = {
    name: '',
    parentId: parent ? parent.id : null,
    sortOrder: 0,
    status: 1,
  }
  dialogVisible.value = true
}

function openEditDialog(row: CategoryVO) {
  dialogTitle.value = '编辑栏目'
  editingId.value = row.id
  formData.value = {
    name: row.name,
    parentId: row.parentId,
    sortOrder: row.sortOrder,
    status: row.status,
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formData.value.name.trim()) {
    ElMessage.warning('请输入栏目名称')
    return
  }
  formLoading.value = true
  try {
    if (editingId.value) {
      await categoryApi.update(editingId.value, formData.value)
      ElMessage.success('更新成功')
    } else {
      await categoryApi.create(formData.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchTree()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    formLoading.value = false
  }
}

function handleDelete(row: CategoryVO) {
  ElMessageBox.confirm(`确定要删除栏目「${row.name}」吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await categoryApi.delete(row.id)
      ElMessage.success('删除成功')
      fetchTree()
    } catch {
      // 错误已在拦截器中处理
    }
  })
}

onMounted(() => {
  fetchTree()
})
</script>

<template>
  <div class="category-page">
    <!-- 页面标题 + 操作栏 -->
    <div class="page-header">
      <h2>栏目管理</h2>
      <el-button type="primary" @click="openCreateDialog(null)">
        <el-icon><Plus /></el-icon>新增顶级栏目
      </el-button>
    </div>

    <!-- 树形表格 -->
    <el-table
      :data="categoryTree"
      v-loading="loading"
      row-key="id"
      border
      default-expand-all
      style="width: 100%"
    >
      <el-table-column prop="name" label="栏目名称" min-width="220" />
      <el-table-column prop="sortOrder" label="排序" width="90" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="(row as CategoryVO).status === 1 ? 'success' : 'info'">
            {{ (row as CategoryVO).status === 1 ? '显示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openCreateDialog(row as CategoryVO)">新增子栏目</el-button>
          <el-button type="primary" link size="small" @click="openEditDialog(row as CategoryVO)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row as CategoryVO)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="栏目名称" required>
          <el-input v-model="formData.name" placeholder="请输入栏目名称" />
        </el-form-item>
        <el-form-item label="父栏目">
          <el-tree-select
            v-model="formData.parentId"
            :data="parentOptions"
            :props="{ label: 'label', children: 'children' }"
            node-key="value"
            check-strictly
            clearable
            placeholder="不选择则为顶级栏目"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">显示</el-radio>
            <el-radio :value="0">隐藏</el-radio>
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
.category-page {
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