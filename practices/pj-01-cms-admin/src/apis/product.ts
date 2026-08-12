import { get, post, put, del } from '@/utils/http'
import type { ProductVO, ProductReq, PageResult } from '@/types/api'

export const productApi = {
  /** GET /api/v1/products - 分页查询产品 */
  page(params: Record<string, unknown>) {
    return get<PageResult<ProductVO>>('/api/v1/products', params)
  },

  /** GET /api/v1/products/{id} - 获取产品详情 */
  getById(id: number) {
    return get<ProductVO>(`/api/v1/products/${id}`)
  },

  /** POST /api/v1/products - 新增产品 */
  create(data: ProductReq) {
    return post<ProductVO>('/api/v1/products', data)
  },

  /** PUT /api/v1/products/{id} - 更新产品 */
  update(id: number, data: ProductReq) {
    return put<ProductVO>(`/api/v1/products/${id}`, data)
  },

  /** DELETE /api/v1/products/{id} - 删除产品 */
  delete(id: number) {
    return del(`/api/v1/products/${id}`)
  },
}