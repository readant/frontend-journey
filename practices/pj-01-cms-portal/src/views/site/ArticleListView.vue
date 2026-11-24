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
const keyword = ref('')

async function fetchData() {
  loading.value = true
  try {
    const res = await siteApi.articlePage({
      pageNum: pageNum.value,
      pageSize,
      categoryId: activeCategory.value,
      keyword: keyword.value || undefined,
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

// 顶栏点击栏目链接会携带 categoryId，搜索会携带 keyword，这里统一同步到页面状态
function syncQuery() {
  const id = Number(route.query.categoryId)
  activeCategory.value = Number.isNaN(id) ? undefined : id
  const kw = route.query.keyword
  keyword.value = typeof kw === 'string' ? kw.trim() : ''
  pageNum.value = 1
}

function handleCategorySelect(id?: number) {
  activeCategory.value = id
  pageNum.value = 1
  const query: Record<string, string> = {}
  if (id) query.categoryId = String(id)
  if (keyword.value) query.keyword = keyword.value
  // 查询参数变化由下方 watch 统一触发加载，避免双重请求
  router.replace({ path: '/articles', query })
}

function clearSearch() {
  keyword.value = ''
  const query: Record<string, string> = {}
  if (activeCategory.value) query.categoryId = String(activeCategory.value)
  router.replace({ path: '/articles', query })
}

function handlePageChange(page: number) {
  pageNum.value = page
  fetchData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function coverStyle(url?: string) {
  return url ? { backgroundImage: `url(${url})` } : {}
}

onMounted(() => {
  syncQuery()
  fetchCategories()
  fetchData()
})

// 顶栏通过 router.push 导航时 route.query 变化，需重新加载
watch(
  () => [route.query.categoryId, route.query.keyword],
  () => {
    if (route.path !== '/articles') return
    syncQuery()
    fetchData()
  },
)
</script>

<template>
  <div class="article-list" v-loading="loading">
    <div class="page-hero">
      <h2>文章列表</h2>
      <p>雄心工作室的技术笔记与项目复盘</p>
    </div>

    <div class="list-body page-shell">
      <!-- 搜索结果条：关键词来自页眉搜索框 -->
      <div v-if="keyword" class="search-bar">
        <span class="search-label">SEARCH</span>
        <span class="search-kw">“{{ keyword }}”</span>
        <span class="search-count">共 {{ total }} 篇</span>
        <button class="search-clear" type="button" @click="clearSearch">清除</button>
      </div>

      <!-- 栏目筛选 -->
      <div class="filter-bar">
        <el-button
          :type="activeCategory === undefined ? 'primary' : 'default'"
          size="small"
          @click="handleCategorySelect()"
        >
          全部
        </el-button>
        <el-button
          v-for="item in categories"
          :key="item.id"
          :type="activeCategory === item.id ? 'primary' : 'default'"
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
          <div class="article-cover media-ink" :style="coverStyle(item.coverImage)">
            <span v-if="!item.coverImage" class="media-glyph">{{ item.title.slice(0, 1) }}</span>
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

      <el-empty v-else :description="keyword ? `没有找到与「${keyword}」相关的文章` : '暂无文章'" />

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
  padding-top: 40px;
  padding-bottom: 64px;
}

.search-bar {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
  border: 1px solid var(--app-border);
  border-left: 2px solid var(--app-accent);

  .search-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.24em;
    color: var(--app-text-3);
  }

  .search-kw {
    font-size: 15px;
    color: var(--app-text);
  }

  .search-count {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--app-text-3);
  }

  .search-clear {
    margin-left: auto;
    padding: 2px 10px;
    font-family: inherit;
    font-size: 12px;
    color: var(--app-text-2);
    background: transparent;
    border: 1px solid var(--app-border);
    border-radius: 0;
    cursor: pointer;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      color: var(--app-accent);
      border-color: var(--app-accent);
    }
  }
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  overflow: hidden;
  background-color: var(--ink-700);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-card:hover .article-cover {
  transform: scale(1.03);
}

.article-body {
  padding: 18px;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--app-text);
  margin: 0 0 8px;
  /* 标题最多两行：单行 nowrap 会把长标题直接截断，
     文章标题是这类卡片里信息量最大的部分，不该被省略号吃掉。 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .article-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>