import { get } from '@/utils/http'
import type { ProductCategoryVO } from '@/types/api'

export const productCategoryApi = {
  /** GET /api/v1/product-categories/tree - 产品分类树（免鉴权） */
  tree() {
    return get<ProductCategoryVO[]>('/api/v1/product-categories/tree')
  },
}