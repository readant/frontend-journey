import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Mindmap from './components/Mindmap.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // 注册思维导图组件
    app.component('Mindmap', Mindmap)

    const setupCodeLabels = () => {
      if (typeof document === 'undefined') return
      const blocks = document.querySelectorAll('.vp-doc div[class*="language-"]')
      blocks.forEach(block => {
        if (block.dataset.lang) return
        const match = block.className.match(/language-([\w-]+)/)
        if (match) {
          block.dataset.lang = match[1]
        }
      })
    }

    router.onAfterPageLoad = () => {
      setTimeout(setupCodeLabels, 100)
    }
  }
}
