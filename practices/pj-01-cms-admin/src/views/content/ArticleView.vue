<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { articleApi } from '@/apis/article'
import { categoryApi } from '@/apis/category'
import type { ArticleVO, ArticleReq, CategoryVO } from '@/types/api'

// 分页与列表
const articleList = ref<ArticleVO[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选条件
const filterStatus = ref<number | ''>('')
const filterCategoryId = ref<number | null>(null)

// 分类选项（树）
const categoryTree = ref<CategoryVO[]>([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const editingId = ref<number | null>(null)
const formData = ref<ArticleReq>({
  title: '',
  summary: '',
  content: '',
  categoryId: null,
  status: 1,
  author: '',
})

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (filterStatus.value !== '') params.status = filterStatus.value
    if (filterCategoryId.value != null) params.categoryId = filterCategoryId.value
    const res = await articleApi.page(params)
    articleList.value = res.records
    total.value = res.total
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    categoryTree.value = await categoryApi.tree()
  } catch {
    // 错误已在拦截器中处理
  }
}

// 扁平化分类为级联选项
function flattenCategories(tree: CategoryVO[], level = 0): { value: number; label: string; level: number; children?: unknown[] }[] {
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
  filterStatus.value = ''
  filterCategoryId.value = null
  pageNum.value = 1
  fetchData()
}

function openCreateDialog() {
  dialogTitle.value = '新增文章'
  editingId.value = null
  formData.value = { title: '', summary: '', content: '', categoryId: null, status: 1, author: '' }
  dialogVisible.value = true
}

function openEditDialog(row: ArticleVO) {
  dialogTitle.value = '编辑文章'
  editingId.value = row.id
  formData.value = {
    title: row.title,
    summary: row.summary || '',
    content: row.content || '',
    categoryId: row.categoryId,
    status: row.status,
    author: row.author || '',
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formData.value.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }
  formLoading.value = true
  try {
    if (editingId.value) {
      await articleApi.update(editingId.value, formData.value)
      ElMessage.success('更新成功')
    } else {
      await articleApi.create(formData.value)
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

function handleDelete(row: ArticleVO) {
  ElMessageBox.confirm(`确定要删除文章「${row.title}」吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await articleApi.delete(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch {
      // 错误已在拦截器中处理
    }
  })
}

onMounted(() => {
  fetchData()
  fetchCategories()
})
</script>

<template>
  <div class="article-page">
    <!-- 页面标题 + 操作栏 -->
    <div class="page-header">
      <h2>文章管理</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><Plus /></el-icon>新增文章
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px">
        <el-option label="草稿" :value="0" />
        <el-option label="已发布" :value="1" />
      </el-select>
      <el-tree-select
        v-model="filterCategoryId"
        :data="flattenCategories(categoryTree)"
        :props="{ label: 'label', children: 'children' }"
        node-key="value"
        check-strictly
        clearable
        placeholder="分类"
        style="width: 200px"
      />
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>查询
      </el-button>
      <el-button @click="handleReset">
        <el-icon><Refresh /></el-icon>重置
      </el-button>
    </div>

    <!-- 文章表格 -->
    <el-table :data="articleList" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="分类" min-width="120">
        <template #default="{ row }">
          <el-tag v-if="(row as ArticleVO).categoryName">{{ (row as ArticleVO).categoryName }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="110" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="(row as ArticleVO).status === 1 ? 'success' : 'info'">
            {{ (row as ArticleVO).status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="浏览量" width="90" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openEditDialog(row as ArticleVO)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row as ArticleVO)">删除</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="分类">
          <el-tree-select
            v-model="formData.categoryId"
            :data="flattenCategories(categoryTree)"
            :props="{ label: 'label', children: 'children' }"
            node-key="value"
            check-strictly
            clearable
            placeholder="请选择分类"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formData.author" placeholder="请输入作者" maxlength="50" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="formData.summary" type="textarea" :rows="2" placeholder="请输入摘要" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="formData.content" type="textarea" :rows="6" placeholder="请输入文章内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="0">草稿</el-radio>
            <el-radio :value="1">已发布</el-radio>
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
.article-page {
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