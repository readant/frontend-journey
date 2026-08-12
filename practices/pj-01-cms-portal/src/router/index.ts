import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  document.title = title ? `${title} - 兴华小组官网` : '兴华小组官网'
})

export default router