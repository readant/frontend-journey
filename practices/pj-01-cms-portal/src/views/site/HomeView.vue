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

// 栏目卡片图标（按 id 轮换，避免千篇一律）
const categoryIcons = ['Notebook', 'Reading', 'VideoPlay', 'DataLine', 'MagicStick', 'Star', 'Collection', 'TrendCharts']

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
      <div class="hero-bg-image" aria-hidden="true"></div>
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-inner rise-in">
        <p class="hero-eyebrow">兴华学习小组 · 企业官网</p>
        <h1 class="hero-title">用代码点亮学习之路</h1>
        <p class="hero-subtitle">让每一次成长都有迹可循，沉淀每一份值得分享的知识</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" round @click="router.push('/articles')">
            浏览文章
          </el-button>
          <el-button size="large" round plain class="hero-btn-secondary" @click="router.push('/products')">
            查看产品
          </el-button>
        </div>
      </div>
      <!-- 数据统计条 -->
      <div class="hero-stats rise-in">
        <div class="stat-item">
          <strong>{{ categories.length }}</strong>
          <span>内容栏目</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <strong>{{ latestArticles.length }}+</strong>
          <span>学习文章</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <strong>{{ latestProducts.length }}+</strong>
          <span>精选产品</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <strong>12</strong>
          <span>小组成员</span>
        </div>
      </div>
    </section>

    <!-- 栏目入口 -->
    <section class="section">
      <h2 class="section-title">内容栏目</h2>
      <div class="category-grid">
        <el-card
          v-for="(item, index) in categories"
          :key="item.id"
          class="category-card hover-card"
          shadow="never"
          @click="router.push({ path: '/articles', query: { categoryId: item.id } })"
        >
          <div class="category-icon">
            <el-icon :size="22"><component :is="categoryIcons[index % categoryIcons.length]" /></el-icon>
          </div>
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
          class="product-card hover-card"
          shadow="never"
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
@import '@/styles/variables.less';

.home {
  min-height: 100%;
}

// Hero 区
.hero {
  position: relative;
  background:
    radial-gradient(1100px 480px at 12% -30%, rgba(109, 93, 246, 0.6), transparent 60%),
    radial-gradient(900px 420px at 88% 130%, rgba(45, 212, 191, 0.4), transparent 60%),
    linear-gradient(135deg, #2f58c4 0%, #3b6ef5 55%, #5a6cf5 100%);
  color: #fff;
  padding: 110px 24px 88px;
  text-align: center;
  overflow: hidden;
}

// 背景实景图（叠加在主色渐变之上，让首屏更像真实官网）
.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=70');
  background-size: cover;
  background-position: center;
  opacity: 0.28;
  pointer-events: none;
}

// 网格纹理 + 光斑装饰
.hero-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.75), transparent 72%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 13px;
  letter-spacing: 3px;
  opacity: 0.85;
  margin: 0 0 20px;
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
}

.hero-title {
  font-size: 46px;
  font-weight: 700;
  margin: 0 0 16px;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 40px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.hero-btn-secondary {
  border-color: rgba(255, 255, 255, 0.6);
  color: #fff;
  background: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: #fff;
    color: #fff;
  }
}

// 数据统计条
.hero-stats {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 44px;
  max-width: 720px;
  margin: 56px auto 0;
  padding: 22px 32px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: var(--app-radius-lg);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation-delay: 0.15s;

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 84px;

    strong {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.2;
    }

    span {
      font-size: 13px;
      opacity: 0.82;
      letter-spacing: 1px;
    }
  }

  .stat-divider {
    width: 1px;
    height: 34px;
    background: rgba(255, 255, 255, 0.22);
  }
}

// 通用 section
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--app-text);
  margin: 0;
  position: relative;
  padding-left: 14px;

  // 左侧主色竖条，强化品牌感
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    border-radius: 2px;
    background: linear-gradient(180deg, @primary-color, @accent-color);
  }
}

// 栏目卡片
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  text-align: center;
  padding: 8px;

  :deep(.el-card__body) {
    padding: 24px 16px;
  }

  h3 {
    font-size: 17px;
    margin: 0;
    color: var(--app-text);
  }

  .category-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin: 0 auto 14px;
    border-radius: 14px;
    font-size: 22px;
    background: var(--app-primary-soft);
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 3px;
    margin: 16px auto 0;
    border-radius: 2px;
    background: linear-gradient(90deg, @primary-color, @accent-color);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 40px;
  }

  &.empty p {
    color: var(--app-text-3);
    margin: 0;
  }
}

.category-children {
  margin: 10px 0 0;
  color: var(--app-text-3);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 文章卡片
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
  height: 168px;
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
  font-size: 44px;
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

// 产品卡片
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.product-cover {
  height: 168px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s ease;
}

.product-card:hover .product-cover {
  transform: scale(1.05);
}

.product-body {
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--app-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: #ef4444;
  font-weight: 700;
  font-size: 17px;
  flex-shrink: 0;
  margin-left: 8px;
}

// 空状态
.empty-card {
  grid-column: 1 / -1;

  p {
    text-align: center;
    color: var(--app-text-3);
    margin: 0;
  }
}

// 响应式
@media (max-width: 992px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 72px 20px 64px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-stats {
    gap: 20px;
    padding: 16px 20px;
    margin-top: 40px;

    .stat-item {
      min-width: 0;

      strong {
        font-size: 20px;
      }

      span {
        font-size: 12px;
      }
    }
  }

  .category-grid,
  .article-grid,
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>