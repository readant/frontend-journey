<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { logApi } from '@/apis/log'
import type { OperationLogVO } from '@/types/api'

// 分页与列表
const logList = ref<OperationLogVO[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选条件
const filterModule = ref('')
const filterAction = ref('')

const moduleOptions = ['管理员', '文章', '角色', '栏目', '产品', '分类']
const actionOptions = ['创建', '更新', '删除']

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { pageNum: pageNum.value, pageSize: pageSize.value }
    if (filterModule.value) params.module = filterModule.value
    if (filterAction.value) params.action = filterAction.value
    const res = await logApi.page(params)
    logList.value = res.records
    total.value = res.total
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pageNum.value = 1
  fetchData()
}

function handleReset() {
  filterModule.value = ''
  filterAction.value = ''
  pageNum.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="log-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>操作日志</h2>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="filterModule" placeholder="操作模块" clearable style="width: 150px">
        <el-option v-for="m in moduleOptions" :key="m" :label="m" :value="m" />
      </el-select>
      <el-select v-model="filterAction" placeholder="操作类型" clearable style="width: 130px">
        <el-option v-for="a in actionOptions" :key="a" :label="a" :value="a" />
      </el-select>
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>查询
      </el-button>
      <el-button @click="handleReset">
        <el-icon><Refresh /></el-icon>重置
      </el-button>
    </div>

    <!-- 日志表格 -->
    <el-table :data="logList" v-loading="loading" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="module" label="操作模块" min-width="110">
        <template #default="{ row }">
          <el-tag>{{ (row as OperationLogVO).module }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作类型" min-width="100" />
      <el-table-column prop="targetId" label="目标ID" width="100">
        <template #default="{ row }">
          {{ (row as OperationLogVO).targetId ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="请求IP" width="140" />
      <el-table-column prop="createdAt" label="操作时间" width="180" />
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
  </div>
</template>

<style scoped lang="less">
.log-page {
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