import { get } from '@/utils/http'
import type { DashboardStatsVO } from '@/types/api'

export const dashboardApi = {
  /** GET /api/v1/dashboard - 数据看板统计 */
  stats() {
    return get<DashboardStatsVO>('/api/v1/dashboard')
  },
}