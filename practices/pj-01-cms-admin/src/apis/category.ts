import { get, post, put, del } from '@/utils/http'
import type { CategoryVO, CategoryReq } from '@/types/api'

export const categoryApi = {
  /** GET /api/v1/categories/tree - 获取栏目树 */
  tree() {
    return get<CategoryVO[]>('/api/v1/categories/tree')
  },

  /** POST /api/v1/categories - 新增栏目 */
  create(data: CategoryReq) {
    return post<CategoryVO>('/api/v1/categories', data)
  },

  /** PUT /api/v1/categories/{id} - 更新栏目 */
  update(id: number, data: CategoryReq) {
    return put<CategoryVO>(`/api/v1/categories/${id}`, data)
  },

  /** DELETE /api/v1/categories/{id} - 删除栏目 */
  delete(id: number) {
    return del(`/api/v1/categories/${id}`)
  },
}