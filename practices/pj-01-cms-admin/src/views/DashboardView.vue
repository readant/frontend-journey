<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { dashboardApi } from '@/apis/dashboard'
import type { DashboardStatsVO } from '@/types/api'

const loading = ref(false)
const stats = ref<DashboardStatsVO | null>(null)

let trendChart: echarts.ECharts | null = null
let statusChart: echarts.ECharts | null = null
const trendEl = ref<HTMLDivElement | null>(null)
const statusEl = ref<HTMLDivElement | null>(null)

const cards = ref([
  { label: '管理员数', key: 'adminCount' as const, icon: '👤', value: 0, tint: '#eef3ff', accent: '#3b6ef5' },
  { label: '栏目数', key: 'categoryCount' as const, icon: '🗂️', value: 0, tint: '#fdf3e7', accent: '#f59e0b' },
  { label: '文章数', key: 'articleCount' as const, icon: '📄', value: 0, tint: '#e9faf0', accent: '#22c55e' },
  { label: '产品数', key: 'productCount' as const, icon: '📦', value: 0, tint: '#fdeef0', accent: '#ef4444' },
])

async function fetchData() {
  loading.value = true
  try {
    stats.value = await dashboardApi.stats()
    cards.value.forEach((c) => (c.value = stats.value![c.key]))
    renderCharts()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}

function renderCharts() {
  if (!stats.value) return
  const s = stats.value

  // 近 7 天文章发布趋势（柱状图）
  if (trendEl.value) {
    trendChart?.dispose()
    trendChart = echarts.init(trendEl.value)
    trendChart.setOption({
      title: { text: '近 7 天文章发布趋势', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 50, bottom: 30 },
      xAxis: { type: 'category', data: s.recentArticleTrend.days },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: '发布数',
          type: 'bar',
          data: s.recentArticleTrend.counts,
          barWidth: '40%',
          itemStyle: { color: '#3b6ef5', borderRadius: [6, 6, 0, 0] },
        },
      ],
    })
  }

  // 文章状态分布（饼图）
  if (statusEl.value) {
    statusChart?.dispose()
    statusChart = echarts.init(statusEl.value)
    statusChart.setOption({
      title: { text: '文章状态分布', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '文章状态',
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '50%'],
          data: [
            { name: '草稿', value: s.articleStatus.draft, itemStyle: { color: '#94a3b8' } },
            { name: '已发布', value: s.articleStatus.published, itemStyle: { color: '#22c55e' } },
          ],
        },
      ],
    })
  }
}

function handleResize() {
  trendChart?.resize()
  statusChart?.resize()
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  statusChart?.dispose()
})
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <h2>数据看板</h2>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-card v-for="card in cards" :key="card.key" class="stat-card" shadow="never">
        <div class="card-inner">
          <span class="card-icon" :style="{ background: card.tint }">{{ card.icon }}</span>
          <div class="card-info">
            <div class="card-value" :style="{ color: card.accent }">{{ card.value }}</div>
            <div class="card-label">{{ card.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区 -->
    <div class="charts">
      <el-card class="chart-card">
        <div ref="trendEl" class="chart"></div>
      </el-card>
      <el-card class="chart-card">
        <div ref="statusEl" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

.dashboard {
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
  }
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--app-shadow);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
}

.card-label {
  color: @text-light;
  font-size: 13px;
  margin-top: 6px;
}

.charts {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 16px;
}

.chart {
  width: 100%;
  height: 320px;
}

@media (max-width: 992px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts {
    grid-template-columns: 1fr;
  }
}
</style>