import http from '@/utils/http'
import type { RoleVO } from '@/types/api'

export const roleApi = {
  /** GET /api/v1/roles - 获取角色列表 */
  list() {
    return http.get<RoleVO[]>('/api/v1/roles')
  },

  /** POST /api/v1/roles/{roleId}/admins/{adminId} - 分配角色 */
  assignRole(adminId: number, roleId: number) {
    return http.post(`/api/v1/roles/${roleId}/admins/${adminId}`)
  },

  /** DELETE /api/v1/roles/{roleId}/admins/{adminId} - 移除角色 */
  removeRole(adminId: number, roleId: number) {
    return http.delete(`/api/v1/roles/${roleId}/admins/${adminId}`)
  },

  /** GET /api/v1/roles/admins/{adminId} - 获取管理员角色 */
  getRolesByAdminId(adminId: number) {
    return http.get<RoleVO[]>(`/api/v1/roles/admins/${adminId}`)
  },
}