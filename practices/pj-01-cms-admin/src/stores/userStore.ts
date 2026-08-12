import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/apis/admin'
import type { AdminVO, LoginReq } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  // --- State ---
  const token = ref(localStorage.getItem('access_token') || '')
  const userInfo = ref<AdminVO | null>(null)

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.nickname || userInfo.value?.username || '管理员')

  // --- Actions ---
  async function login(data: LoginReq) {
    const res = await adminApi.login(data)
    token.value = res.token
    userInfo.value = res.admin
    localStorage.setItem('access_token', res.token)
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('access_token')
  }

  return { token, userInfo, isLoggedIn, username, login, logout }
})