<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { siteApi } from '@/apis/site'
import type { ArticleVO, CategoryVO, ProductVO } from '@/types/api'
import figureNight from '@/assets/visuals/figure-night.webp'

const loading = ref(false)
const categories = ref<CategoryVO[]>([])
const latestArticles = ref<ArticleVO[]>([])
const latestProducts = ref<ProductVO[]>([])

// 首页只陈列一行精选，凑不满整行会留下突兀的空格
const featuredWorks = computed(() => latestProducts.value.slice(0, 4))

// 编号统一两位，形成档案感
function pad(n: number) {
  return String(n).padStart(2, '0')
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
  <div class="home" v-loading="loading" element-loading-background="rgba(8, 9, 11, 0.72)">
    <!-- ==================== 首屏 ==================== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <div class="hero-eyebrow">
            <span class="eyebrow-line"></span>
            <span class="eyebrow-text">雄心工作室 · 学生创新团队</span>
          </div>

          <h1 class="hero-title">
            <span class="title-line">把想法</span>
            <span class="title-line title-line--indent">做成作品</span>
          </h1>

          <p class="hero-desc">
            从需求到上线，我们用真实项目验证每一个想法，也把过程完整地记录下来。
          </p>

          <div class="hero-actions">
            <router-link to="/products" class="btn btn-solid">
              <span>查看作品</span>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h11M7.5 2.5L12 7l-4.5 4.5" stroke="currentColor" stroke-width="1.1" />
              </svg>
            </router-link>
            <router-link to="/articles" class="btn btn-line">阅读记录</router-link>
          </div>
        </div>

        <div class="hero-figure" aria-hidden="true">
          <img :src="figureNight" alt="" />
          <span class="figure-tag">XIONGXIN / 2026</span>
        </div>
      </div>

      <div class="hero-stats">
        <div class="stat">
          <strong>{{ pad(categories.length) }}</strong>
          <span>作品方向</span>
        </div>
        <div class="stat">
          <strong>{{ pad(latestArticles.length) }}</strong>
          <span>近期记录</span>
        </div>
        <div class="stat">
          <strong>{{ pad(latestProducts.length) }}</strong>
          <span>近期作品</span>
        </div>
      </div>
    </section>

    <!-- ==================== 栏目 ==================== -->
    <section id="columns" class="section">
      <header class="section-head">
        <div class="head-left">
          <span class="section-no">01</span>
          <h2 class="section-title">内容栏目</h2>
        </div>
        <span class="section-en">COLUMNS</span>
      </header>

      <div class="category-grid">
        <router-link
          v-for="(item, index) in categories"
          :key="item.id"
          :to="{ path: '/articles', query: { categoryId: item.id } }"
          class="category-item"
        >
          <div class="cat-top">
            <span class="cat-no">{{ pad(index + 1) }}</span>
            <span class="cat-arrow" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h11M7.5 2.5L12 7l-4.5 4.5" stroke="currentColor" stroke-width="1" />
              </svg>
            </span>
          </div>
          <h3 class="cat-name">{{ item.name }}</h3>
          <p v-if="item.children?.length" class="cat-sub">
            {{ item.children.map((c) => c.name).join(' / ') }}
          </p>
          <span class="cat-mark" aria-hidden="true">{{ item.name.slice(0, 1) }}</span>
        </router-link>

        <div v-if="!categories.length" class="empty-block">暂无栏目</div>
      </div>
    </section>

    <!-- ==================== 最新记录 ==================== -->
    <section id="writing" class="section section--split">
      <aside class="split-aside">
        <span class="section-no">02</span>
        <h2 class="section-title">最新记录</h2>
        <span class="section-en">WRITING</span>
        <router-link to="/articles" class="more-link">全部记录</router-link>
      </aside>

      <div class="article-list">
        <router-link
          v-for="(item, index) in latestArticles"
          :key="item.id"
          :to="`/articles/${item.id}`"
          class="article-row"
        >
          <span class="row-index">{{ pad(index + 1) }}</span>
          <div class="row-main">
            <h3 class="row-title">{{ item.title }}</h3>
            <p class="row-summary">{{ item.summary || '暂无摘要' }}</p>
          </div>
          <div class="row-meta">
            <span v-if="item.categoryName" class="row-cat">{{ item.categoryName }}</span>
            <time class="row-date">{{ item.createdAt?.slice(0, 10) }}</time>
          </div>
        </router-link>

        <div v-if="!latestArticles.length" class="empty-block">暂无记录</div>
      </div>
    </section>

    <!-- ==================== 精选作品 ==================== -->
    <section id="works" class="section">
      <header class="section-head">
        <div class="head-left">
          <span class="section-no">03</span>
          <h2 class="section-title">精选作品</h2>
        </div>
        <router-link to="/products" class="more-link">全部作品</router-link>
      </header>

      <div class="work-grid">
        <router-link
          v-for="(item, index) in featuredWorks"
          :key="item.id"
          :to="`/products/${item.id}`"
          class="work-item"
        >
          <div class="work-cover">
            <img v-if="item.coverImage" :src="item.coverImage" :alt="item.name" loading="lazy" />
            <span v-else class="cover-glyph">{{ item.name.slice(0, 1) }}</span>
            <span class="work-no">{{ pad(index + 1) }}</span>
          </div>
          <div class="work-info">
            <h3 class="work-name">{{ item.name }}</h3>
            <p v-if="item.description" class="work-desc">{{ item.description }}</p>
          </div>
        </router-link>

        <div v-if="!featuredWorks.length" class="empty-block">暂无作品</div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.home {
  position: relative;
}

/* ==================== 首屏 ==================== */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  /* dvh 对齐移动端浏览器实际可视区；100vh 会让首屏多出一截、滚动时地址栏收放导致跳动 */
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  /* 必须给不透明底色：父级带 z-index 形成了隔离组，
     没有不透明 backdrop 时 lighten 混合会退化成普通绘制。 */
  background: @ink-900;
  border-bottom: 1px solid @line;
  overflow: hidden;
}

