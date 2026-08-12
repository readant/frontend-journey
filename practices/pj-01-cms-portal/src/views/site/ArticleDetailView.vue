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
.article-detail {
  min-height: 100%;
}

.detail-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-header {
  margin-bottom: 24px;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #909399;
  font-size: 13px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.article-cover {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 24px;
}

// 富文本内容基础排版
.article-content-html {
  line-height: 1.8;
  color: #333;
  font-size: 15px;
  word-break: break-word;

  :deep(img) {
    max-width: 100%;
    border-radius: 4px;
  }

  :deep(p) {
    margin: 0 0 16px;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 24px 0 12px;
  }

  :deep(pre) {
    background: #f6f8fa;
    padding: 12px 16px;
    border-radius: 6px;
    overflow-x: auto;
  }

  :deep(blockquote) {
    border-left: 4px solid #409eff;
    margin: 0 0 16px;
    padding: 8px 16px;
    background: #f0f7ff;
    color: #666;
  }
}
</style>