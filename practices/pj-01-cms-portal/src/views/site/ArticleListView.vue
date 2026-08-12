<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { ArticleVO, CategoryVO } from '@/types/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const articles = ref<ArticleVO[]>([])
const categories = ref<CategoryVO[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 9

const activeCategory = ref<number | undefined>(undefined)

async function fetchData() {
  loading.value = true
  try {
    const res = await siteApi.articlePage({
      pageNum: pageNum.value,
      pageSize,
      categoryId: activeCategory.value,
    })
    articles.value = res.records
    total.value = res.total
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
  }
}

function fetchCategories() {
  siteApi.categories().then((tree) => {
    categories.value = tree.filter((item) => item.status === 1)
  })
}

// 顶栏点击栏目链接会携带 categoryId 查询参数，这里同步到选中状态
function syncQuery() {
  const id = Number(route.query.categoryId)
  activeCategory.value = Number.isNaN(id) ? undefined : id
  pageNum.value = 1
}

function handleCategorySelect(id?: number) {
  activeCategory.value = id
  pageNum.value = 1
  router.replace({ path: '/articles', query: id ? { categoryId: id } : {} })
  fetchData()
}

function handlePageChange(page: number) {
  pageNum.value = page
  fetchData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function coverStyle(url?: string) {
  return url ? { backgroundImage: `url(${url})` } : { backgroundColor: '#d9e8ff' }
}

onMounted(() => {
  syncQuery()
  fetchCategories()
  fetchData()
})

// 顶栏通过 router.push 导航时 route.query 变化，需重新加载
watch(
  () => route.query.categoryId,
  () => {
    syncQuery()
    fetchData()
  },
)
</script>

<template>
  <div class="article-list" v-loading="loading">
    <div class="page-banner">
      <h2>文章列表</h2>
      <p>兴华小组的学习笔记与成长记录</p>
    </div>

    <div class="list-body">
      <!-- 栏目筛选 -->
      <div class="filter-bar">
        <el-button
          :type="activeCategory === undefined ? 'primary' : 'default'"
          round
          size="small"
          @click="handleCategorySelect()"
        >
          全部
        </el-button>
        <el-button
          v-for="item in categories"
          :key="item.id"
          :type="activeCategory === item.id ? 'primary' : 'default'"
          round
          size="small"
          @click="handleCategorySelect(item.id)"
        >
          {{ item.name }}
        </el-button>
      </div>

      <!-- 文章卡片 -->
      <div class="article-grid" v-if="articles.length">
        <el-card
          v-for="item in articles"
          :key="item.id"
          class="article-card"
          shadow="hover"
          @click="router.push(`/articles/${item.id}`)"
        >
          <div class="article-cover" :style="coverStyle(item.coverImage)">
            <span v-if="!item.coverImage" class="cover-text">{{ item.title.slice(0, 1) }}</span>
          </div>
          <div class="article-body">
            <h3 class="article-title">{{ item.title }}</h3>
            <p class="article-summary">{{ item.summary || '暂无摘要' }}</p>
            <div class="article-meta">
              <el-tag v-if="item.categoryName" size="small">{{ item.categoryName }}</el-tag>
              <span class="article-date">{{ item.createdAt?.slice(0, 10) }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="暂无文章" />

      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.article-list {
  min-height: 100%;
}

.page-banner {
  background: linear-gradient(135deg, #337ecc 0%, #409eff 100%);
  color: #fff;
  padding: 48px 24px;
  text-align: center;

  h2 {
    font-size: 28px;
    margin: 0 0 8px;
  }

  p {
    opacity: 0.9;
    margin: 0;
  }
}

.list-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.article-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.article-cover {
  height: 150px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-text {
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.article-body {
  padding: 16px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-summary {
  color: #909399;
  font-size: 13px;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-date {
  color: #c0c4cc;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>