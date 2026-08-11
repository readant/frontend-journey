import { get, post, put, del } from '@/utils/http'
import type { ArticleVO, ArticleReq, PageResult } from '@/types/api'

export const articleApi = {
  /** GET /api/v1/articles - 分页查询文章 */
  page(params: Record<string, unknown>) {
    return get<PageResult<ArticleVO>>('/api/v1/articles', params)
  },

  /** GET /api/v1/articles/{id} - 获取文章详情 */
  getById(id: number) {
    return get<ArticleVO>(`/api/v1/articles/${id}`)
  },

  /** POST /api/v1/articles - 新增文章 */
  create(data: ArticleReq) {
    return post<ArticleVO>('/api/v1/articles', data)
  },

  /** PUT /api/v1/articles/{id} - 更新文章 */
  update(id: number, data: ArticleReq) {
    return put<ArticleVO>(`/api/v1/articles/${id}`, data)
  },

  /** DELETE /api/v1/articles/{id} - 删除文章 */
  delete(id: number) {
    return del(`/api/v1/articles/${id}`)
  },
}