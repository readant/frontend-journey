<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import mindmapContent from '../../../02-css/mindmap/mindmap-content.md?raw'

const svgRef = ref<SVGSVGElement>()
let mm: Markmap | null = null
const errMsg = ref('')

onMounted(async () => {
  try {
    // 等待 DOM 完全渲染
    await nextTick()
    const svgEl = document.querySelector('.mindmap-svg') as SVGSVGElement
    if (!svgEl) throw new Error('SVG 元素未找到')
    const transformer = new Transformer()
    const { root } = transformer.transform(mindmapContent)
    mm = Markmap.create(svgEl, {
      duration: 400,
      maxWidth: 320,
      spacingHorizontal: 80,
      spacingVertical: 16,
      paddingX: 12,
      autoFit: true,
    }, root)
  } catch (e: any) {
    errMsg.value = e?.message || String(e)
    console.error('[Mindmap] 渲染失败:', e)
  }
})

onBeforeUnmount(() => {
  mm?.destroy()
})
</script>

<template>
  <ClientOnly>
    <div v-if="errMsg" class="mindmap-error">
      思维导图渲染失败: {{ errMsg }}
    </div>
    <div v-show="!errMsg" class="mindmap-wrapper">
      <svg ref="svgRef" class="mindmap-svg" />
    </div>
    <template #fallback>
      <div class="mindmap-loading">思维导图加载中…</div>
    </template>
  </ClientOnly>
</template>

<style scoped>
.mindmap-wrapper {
  margin: 24px 0;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  background: var(--vp-c-bg-soft, #f6f6f7);
  overflow: hidden;
}

.mindmap-svg {
  width: 100%;
  height: 600px;
  cursor: grab;
}

.mindmap-svg:active {
  cursor: grabbing;
}

.mindmap-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--vp-c-text-2, #606266);
  font-size: 14px;
}

/* markmap 节点样式覆盖 */
:deep(.mindmap-svg) {
  --markmap-circle-stroke: var(--vp-c-brand-1, #646cff);
}

:deep(a) {
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}
</style>
