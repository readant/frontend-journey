<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { ArticleVO } from '@/types/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const article = ref<ArticleVO | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    article.value = await siteApi.articleDetail(Number(route.params.id))
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="article-detail" v-loading="loading">
    <div class="detail-body">
      <el-page-header class="page-header" content="文章详情" @back="router.back()" />

      <article v-if="article" class="article-content">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <el-tag v-if="article.categoryName" size="small">{{ article.categoryName }}</el-tag>
          <span>作者：{{ article.author || '兴华小组' }}</span>
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

      <el-empty v-else-if="!loading" description="文章不存在或已删除" />
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
  font-size: 30px;
  font-weight: 700;
  color: var(--app-text);
  margin: 0 0 20px;
  line-height: 1.4;
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
  box-shadow: var(--app-shadow-sm);
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
      background: #f6f8fc;
    }
  }
}
</style>