.hero-inner {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.76fr);
  align-items: center;
  gap: 56px;
}

.hero-copy {
  animation: rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 38px;

  .eyebrow-line {
    width: 44px;
    height: 1px;
    background: @glow;
  }

  .eyebrow-text {
    font-size: 11px;
    letter-spacing: 0.26em;
    color: @text-3;
  }
}

.hero-title {
  display: flex;
  flex-direction: column;
  font-family: @font-serif;
  font-size: clamp(46px, 6vw, 86px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.07em;
  color: @text-1;
  margin: 0;

  .title-line--indent {
    padding-left: 1.05em;
  }
}

.hero-desc {
  max-width: 520px;
  margin: 34px 0 0;
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.07em;
  color: @text-2;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 50px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  font-size: 13px;
  letter-spacing: 0.16em;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.btn-solid {
  background: @text-1;
  border-color: @text-1;
  color: @ink-950;

  &:hover {
    background: @glow;
    border-color: @glow;
    color: @ink-950;
  }
}

.btn-line {
  color: @text-2;
  border-color: @line-strong;

  &:hover {
    color: @text-1;
    border-color: @glow;
    background: @glow-dim;
  }
}

/* 人物竖幅
   素材底色采样为 R3 G3 B2，页面底色为 R8 G9 B11，差值足以让整块图显形。
   用 lighten 混合取每通道较大值，底色恰好被抬到与页面一致，矩形边界消失；
   （screen 会把暗部提亮，反而更明显，不要用。）
   容器比例比原图略扁，object-position: top 把底部那条生成工具标识裁掉。 */
.hero-figure {
  position: relative;
  justify-self: end;
  align-self: center;
  height: min(66vh, 640px);
  aspect-ratio: 1024 / 1400;
  max-width: 100%;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    mix-blend-mode: lighten;
  }

  /* 右侧压边：人物衣袖会顶到容器边界，需要收一道 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 16%;
    z-index: 2;
    pointer-events: none;
    background: linear-gradient(
      to right,
      fade(@ink-900, 0%) 0%,
      fade(@ink-900, 55%) 62%,
      @ink-900 100%
    );
  }

  /* 底部柔和收进底色，避免裁切处留下一条硬边 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30%;
    z-index: 2;
    pointer-events: none;
    background: linear-gradient(
      to top,
      @ink-900 0%,
      fade(@ink-900, 92%) 28%,
      fade(@ink-900, 52%) 58%,
      fade(@ink-900, 0%) 100%
    );
  }

  .figure-tag {
    position: absolute;
    right: -30px;
    bottom: 20%;
    z-index: 3;
    writing-mode: vertical-rl;
    font-family: @font-mono;
    font-size: 9px;
    letter-spacing: 0.36em;
    color: @text-3;
  }
}

/* 首屏底部数据条 */
.hero-stats {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid @line;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 26px 24px 26px 0;

  & + .stat {
    padding-left: 32px;
    border-left: 1px solid @line;
  }

  strong {
    font-family: @font-mono;
    font-size: 30px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.02em;
    color: @text-1;
  }

  span {
    font-size: 11px;
    letter-spacing: 0.24em;
    color: @text-3;
  }
}

/* ==================== 通用区块 ==================== */
.section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 104px 32px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid @line;
  margin-bottom: 40px;
}

.head-left {
  display: flex;
  align-items: baseline;
  gap: 18px;
}

.section-no {
  font-family: @font-mono;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: @glow;
}

.section-title {
  font-family: @font-serif;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: @text-1;
  margin: 0;
}

.section-en {
  font-family: @font-mono;
  font-size: 10px;
  letter-spacing: 0.32em;
  color: @text-3;
}

.more-link {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: @text-2;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 1px solid @line-strong;
  transition:
    color 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    color: @glow;
    border-color: @glow;
  }
}

