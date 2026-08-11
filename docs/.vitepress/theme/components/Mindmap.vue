<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
// 静态导入各模块的思维导图内容（?raw 由 Vite 编译期处理，避免 glob 对 .md 文件匹配不可靠）
import cssContent from "../../../02-css/mindmap/mindmap-content.md?raw";
import htmlContent from "../../../01-html/mindmap/mindmap-content.md?raw";
import jsContent from "../../../03-js/mindmap/mindmap-content.md?raw";

// 组件支持通过 topic prop 选择渲染哪个模块的思维导图（默认 css）
// 用法: <Mindmap topic="html" />  /  <Mindmap topic="js" />
const props = withDefaults(defineProps<{ topic?: string }>(), { topic: "css" });

// 按 topic 选择对应模块的内容
const contents: Record<string, string> = { css: cssContent, html: htmlContent, js: jsContent };
const mindmapContent = computed(() => contents[props.topic] ?? "");

// 绑定到组件内部 SVG，而非全局选择器，避免多实例时相互覆盖
const svgRef = ref<SVGSVGElement>();
let mm: Markmap | null = null;
let stopWatcher: (() => void) | null = null;
const errMsg = ref("");

function render() {
  // 重建：销毁旧实例后，用当前 topic 的内容重新渲染
  mm?.destroy();
  mm = null;
  errMsg.value = "";
  const svgEl = svgRef.value;
  if (!svgEl) throw new Error("SVG 元素未找到");
  if (!mindmapContent.value) throw new Error("思维导图数据为空，请先运行 npm run gen:mindmap");
  const transformer = new Transformer();
  const { root } = transformer.transform(mindmapContent.value);
  mm = Markmap.create(
    svgEl,
    {
      duration: 400,
      maxWidth: 320,
      spacingHorizontal: 80,
      spacingVertical: 16,
      paddingX: 12,
      autoFit: true,
    },
    root
  );
}

// 首次渲染必须在客户端挂载后执行（SSR 阶段 svg 尚不存在）
onMounted(() => {
  try {
    render();
  } catch (e: any) {
    errMsg.value = e?.message || String(e);
    console.error("[Mindmap] 渲染失败:", e);
  }
  // topic 变化时（如 html -> js）自动重建
  stopWatcher = watch(
    () => props.topic,
    () => {
      try {
        render();
      } catch (e: any) {
        errMsg.value = e?.message || String(e);
        console.error("[Mindmap] 渲染失败:", e);
      }
    }
  );
});

onBeforeUnmount(() => {
  stopWatcher?.();
  mm?.destroy();
});
</script>

<template>
  <ClientOnly>
    <div v-if="errMsg" class="mindmap-error">思维导图渲染失败: {{ errMsg }}</div>
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
