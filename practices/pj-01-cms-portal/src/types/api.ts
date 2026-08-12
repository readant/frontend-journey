// 后端统一返回包装（匹配 backend-journey 的 R<T>）
export interface ApiResponse<T> {
  code: number  // 200=成功，其他=错误
  msg: string   // 响应消息
  data: T       // 实际数据载荷
}

// 分页响应（匹配 MyBatis-Plus Page 序列化字段）
export interface PageResult<T> {
  records: T[]
  total: number
  size: number   // 每页条数
  current: number // 当前页
  pages: number   // 总页数
}

// 分页请求参数（匹配后端分页约定）
export interface PageParams {
  pageNum?: number   // 页码，从1开始
  pageSize?: number   // 每页条数，默认10，最大100
}

// --- 栏目模块类型 ---

export interface CategoryVO {
  id: number
  name: string
  parentId: number | null
  sortOrder: number
  status: number
  createdAt: string
  children: CategoryVO[]
}

// --- 文章模块类型 ---

export interface ArticleVO {
  id: number
  title: string
  summary: string
  content: string
  categoryId: number | null
  categoryName: string
  coverImage: string
  status: number   // 0=草稿，1=已发布
  author: string
  viewCount: number
  createdAt: string
  updatedAt: string
}

// --- 产品分类模块类型 ---

export interface ProductCategoryVO {
  id: number
  name: string
  parentId: number | null
  sortOrder: number
  status: number
  createdAt: string
  children: ProductCategoryVO[]
}

// --- 产品模块类型 ---

export interface ProductVO {
  id: number
  name: string
  description: string
  categoryId: number | null
  coverImage: string
  price: number
  status: number
  createdAt: string
  updatedAt: string
}