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
    <div class="page-hero">
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
          class="article-card hover-card"
          shadow="never"
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
@import '@/styles/variables.less';

.article-list {
  min-height: 100%;
}

.list-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 56px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.article-card {
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.article-cover {
  height: 156px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s ease;
}

.article-card:hover .article-cover {
  transform: scale(1.05);
}

.cover-text {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.article-body {
  padding: 18px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--app-text);
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.article-card:hover .article-title {
  color: @primary-color;
}

.article-summary {
  color: var(--app-text-2);
  font-size: 13px;
  line-height: 1.7;
  margin: 0 0 14px;
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
  color: var(--app-text-3);
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 992px) {
  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>