<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import { productCategoryApi } from '@/apis/product-category'
import type { ProductCategoryVO, ProductVO } from '@/types/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const products = ref<ProductVO[]>([])
const categories = ref<ProductCategoryVO[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 12

const activeCategory = ref<number | undefined>(undefined)

async function fetchData() {
  loading.value = true
  try {
    const res = await siteApi.productPage({
      pageNum: pageNum.value,
      pageSize,
      categoryId: activeCategory.value,
    })
    products.value = res.records
    total.value = res.total
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
  }
}

function fetchCategories() {
  productCategoryApi.tree().then((tree) => {
    categories.value = tree.filter((item) => item.status === 1)
  })
}

function syncQuery() {
  const id = Number(route.query.categoryId)
  activeCategory.value = Number.isNaN(id) ? undefined : id
  pageNum.value = 1
}

function handleCategorySelect(id?: number) {
  activeCategory.value = id
  pageNum.value = 1
  router.replace({ path: '/products', query: id ? { categoryId: id } : {} })
  fetchData()
}

function handlePageChange(page: number) {
  pageNum.value = page
  fetchData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function coverStyle(url?: string) {
  return url ? { backgroundImage: `url(${url})` } : { backgroundColor: '#fdf6ec' }
}

onMounted(() => {
  syncQuery()
  fetchCategories()
  fetchData()
})

watch(
  () => route.query.categoryId,
  () => {
    syncQuery()
    fetchData()
  },
)
</script>

<template>
  <div class="product-list" v-loading="loading">
    <div class="page-banner">
      <h2>产品中心</h2>
      <p>兴华小组出品，用心打磨每一个作品</p>
    </div>

    <div class="list-body">
      <!-- 分类筛选 -->
      <div class="filter-bar">
        <el-button
          :type="activeCategory === undefined ? 'primary' : 'default'"
          round
          size="small"
          @click="handleCategorySelect()"
        >
          全部
        </el-button>
        <el-button
          v-for="item in categories"
          :key="item.id"
          :type="activeCategory === item.id ? 'primary' : 'default'"
          round
          size="small"
          @click="handleCategorySelect(item.id)"
        >
          {{ item.name }}
        </el-button>
      </div>

      <!-- 产品卡片 -->
      <div class="product-grid" v-if="products.length">
        <el-card
          v-for="item in products"
          :key="item.id"
          class="product-card"
          shadow="hover"
          @click="router.push(`/products/${item.id}`)"
        >
          <div class="product-cover" :style="coverStyle(item.coverImage)">
            <span v-if="!item.coverImage" class="cover-text">{{ item.name.slice(0, 1) }}</span>
          </div>
          <div class="product-body">
            <h3 class="product-name">{{ item.name }}</h3>
            <div class="product-price">¥{{ item.price }}</div>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="暂无产品" />

      <!-- 分页 -->
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.product-list {
  min-height: 100%;
}

.page-banner {
  background: linear-gradient(135deg, #e6a23c 0%, #f56c6c 100%);
  color: #fff;
  padding: 48px 24px;
  text-align: center;

  h2 {
    font-size: 28px;
    margin: 0 0 8px;
  }

  p {
    opacity: 0.9;
    margin: 0;
  }
}

.list-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.product-cover {
  height: 160px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-text {
  font-size: 40px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.product-body {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  margin-left: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>