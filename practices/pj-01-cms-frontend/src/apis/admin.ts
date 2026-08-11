import http from '@/utils/http'
import type { AdminVO, AdminCreateReq, AdminUpdateReq, LoginReq, LoginVO, PageResult, PageParams } from '@/types/api'

export const adminApi = {
  /** POST /api/v1/admins/login - 登录 */
  login(data: LoginReq) {
    return http.post<LoginVO>('/api/v1/admins/login', data)
  },

  /** GET /api/v1/admins - 获取管理员列表 */
  list(params?: PageParams) {
    return http.get<AdminVO[]>('/api/v1/admins', { params })
  },

  /** GET /api/v1/admins/{id} - 获取管理员详情 */
  getById(id: number) {
    return http.get<AdminVO>(`/api/v1/admins/${id}`)
  },

  /** POST /api/v1/admins - 新增管理员 */
  create(data: AdminCreateReq) {
    return http.post<AdminVO>('/api/v1/admins', data)
  },

  /** PUT /api/v1/admins/{id} - 更新管理员 */
  update(id: number, data: AdminUpdateReq) {
    return http.put<AdminVO>(`/api/v1/admins/${id}`, data)
  },

  /** DELETE /api/v1/admins/{id} - 删除管理员 */
  delete(id: number) {
    return http.delete(`/api/v1/admins/${id}`)
  },
}