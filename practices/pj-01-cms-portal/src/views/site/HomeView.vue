<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { ArticleVO, CategoryVO, ProductVO } from '@/types/api'

const router = useRouter()

const loading = ref(false)
const categories = ref<CategoryVO[]>([])
const latestArticles = ref<ArticleVO[]>([])
const latestProducts = ref<ProductVO[]>([])

// 无封面图时的占位图（渐变底色，避免破图）
function coverStyle(url?: string) {
  return url ? { backgroundImage: `url(${url})` } : { backgroundColor: '#d9e8ff' }
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await siteApi.home()
    categories.value = data.categories.filter((item) => item.status === 1)
    latestArticles.value = data.latestArticles
    latestProducts.value = data.latestProducts
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home" v-loading="loading">
    <!-- Hero 区 -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">兴华学习小组</h1>
        <p class="hero-subtitle">用代码点亮学习之路，让每一次成长都有迹可循</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" round @click="router.push('/articles')">
            浏览文章
          </el-button>
          <el-button size="large" round @click="router.push('/products')">查看产品</el-button>
        </div>
      </div>
    </section>

    <!-- 栏目入口 -->
    <section class="section">
      <h2 class="section-title">内容栏目</h2>
      <div class="category-grid">
        <el-card
          v-for="item in categories"
          :key="item.id"
          class="category-card"
          shadow="hover"
          @click="router.push({ path: '/articles', query: { categoryId: item.id } })"
        >
          <h3>{{ item.name }}</h3>
          <p v-if="item.children?.length" class="category-children">
            {{ item.children.map((c) => c.name).join(' · ') }}
          </p>
        </el-card>
        <el-card v-if="!categories.length" class="category-card empty" shadow="never">
          <p>暂无栏目</p>
        </el-card>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">最新文章</h2>
        <el-link type="primary" @click="router.push('/articles')">更多文章</el-link>
      </div>
      <div class="article-grid">
        <el-card
          v-for="item in latestArticles"
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
        <el-card v-if="!latestArticles.length" class="empty-card" shadow="never">
          <p>暂无文章</p>
        </el-card>
      </div>
    </section>

    <!-- 最新产品 -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">最新产品</h2>
        <el-link type="primary" @click="router.push('/products')">更多产品</el-link>
      </div>
      <div class="product-grid">
        <el-card
          v-for="item in latestProducts"
          :key="item.id"
          class="product-card"
          shadow="hover"
          @click="router.push(`/products/${item.id}`)"
        >
          <div class="product-cover" :style="coverStyle(item.coverImage)">
            <span v-if="!item.coverImage" class="cover-text">{{ item.name.slice(0, 1) }}</span>
          </div>
          <div class="product-body">
            <h3 class="product-name">{{ item.name }}</h3>
            <div class="product-price">¥{{ item.price }}</div>
          </div>
        </el-card>
        <el-card v-if="!latestProducts.length" class="empty-card" shadow="never">
          <p>暂无产品</p>
        </el-card>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
.home {
  min-height: 100%;
}

// Hero 区
.hero {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: #fff;
  padding: 80px 24px;
  text-align: center;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 16px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 32px;
}

// 通用 section
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
}

.section-head .section-title {
  margin-bottom: 0;
}

// 栏目卡片
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.category-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  h3 {
    font-size: 18px;
    margin: 0;
    color: #333;
  }

  &.empty p {
    color: #999;
    margin: 0;
  }
}

.category-children {
  margin: 8px 0 0;
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 文章卡片
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
  height: 160px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-text {
  font-size: 40px;
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

// 产品卡片
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.product-cover {
  height: 160px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-body {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  margin-left: 8px;
}

// 空状态
.empty-card {
  grid-column: 1 / -1;

  p {
    text-align: center;
    color: #999;
    margin: 0;
  }
}
</style>