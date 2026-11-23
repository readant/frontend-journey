import { createRouter, createWebHistory } from 'vue-router'

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
          meta: { title: '首页' },
        },
        {
          path: 'articles',
          name: 'site-articles',
          component: () => import('@/views/site/ArticleListView.vue'),
          meta: { title: '文章列表' },
        },
        {
          path: 'articles/:id',
          name: 'site-article-detail',
          component: () => import('@/views/site/ArticleDetailView.vue'),
          meta: { title: '文章详情' },
        },
        {
          path: 'products',
          name: 'site-products',
          component: () => import('@/views/site/ProductListView.vue'),
          meta: { title: '产品中心' },
        },
        {
          path: 'products/:id',
          name: 'site-product-detail',
          component: () => import('@/views/site/ProductDetailView.vue'),
          meta: { title: '产品详情' },
        },
      ],
    },
  ],
})

// 页面标题
router.afterEach((to) => {
  const title = (to.meta.title as string) || ''
  document.title = title ? `${title} - 雄心工作室` : '雄心工作室'
})

export default router