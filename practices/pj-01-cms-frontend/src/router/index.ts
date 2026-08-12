import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      // 前台门户：无需登录，直接访问
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
    {
      // 后台管理系统：需要登录
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: '数据看板' },
        },
        {
          path: 'content/categories',
          name: 'categories',
          component: () => import('@/views/content/CategoryView.vue'),
          meta: { title: '栏目管理' },
        },
        {
          path: 'content/articles',
          name: 'articles',
          component: () => import('@/views/content/ArticleView.vue'),
          meta: { title: '文章管理' },
        },
        {
          path: 'content/products',
          name: 'products',
          component: () => import('@/views/content/ProductView.vue'),
          meta: { title: '产品管理' },
        },
        {
          path: 'system/admins',
          name: 'admins',
          component: () => import('@/views/system/AdminView.vue'),
          meta: { title: '管理员管理' },
        },
        {
          path: 'system/roles',
          name: 'roles',
          component: () => import('@/views/system/RoleView.vue'),
          meta: { title: '角色管理' },
        },
        {
          path: 'system/logs',
          name: 'logs',
          component: () => import('@/views/system/LogView.vue'),
          meta: { title: '操作日志' },
        },
      ],
    },
  ],
})

// 导航守卫：后台页面需要登录，未登录跳转登录页
router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem('access_token')

  // 登录页：已登录则直接进后台
  if (to.path === '/login' && hasToken) {
    next('/admin')
    return
  }

  // 后台页面：无 token 跳转登录
  if (to.path.startsWith('/admin') && !hasToken) {
    next('/login')
    return
  }

  // 前台页面与登录页：放行
  next()
})

export default router