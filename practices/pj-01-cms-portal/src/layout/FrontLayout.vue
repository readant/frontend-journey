<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { CategoryVO } from '@/types/api'

const router = useRouter()
const route = useRoute()

interface NavItem {
  path: string
  title: string
  categoryId?: number
}

const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3002'

const categories = ref<CategoryVO[]>([])
const navList = ref<NavItem[]>([])
const scrolled = ref(false)

// 顶部只在中段滚出后才落底色，首屏保持通透
function handleScroll() {
  scrolled.value = window.scrollY > 8
}

function isActive(item: NavItem) {
  if (item.path === '/') return route.path === '/'
  if (item.categoryId != null) {
    return route.path === '/articles' && String(route.query.categoryId) === String(item.categoryId)
  }
  return route.path.startsWith(item.path)
}

function openAdmin() {
  window.open(adminUrl, '_blank')
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  try {
    const tree = await siteApi.categories()
    categories.value = tree.filter((item) => item.status === 1)
    navList.value = [
      { path: '/', title: '首页' },
      ...categories.value.map((item) => ({
        path: `/articles?categoryId=${item.id}`,
        title: item.name,
        categoryId: item.id,
      })),
      { path: '/articles', title: '全部文章' },
      { path: '/products', title: '作品' },
    ]
  } catch {
    // 栏目加载失败不阻塞页面渲染，退化为固定入口
    navList.value = [
      { path: '/', title: '首页' },
      { path: '/articles', title: '全部文章' },
      { path: '/products', title: '作品' },
    ]
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="front-layout">
    <header class="site-header" :class="{ 'is-scrolled': scrolled }">
      <div class="header-inner">
        <div class="logo" @click="router.push('/')">
          <span class="logo-mark">雄</span>
          <span class="logo-text">
            <strong>雄心工作室</strong>
            <em>XIONGXIN STUDIO</em>
          </span>
        </div>

        <nav class="site-nav">
          <router-link
            v-for="item in navList"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ 'is-active': isActive(item) }"
          >
            {{ item.title }}
          </router-link>
        </nav>

        <button class="admin-entry" type="button" @click="openAdmin">
          <span>管理后台</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11L11 1M11 1H4.2M11 1V7.8" stroke="currentColor" stroke-width="1.1" />
          </svg>
        </button>
      </div>
    </header>

    <main class="site-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col footer-about">
          <div class="footer-logo">
            <span class="footer-mark">雄</span>
            <strong>雄心工作室</strong>
          </div>
          <p>
            由学生自主组建的创新团队，覆盖开发、竞赛与内容输出。我们把想法做成能上线的作品，也让每一次尝试都留下可追溯的记录。
          </p>
        </div>

        <div class="footer-col">
          <h4>导航</h4>
          <ul>
            <li v-for="item in navList" :key="item.path" @click="router.push(item.path)">
              {{ item.title }}
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>联络</h4>
          <ul>
            <li>邮箱 contact@xiongxin.dev</li>
            <li>纳新 每学期初开放</li>
            <li>分享 每周六 14:00</li>
          </ul>
        </div>
      </div>

      <div class="footer-bar">
        <p>© {{ new Date().getFullYear() }} 雄心工作室</p>
        <p class="footer-mono">XIONGXIN STUDIO</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* ---------- 页眉 ---------- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background-color 0.4s ease,
    border-color 0.4s ease;

  &.is-scrolled {
    background: rgba(8, 9, 11, 0.9);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom-color: @line;
  }
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  height: 76px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;

  .logo-mark {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid @line-strong;
    font-family: @font-serif;
    font-size: 15px;
    line-height: 1;
    color: @text-1;
    transition:
      border-color 0.3s ease,
      color 0.3s ease;
  }

  &:hover .logo-mark {
    border-color: @glow;
    color: @glow;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    gap: 3px;

    strong {
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.18em;
      color: @text-1;
      line-height: 1;
    }

    em {
      font-family: @font-mono;
      font-style: normal;
      font-size: 9px;
      letter-spacing: 0.26em;
      color: @text-3;
      line-height: 1;
    }
  }
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: auto;
  margin-right: auto;
}

.nav-item {
  position: relative;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: @text-2;
  text-decoration: none;
  padding: 4px 0;
  white-space: nowrap;
  transition: color 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3px;
    height: 1px;
    background: @glow;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    color: @text-1;
  }

  &.is-active {
    color: @text-1;

    &::after {
      transform: scaleX(1);
    }
  }
}

.admin-entry {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  font-family: inherit;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: @text-2;
  background: transparent;
  border: 1px solid @line-strong;
  cursor: pointer;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;

  &:hover {
    color: @text-1;
    border-color: @glow;
    background: @glow-dim;
  }
}

.site-main {
  flex: 1;
}

/* ---------- 页脚 ---------- */
.site-footer {
  background: @ink-950;
  border-top: 1px solid @line;
  color: @text-2;
  font-size: 13px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 32px 56px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 64px;
}

.footer-col {
  h4 {
    font-family: @font-mono;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.24em;
    color: @text-2;
    margin: 0 0 20px;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      cursor: pointer;
      color: @text-2;
      transition: color 0.25s ease;

      &:hover {
        color: @text-1;
      }
    }
  }
}

.footer-about {
  p {
    line-height: 2;
    margin: 18px 0 0;
    max-width: 460px;
    color: @text-2;
  }
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;

  .footer-mark {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid @line-strong;
    font-family: @font-serif;
    font-size: 14px;
    line-height: 1;
    color: @text-1;
  }

  strong {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.16em;
    color: @text-1;
  }
}

.footer-bar {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 32px;
  border-top: 1px solid @line;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    margin: 0;
    font-size: 12px;
    color: @text-3;
  }

  .footer-mono {
    font-family: @font-mono;
    font-size: 10px;
    letter-spacing: 0.24em;
  }
}

@media (max-width: 900px) {
  /* 窄屏页眉折成两行后高度接近 140px，再 sticky 会长期吃掉 1/6 屏幕，
     正文可读区被压得很扁。改为随页面滚走，需要导航时向上滑一下即可。 */
  .site-header {
    position: static;
  }

  .header-inner {
    height: auto;
    padding: 14px 20px 0;
    flex-wrap: wrap;
    gap: 14px;
  }

  .site-nav {
    order: 3;
    width: 100%;
    min-width: 0;
    margin: 0;
    gap: 22px;
    padding-bottom: 12px;
    overflow-x: auto;
    /* 横向滑动不外溢到页面，避免触发浏览器的边缘手势 */
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .admin-entry {
    margin-left: auto;
  }

  .footer-inner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 20px 40px;
  }

  .footer-bar {
    padding: 18px 20px;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

/* 手机竖屏：导航改为换行，不再横向滑动。
   横滑容器会把后两项藏在屏幕外、又没有滚动条提示，用户根本找不到。 */
@media (max-width: 600px) {
  .site-nav {
    flex-wrap: wrap;
    gap: 10px 18px;
    overflow-x: visible;
  }

  .nav-item {
    font-size: 12.5px;
    letter-spacing: 0.06em;
  }

  .header-inner {
    gap: 12px;
  }
}
</style>
