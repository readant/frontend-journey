import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
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
