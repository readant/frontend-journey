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
  return url ? { backgroundImage: `url(${url})` } : {}
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
    <div class="page-hero">
      <h2>作品</h2>
      <p>雄心工作室出品的工具、手册与组件库</p>
    </div>

    <div class="list-body page-shell">
      <!-- 分类筛选 -->
      <div class="filter-bar">
        <el-button
          :type="activeCategory === undefined ? 'primary' : 'default'"
          size="small"
          @click="handleCategorySelect()"
        >
          全部
        </el-button>
        <el-button
          v-for="item in categories"
          :key="item.id"
          :type="activeCategory === item.id ? 'primary' : 'default'"
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
          class="product-card hover-card"
          shadow="never"
          @click="router.push(`/products/${item.id}`)"
        >
          <div class="product-cover media-ink" :style="coverStyle(item.coverImage)">
            <span v-if="!item.coverImage" class="media-glyph">{{ item.name.slice(0, 1) }}</span>
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

/* 横向留白交给 .page-shell，这里只负责纵向节奏，
   否则会出现"标题 200、卡片 224"的错位。 */
.list-body {
  padding-top: 40px;
  padding-bottom: 64px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.product-grid {
  display: grid;
  /* minmax(0, ...) 不能写成 1fr：grid item 的隐含 min-width 是 auto，
     卡片标题是 nowrap，用 1fr 时会把整列撑破，导致整页横向溢出。 */
  /* 三列而非四列：作品数是 6 的倍数时，四列会在末行留两个空位，
     三列正好两整行，版面收得住。 */
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.product-card {
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.product-cover {
  height: 200px;
  overflow: hidden;
  background-color: var(--ink-700);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card:hover .product-cover {
  transform: scale(1.03);
}

.product-body {
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--app-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: var(--glow);
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 15px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  margin-left: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .product-cover {
    height: 200px;
  }
}
</style>