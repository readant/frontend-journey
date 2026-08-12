import { get } from '@/utils/http'
import type { ArticleVO, CategoryVO, PageResult, ProductVO } from '@/types/api'

/** 首页聚合数据：栏目树 + 最新文章 + 最新产品 */
export interface SiteHomeVO {
  categories: CategoryVO[]
  latestArticles: ArticleVO[]
  latestProducts: ProductVO[]
}

export const siteApi = {
  /** GET /api/v1/site/home - 首页聚合数据（免鉴权） */
  home() {
    return get<SiteHomeVO>('/api/v1/site/home')
  },

  /** GET /api/v1/site/categories - 栏目树（免鉴权） */
  categories() {
    return get<CategoryVO[]>('/api/v1/site/categories')
  },

  /** GET /api/v1/site/articles - 已发布文章分页（免鉴权） */
  articlePage(params: { pageNum?: number; pageSize?: number; categoryId?: number }) {
    return get<PageResult<ArticleVO>>('/api/v1/site/articles', params)
  },

  /** GET /api/v1/site/articles/{id} - 文章详情（免鉴权） */
  articleDetail(id: number) {
    return get<ArticleVO>(`/api/v1/site/articles/${id}`)
  },

  /** GET /api/v1/site/products - 产品分页（免鉴权） */
  productPage(params: { pageNum?: number; pageSize?: number; categoryId?: number }) {
    return get<PageResult<ProductVO>>('/api/v1/site/products', params)
  },

  /** GET /api/v1/site/products/{id} - 产品详情（免鉴权） */
  productDetail(id: number) {
    return get<ProductVO>(`/api/v1/site/products/${id}`)
  },
}