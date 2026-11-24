/**
 * 逐页设置标题与描述。
 * 标题拼品牌后缀；描述写入 <meta name="description">，供搜索引擎摘要与分享卡片使用。
 * 路由 afterEach 设置静态兜底值，详情页在数据到达后再覆盖为动态值。
 */
export function setPageMeta(title?: string, description?: string) {
  document.title = title ? `${title} - 雄心工作室` : '雄心工作室'

  if (!description) return
  let el = document.querySelector('meta[name="description"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'description')
    document.head.appendChild(el)
  }
  el.setAttribute('content', description)
}
