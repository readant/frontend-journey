import { get, post, put, del } from '@/utils/http'
import type { AdminVO, AdminCreateReq, AdminUpdateReq, LoginReq, LoginVO } from '@/types/api'

export const adminApi = {
  /** POST /api/v1/admins/login - 登录 */
  login(data: LoginReq) {
    return post<LoginVO>('/api/v1/admins/login', data)
  },

  /** GET /api/v1/admins - 获取管理员列表 */
  list() {
    return get<AdminVO[]>('/api/v1/admins')
  },

  /** GET /api/v1/admins/{id} - 获取管理员详情 */
  getById(id: number) {
    return get<AdminVO>(`/api/v1/admins/${id}`)
  },

  /** POST /api/v1/admins - 新增管理员 */
  create(data: AdminCreateReq) {
    return post<AdminVO>('/api/v1/admins', data)
  },

  /** PUT /api/v1/admins/{id} - 更新管理员 */
  update(id: number, data: AdminUpdateReq) {
    return put<AdminVO>(`/api/v1/admins/${id}`, data)
  },

  /** DELETE /api/v1/admins/{id} - 删除管理员 */
  delete(id: number) {
    return del(`/api/v1/admins/${id}`)
  },
}