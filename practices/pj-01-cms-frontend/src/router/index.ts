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
      path: '/',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/dashboard',
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

// 导航守卫：未登录时跳转登录页
router.beforeEach((to, _from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('access_token')) {
    next('/login')
  } else {
    next()
  }
})

export default router