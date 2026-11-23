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
      <el-page-header class="page-header" content="作品详情" @back="router.back()" />

      <div v-if="product" class="product-content">
        <el-card shadow="never" class="product-card">
          <div class="product-main">
            <div class="product-cover">
              <img v-if="product.coverImage" :src="product.coverImage" alt="产品图" />
              <div v-else class="cover-placeholder">雄心出品</div>
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
  padding: 32px 24px 64px;
}

.page-header {
  margin-bottom: 28px;
}

.product-card {
  :deep(.el-card__body) {
    padding: 36px;
  }
}

.product-main {
  display: flex;
  gap: 44px;
  align-items: flex-start;
}

.product-cover {
  width: 360px;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: var(--app-radius);
    display: block;
    filter: var(--media-ink);
    transition: filter 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.product-card:hover .product-cover img {
  transform: scale(1.02);
  filter: var(--media-ink-hover);
}

.cover-placeholder {
  width: 100%;
  height: 280px;
  border: 1px solid var(--line);
  background: var(--ink-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  color: var(--text-3);
  font-size: 15px;
  letter-spacing: 0.24em;
}

.product-name {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--app-text);
  margin: 0 0 18px;
  line-height: 1.45;
}

.product-price {
  font-size: 26px;
  font-weight: 400;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  color: var(--glow);
  margin-bottom: 28px;
}

.product-desc {
  color: var(--app-text-2);
  font-size: 15px;
  line-height: 1.9;
  margin: 0;
}

@media (max-width: 768px) {
  .product-main {
    flex-direction: column;
  }

  .product-cover {
    width: 100%;

    img {
      height: auto;
      max-height: 320px;
    }
  }
}
</style>