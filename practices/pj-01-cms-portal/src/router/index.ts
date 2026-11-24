import { createRouter, createWebHistory } from 'vue-router'
import { setPageMeta } from '@/utils/meta'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  /* 换页时必须自己管滚动位置。
     浏览器默认会保留上一个页面的 scrollY，从首页底部点进列表页就会"落在半路"，
     看起来像页面没加载好。后退时则还原历史位置，符合预期。 */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96 }
    return { top: 0 }
  },

  routes: [
    {
      // 前台门户：公开访问，无需登录
      path: '/',
      component: () => import('@/layout/FrontLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/site/HomeView.vue'),
          meta: {
            title: '首页',
            description: '雄心工作室官方网站：技术文章、作品与团队动态',
          },
        },
        {
          path: 'articles',
          name: 'site-articles',
          component: () => import('@/views/site/ArticleListView.vue'),
          meta: {
            title: '文章列表',
            description: '全部技术文章：按栏目浏览，支持标题与摘要关键词搜索',
          },
        },
        {
          path: 'articles/:id',
          name: 'site-article-detail',
          component: () => import('@/views/site/ArticleDetailView.vue'),
          // 描述由详情页在数据到达后按文章摘要动态覆盖
          meta: { title: '文章详情' },
        },
        {
          path: 'products',
          name: 'site-products',
          component: () => import('@/views/site/ProductListView.vue'),
          meta: {
            title: '作品列表',
            description: '雄心工作室作品列表：工具、书籍与开源项目',
          },
        },
        {
          path: 'products/:id',
          name: 'site-product-detail',
          component: () => import('@/views/site/ProductDetailView.vue'),
          meta: { title: '作品详情' },
        },
      ],
    },
  ],
})

// 标题与描述兜底；详情页在数据到达后用 setPageMeta 覆盖为动态值
router.afterEach((to) => {
  setPageMeta((to.meta.title as string) || '', to.meta.description as string | undefined)
})

export default router