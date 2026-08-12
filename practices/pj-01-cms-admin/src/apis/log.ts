import { get } from '@/utils/http'
import type { OperationLogVO, PageResult } from '@/types/api'

export const logApi = {
  /** GET /api/v1/logs - 分页查询操作日志 */
  page(params: Record<string, unknown>) {
    return get<PageResult<OperationLogVO>>('/api/v1/logs', params)
  },
}