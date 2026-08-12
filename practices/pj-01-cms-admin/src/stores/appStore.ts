import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // --- State ---
  const sidebarCollapsed = ref(false)
  const breadcrumbList = ref<{ title: string; path?: string }[]>([])

  // --- Actions ---
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setBreadcrumb(list: { title: string; path?: string }[]) {
    breadcrumbList.value = list
  }

  return { sidebarCollapsed, breadcrumbList, toggleSidebar, setBreadcrumb }
})