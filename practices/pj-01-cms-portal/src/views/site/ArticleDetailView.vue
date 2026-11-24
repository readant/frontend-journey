<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import { setPageMeta } from '@/utils/meta'
import type { ArticleVO, ArticleNavVO, ArticleBriefVO } from '@/types/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const article = ref<ArticleVO | null>(null)
const nav = ref<ArticleNavVO | null>(null)
const related = ref<ArticleBriefVO[]>([])

async function load() {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  nav.value = null
  related.value = []
  try {
    article.value = await siteApi.articleDetail(id)
    if (article.value) {
      // 动态 meta：标题用文章标题，描述用摘要（搜索引擎与分享卡片）
      setPageMeta(article.value.title, article.value.summary || undefined)
      // 导航与相关文章失败不阻塞正文展示
      siteApi
        .articleNavigation(id)
        .then((res) => (nav.value = res))
        .catch(() => {})
      siteApi
        .articleRelated(id)
        .then((res) => (related.value = res))
        .catch(() => {})
    }
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
  }
}

onMounted(load)

// 上一篇 / 下一篇 / 相关文章都会跳转到本页面同一路由，组件复用时需重新加载
watch(
  () => route.params.id,
  (val, old) => {
    if (val && val !== old) load()
  },
)
</script>

<template>
  <div class="article-detail" v-loading="loading">
    <div class="detail-body">
      <el-page-header class="page-header" content="文章详情" @back="router.back()" />

      <article v-if="article" class="article-content">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <el-tag v-if="article.categoryName" size="small">{{ article.categoryName }}</el-tag>
          <span>作者：{{ article.author || '雄心工作室' }}</span>
          <span>发布于：{{ article.createdAt?.slice(0, 10) }}</span>
          <span>阅读：{{ article.viewCount }}</span>
        </div>
        <img
          v-if="article.coverImage"
          :src="article.coverImage"
          class="article-cover"
          alt="封面图"
        />
        <!-- 后端内容为富文本 HTML，v-html 渲染；内容来自后台管理员发布，风险可控 -->
        <div class="article-content-html" v-html="article.content"></div>
      </article>

      <!-- 上一篇 / 下一篇 -->
      <nav v-if="article && (nav?.prev || nav?.next)" class="article-nav">
        <router-link v-if="nav?.prev" :to="`/articles/${nav.prev.id}`" class="nav-cell">
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">{{ nav.prev.title }}</span>
        </router-link>
        <span v-else class="nav-cell is-empty"></span>
        <router-link v-if="nav?.next" :to="`/articles/${nav.next.id}`" class="nav-cell is-next">
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">{{ nav.next.title }}</span>
        </router-link>
        <span v-else class="nav-cell is-empty"></span>
      </nav>

      <!-- 相关文章 -->
      <section v-if="related.length" class="related">
        <h3 class="related-title">相关文章</h3>
        <ul class="related-list">
          <li v-for="item in related" :key="item.id">
            <router-link :to="`/articles/${item.id}`" class="related-item">
              <span class="related-name">{{ item.title }}</span>
              <span class="related-date">{{ item.createdAt?.slice(0, 10) }}</span>
            </router-link>
          </li>
        </ul>
      </section>

      <el-empty v-else-if="!loading && !article" description="文章不存在或已删除" />
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.article-detail {
  min-height: 100%;
}

.detail-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.page-header {
  margin-bottom: 28px;
}

.article-title {
  font-family: var(--font-serif);
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--app-text);
  margin: 0 0 20px;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--app-text-3);
  font-size: 13px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--app-border);
}

.article-cover {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  border-radius: var(--app-radius);
  margin-bottom: 28px;
  filter: var(--media-ink);
}

// 富文本内容基础排版
.article-content-html {
  line-height: 1.9;
  color: var(--app-text);
  font-size: 15.5px;
  word-break: break-word;

  :deep(img) {
    max-width: 100%;
    border-radius: var(--app-radius-sm);
  }

  :deep(p) {
    margin: 0 0 18px;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 32px 0 14px;
    line-height: 1.4;
  }

  :deep(a) {
    color: @primary-color;
  }

  :deep(pre) {
    background: #1f2733;
    color: #e6eaf2;
    padding: 16px 20px;
    border-radius: var(--app-radius-sm);
    overflow-x: auto;
    line-height: 1.7;
  }

  :deep(code) {
    font-family: 'JetBrains Mono', 'Cascadia Code', Consolas, monospace;
  }

  :deep(blockquote) {
    border-left: 4px solid @primary-color;
    margin: 0 0 18px;
    padding: 12px 20px;
    background: var(--app-primary-soft);
    border-radius: 0 var(--app-radius-sm) var(--app-radius-sm) 0;
    color: var(--app-text-2);
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 18px;

    th,
    td {
      border: 1px solid var(--app-border);
      padding: 10px 14px;
      text-align: left;
    }

    th {
      background: var(--ink-700, #1e2126);
      color: var(--app-text-2);
    }
  }
}

// 上一篇 / 下一篇
.article-nav {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--app-border);
}

.nav-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--app-border);
  text-decoration: none;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: var(--app-accent);

    .nav-title {
      color: var(--app-accent);
    }
  }

  &.is-next {
    text-align: right;
    align-items: flex-end;
  }

  &.is-empty {
    border: none;
    pointer-events: none;
  }

  .nav-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--app-text-3);
  }

  .nav-title {
    font-size: 14px;
    line-height: 1.5;
    color: var(--app-text);
    transition: color 0.25s ease;
  }
}

// 相关文章
.related {
  margin-top: 36px;

  .related-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--app-text);
    margin: 0 0 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--app-border);
  }

  .related-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .related-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 2px;
    border-bottom: 1px solid var(--app-border);
    text-decoration: none;
    transition: color 0.2s ease;

    .related-name {
      font-size: 14px;
      color: var(--app-text-2);
      transition: color 0.2s ease;
    }

    .related-date {
      flex-shrink: 0;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--app-text-3);
    }

    &:hover .related-name {
      color: var(--app-accent);
    }
  }
}
</style>