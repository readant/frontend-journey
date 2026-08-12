<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteApi } from '@/apis/site'
import type { ProductVO } from '@/types/api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const product = ref<ProductVO | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    product.value = await siteApi.productDetail(Number(route.params.id))
  } catch {
    // 错误已由拦截器提示
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="product-detail" v-loading="loading">
    <div class="detail-body">
      <el-page-header class="page-header" content="产品详情" @back="router.back()" />

      <div v-if="product" class="product-content">
        <el-card shadow="never" class="product-card">
          <div class="product-main">
            <div class="product-cover">
              <img v-if="product.coverImage" :src="product.coverImage" alt="产品图" />
              <div v-else class="cover-placeholder">兴华出品</div>
            </div>
            <div class="product-info">
              <h1 class="product-name">{{ product.name }}</h1>
              <div class="product-price">¥{{ product.price }}</div>
              <p class="product-desc">{{ product.description || '暂无产品描述' }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <el-empty v-else-if="!loading" description="产品不存在或已删除" />
    </div>
  </div>
</template>

<style scoped lang="less">
.product-detail {
  min-height: 100%;
}

.detail-body {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.page-header {
  margin-bottom: 24px;
}

.product-card {
  :deep(.el-card__body) {
    padding: 32px;
  }
}

.product-main {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.product-cover {
  width: 360px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
  }
}

.cover-placeholder {
  width: 100%;
  height: 280px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fdf6ec 0%, #fadbd8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e6a23c;
  font-size: 20px;
  font-weight: 600;
}

.product-name {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px;
}

.product-price {
  font-size: 28px;
  font-weight: 700;
  color: #f56c6c;
  margin-bottom: 24px;
}

.product-desc {
  color: #666;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
}
</style>