/* ==================== 栏目：连成一片的网格 ==================== */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid @line;
  border-left: 1px solid @line;
}

.category-item {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 176px;
  padding: 26px 24px;
  overflow: hidden;
  border-right: 1px solid @line;
  border-bottom: 1px solid @line;
  text-decoration: none;
  background: transparent;
  transition: background-color 0.35s ease;

  /* 顶部一根冷蓝细线：hover 时从左展开，代替"整块变亮"的廉价反馈 */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: @glow;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    background: @ink-800;

    &::before {
      transform: scaleX(1);
    }

    .cat-no {
      color: @glow;
    }

    .cat-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .cat-mark {
      color: rgba(255, 255, 255, 0.07);
    }
  }
}

/* 栏目没有配图，用首字做半透明字模压住右下角，
   否则四张等高的空盒子在长页面上会显得没做完 */
.cat-mark {
  position: absolute;
  right: 14px;
  bottom: -6px;
  font-family: @font-serif;
  font-size: 76px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.035);
  pointer-events: none;
  user-select: none;
  transition: color 0.45s ease;
}

.cat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cat-no {
  font-family: @font-mono;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: @text-3;
  transition: color 0.3s ease;
}

.cat-arrow {
  display: inline-flex;
  color: @glow;
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.cat-name {
  font-family: @font-serif;
  font-size: 19px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: @text-1;
  margin: auto 0 8px;
}

.cat-sub {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: @text-3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==================== 最新记录：左标题 + 右行列表 ==================== */
.section--split {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 72px;
  align-items: start;
}

.split-aside {
  position: sticky;
  top: 108px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .section-title {
    font-size: 30px;
  }

  .more-link {
    margin-top: 16px;
    align-self: flex-start;
  }
}

.article-list {
  border-top: 1px solid @line;
}

.article-row {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 132px;
  gap: 24px;
  align-items: center;
  padding: 26px 0;
  border-bottom: 1px solid @line;
  text-decoration: none;
  transition:
    padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.4s ease;

  &:hover {
    padding-left: 14px;
    background: @ink-800;

    .row-index {
      color: @glow;
    }

    .row-title {
      color: @glow;
    }
  }
}

.row-index {
  font-family: @font-mono;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: @text-3;
  transition: color 0.3s ease;
}

.row-title {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: @text-1;
  margin: 0 0 9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.row-summary {
  font-size: 12px;
  line-height: 1.8;
  color: @text-3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.row-cat {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: @text-2;
}

.row-date {
  font-family: @font-mono;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: @text-3;
}

/* ==================== 作品：缝隙即为分割线 ==================== */
.work-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: @line;
  border: 1px solid @line;
}

.work-item {
  display: block;
  background: @ink-900;
  text-decoration: none;
  transition: background-color 0.35s ease;

  &:hover {
    background: @ink-800;

    .work-cover img {
      transform: scale(1.03);
      filter: var(--media-ink-hover);
    }

    .work-name {
      color: @glow;
    }
  }
}

.work-cover {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: @ink-700;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* 封面多为彩色照片，压成近黑白才能与全站单色语言共存 */
    filter: var(--media-ink);
    transition:
      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
      filter 0.5s ease;
  }
}

.cover-glyph {
  font-family: @font-serif;
  font-size: 42px;
  color: rgba(255, 255, 255, 0.14);
  user-select: none;
}

.work-no {
  position: absolute;
  left: 10px;
  bottom: 9px;
  padding: 3px 7px;
  font-family: @font-mono;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.78);
  background: rgba(5, 6, 7, 0.62);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.work-info {
  padding: 18px 18px 22px;
}

.work-name {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: @text-1;
  margin: 0;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work-desc {
  font-size: 11px;
  line-height: 1.8;
  color: @text-3;
  margin: 8px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==================== 空状态 ==================== */
.empty-block {
  grid-column: 1 / -1;
  padding: 56px 0;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: @text-3;
  border-right: 1px solid @line;
  border-bottom: 1px solid @line;
}

/* ==================== 响应式 ==================== */
@media (max-width: 1080px) {
  .hero {
    min-height: auto;
  }

  .hero-inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
    padding-top: 64px;
  }

  .hero-figure {
    justify-self: center;
    height: min(44vh, 380px);
  }

  .section--split {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .split-aside {
    position: static;
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .work-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hero-inner {
    padding: 44px 20px 0;
  }

  .hero-title {
    letter-spacing: 0.05em;

    .title-line--indent {
      padding-left: 0;
    }
  }

  .hero-desc {
    margin-top: 26px;
  }

  .hero-actions {
    margin-top: 36px;
    flex-wrap: wrap;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .stat {
    padding: 16px 0;

    & + .stat {
      padding-left: 0;
      border-left: none;
      border-top: 1px solid @line;
    }

    strong {
      font-size: 24px;
    }
  }

  .section {
    padding: 64px 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .article-row {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 14px;
  }

  .row-meta {
    grid-column: 2;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .category-grid,
  .work-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
