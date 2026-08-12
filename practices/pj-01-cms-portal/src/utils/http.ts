import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/api'

const http = axios.create({
  // 请求路径已含 /api 前缀（如 /api/v1/site/home），baseURL 默认置空避免重复
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
})

// 响应拦截器 - 统一错误处理（匹配后端 R<T> 格式）
http.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<unknown>
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg))
    }
    return res.data as any
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          ElMessage.error('资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(`错误 ${error.response.status}`)
      }
    } else {
      ElMessage.error('网络错误')
    }
    return Promise.reject(error)
  },
)

// 包装方法，提供正确的返回类型 Promise<T> 而非 Promise<AxiosResponse<T>>
export function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return http.get(url, { params }) as unknown as Promise<T>
}

export default { get }