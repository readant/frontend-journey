<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { productApi } from '@/apis/product'
import { productCategoryApi } from '@/apis/product-category'
import type { ProductVO, ProductReq, ProductCategoryVO } from '@/types/api'

// 分页与列表
const productList = ref<ProductVO[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选条件
const filterCategoryId = ref<number | null>(null)

// 产品分类（树）
const categoryTree = ref<ProductCategoryVO[]>([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = ref<ProductReq>({
  name: '',
  description: '',
  categoryId: null,
  coverImage: '',
  price: 0,
  status: 1,
})

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (filterCategoryId.value != null) params.categoryId = filterCategoryId.value
    const res = await productApi.page(params)
    productList.value = res.records
    total.value = res.total
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    categoryTree.value = await productCategoryApi.tree()
  } catch {
    // 错误已在拦截器中处理
  }
}

function flattenCategories(tree: ProductCategoryVO[], level = 0): { value: number; label: string; level: number; children?: unknown[] }[] {
  return tree.flatMap((node) => {
    const item = { value: node.id, label: node.name, level }
    return node.children?.length ? [{ ...item, children: flattenCategories(node.children, level + 1) }] : [item]
  })
}

function handleSearch() {
  pageNum.value = 1
  fetchData()
}

function handleReset() {
  filterCategoryId.value = null
  pageNum.value = 1
  fetchData()
}

function openCreateDialog() {
  dialogTitle.value = '新增产品'
  editingId.value = null
  formData.value = { name: '', description: '', categoryId: null, coverImage: '', price: 0, status: 1 }
  dialogVisible.value = true
}

function openEditDialog(row: ProductVO) {
  dialogTitle.value = '编辑产品'
  editingId.value = row.id
  formData.value = {
    name: row.name,
    description: row.description || '',
    categoryId: row.categoryId,
    coverImage: row.coverImage || '',
    price: row.price,
    status: row.status,
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formData.value.name.trim()) {
    ElMessage.warning('请输入产品名称')
    return
  }
  if (!formData.value.price || formData.value.price <= 0) {
    ElMessage.warning('请输入有效的产品价格')
    return
  }
  formLoading.value = true
  try {
    if (editingId.value) {
      await productApi.update(editingId.value, formData.value)
      ElMessage.success('更新成功')
    } else {
      await productApi.create(formData.value)
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

function handleDelete(row: ProductVO) {
  ElMessageBox.confirm(`确定要删除产品「${row.name}」吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await productApi.delete(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch {
      // 错误已在拦截器中处理
    }
  })
}

function formatPrice(value: number) {
  return `¥${Number(value).toFixed(2)}`
}

onMounted(() => {
  fetchData()
  fetchCategories()
})
</script>

<template>
  <div class="product-page">
    <!-- 页面标题 + 操作栏 -->
    <div class="page-header">
      <h2>产品管理</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>新增产品
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-tree-select
        v-model="filterCategoryId"
        :data="flattenCategories(categoryTree)"
        :props="{ label: 'label', children: 'children' }"
        node-key="value"
        check-strictly
        clearable
        placeholder="产品分类"
        style="width: 200px"
      />
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>查询
      </el-button>
      <el-button @click="handleReset">
        <el-icon><Refresh /></el-icon>重置
      </el-button>
    </div>

    <!-- 产品表格 -->
    <el-table :data="productList" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="产品名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="categoryId" label="分类ID" width="100" />
      <el-table-column prop="price" label="价格" width="120">
        <template #default="{ row }">{{ formatPrice((row as ProductVO).price) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="(row as ProductVO).status === 1 ? 'success' : 'danger'">
            {{ (row as ProductVO).status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openEditDialog(row as ProductVO)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row as ProductVO)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="fetchData"
        @size-change="handleSearch"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-tree-select
            v-model="formData.categoryId"
            :data="flattenCategories(categoryTree)"
            :props="{ label: 'label', children: 'children' }"
            node-key="value"
            check-strictly
            clearable
            placeholder="请选择产品分类"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input-number v-model="formData.price" :min="0.01" :precision="2" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="formData.coverImage" placeholder="请输入封面图 URL" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入产品描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
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
.product-page {
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

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>