<script setup lang="ts">
/**
 * 知识星盘 StarMap
 *
 * 参考层的灵魂导航：把知识体系画成一片星空。
 * - 背景：蓝紫渐变 + Canvas 动态漂浮粒子
 * - 星星：三级节点（大/中/小），中文命名，缓慢呼吸
 * - 星轨：发光虚线连线，光点沿虚线流动
 * - 点击星星：飞向中央放大，相连星星高亮，其余暗淡，右侧弹出「光之翼」速查面板
 * - 搜索：输入中文大白话（如「横着排」），对应星星升起冲天光柱
 */
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { constellations, stars, starMap, type Constellation, type ConstellationId, type StarNode } from "./star-map-data";

/** 全屏模式：供 3-Reference/index.md（layout: false 全屏星盘入口）使用，容器铺满视口 */
const props = withDefaults(defineProps<{ fullscreen?: boolean }>(), { fullscreen: false });

/** 站点部署根路径（GitHub Pages 为 /frontend-journey/），面板跳转链接需拼接 */
const base = import.meta.env.BASE_URL;

/* ==================== 容器尺寸与坐标 ==================== */
const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const size = reactive({ w: 0, h: 0 });

/** 每个星星的像素坐标（相对容器左上角，由百分比换算而来） */
const pos = reactive<Record<string, { x: number; y: number }>>({});
/** 每个星星的呼吸动画参数（随机节奏，初始化一次） */
const anim = reactive<Record<string, { delay: string; dur: string }>>({});

/* ==================== 交互状态 ==================== */
const focusedId = ref<string | null>(null); // 当前聚焦的星星
const hoveredId = ref<string | null>(null); // 悬停的星星（显示 Tooltip）
const searchText = ref(""); // 搜索框输入
const matchedIds = ref<string[]>([]); // 搜索命中的星星 id

/** 星座配色工具 */
const colorOf = (c: string) => constellations.find((k) => k.id === c)?.color ?? "#fff";
const glowOf = (c: string) =>
  constellations.find((k) => k.id === c)?.glow ?? "rgba(255,255,255,.5)";
const constellationOf = (c: string) => constellations.find((k) => k.id === c);

/**
 * 星座 → 参考层入口映射（修复「光之翼」面板深挖链接写死为 CSS 的问题）：
 * handbook 指向所在域手册首页，scenario 指向该域最匹配的场景入口。
 * HTML / 工程化暂无专属场景页，统一回落场景索引总页。
 */
const domainOf = (c: ConstellationId) =>
  ({
    morning: {
      handbook: "3-reference/1-handbook/html/",
      scenario: "3-reference/2-scenarios/",
    },
    cloud: {
      handbook: "3-reference/1-handbook/css/",
      scenario: "3-reference/2-scenarios/layout",
    },
    rain: {
      handbook: "3-reference/1-handbook/js/",
      scenario: "3-reference/2-scenarios/run",
    },
    dusk: {
      handbook: "3-reference/1-handbook/engineering/",
      scenario: "3-reference/2-scenarios/",
    },
  })[c];

/** 聚焦后的飞行目标：桌面端飞到左侧区域中心，给右侧「光之翼」面板让位 */
const focusTarget = computed(() => {
  const panelW = size.w < 720 ? 0 : Math.min(360, size.w * 0.36);
  return {
    x: (size.w - panelW) * 0.5,
    y: size.h * 0.5,
  };
});

/* ==================== 坐标换算 ==================== */
function computePositions() {
  if (!containerRef.value) return;
  const w = containerRef.value.clientWidth;
  const h = containerRef.value.clientHeight;
  size.w = w;
  size.h = h;
  for (const s of stars) {
    pos[s.id] = { x: (s.x / 100) * w, y: (s.y / 100) * h };
  }
  // 为每颗星星生成一次随机呼吸节奏（延迟 + 周期），保持整片星空错落有致
  if (Object.keys(anim).length === 0) {
    for (const s of stars) {
      anim[s.id] = {
        delay: `${(Math.random() * 3).toFixed(2)}s`,
        dur: `${(2.6 + Math.random() * 1.6).toFixed(2)}s`,
      };
    }
  }
}

/** 取星星的当前显示位置：聚焦中的星星用飞行目标点（星轨端点跟随飞向中央） */
function p(id: string) {
  if (id === focusedId.value) return focusTarget.value;
  return pos[id];
}

/* ==================== 星轨连线（去重后的线段） ==================== */
const linePairs = computed(() => {
  const pairs: { from: string; to: string }[] = [];
  const seen = new Set<string>();
  for (const s of stars) {
    for (const l of s.links ?? []) {
      const key = [s.id, l].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ from: s.id, to: l });
    }
  }
  return pairs;
});

/** 与聚焦星星直接相连的节点集合（含双向） */
const linkedIds = computed(() => {
  const f = focusedId.value;
  const set = new Set<string>();
  if (!f) return set;
  set.add(f);
  const node = starMap[f];
  for (const l of node?.links ?? []) set.add(l);
  for (const s of stars) if ((s.links ?? []).includes(f)) set.add(s.id);
  return set;
});

function lineClass(ln: { from: string; to: string }) {
  if (!focusedId.value) return "";
  const f = focusedId.value;
  return ln.from === f || ln.to === f ? "is-active" : "is-dimmed";
}

/* ==================== 星星样式（星域星光体） ==================== */
function starStyle(s: StarNode) {
  const pv = pos[s.id];
  if (!pv) return { opacity: 0 };
  const base = {
    left: pv.x + "px",
    top: pv.y + "px",
    animationDelay: anim[s.id]?.delay ?? "0s",
    zIndex: s.level === 1 ? 3 : 2,
    transition: "transform .8s cubic-bezier(.22,1,.36,1), opacity .4s ease, filter .4s ease",
  };
  // 聚焦飞行：在 -50% 居中的基础上叠加位移与放大，实现「飞向中央」的缓动
  if (focusedId.value === s.id) {
    const t = focusTarget.value;
    return {
      ...base,
      transform: `translate(calc(-50% + ${t.x - pv.x}px), calc(-50% + ${t.y - pv.y}px)) scale(1.55)`,
      zIndex: 20,
    };
  }
  return { ...base, transform: "translate(-50%, -50%)" };
}

/** 星核外接圆半径：大 24 / 中 16 / 小 10 */
function outerR(s: StarNode) {
  const map: Record<number, number> = { 1: 24, 2: 16, 3: 10 };
  return map[s.level];
}

/** 内接圆半径 = 外接圆 × 0.4 */
function innerR(s: StarNode) {
  return outerR(s) * 0.4;
}

/** 星芒射线数量：大星星 12 根 / 中星星 8 根 / 小星星无射线（可用 rayCount 覆盖） */
function rayCountOf(s: StarNode) {
  return s.level <= 2 ? (s.rayCount ?? (s.level === 1 ? 12 : 8)) : 0;
}

/** 射线长度：大星星 15px / 中星星 10px */
function rayLenOf(s: StarNode) {
  return s.level === 1 ? 15 : 10;
}

/** 光晕强度：大 1 / 中 0.65 / 小 0.4（可用 glowIntensity 覆盖） */
function glowIntensityOf(s: StarNode) {
  return s.glowIntensity ?? (s.level === 1 ? 1 : s.level === 2 ? 0.65 : 0.4);
}

/** 星核颜色：大星星暖黄色，其余用星座主色 */
function coreColorOf(s: StarNode) {
  return s.level === 1 ? "#ffd76a" : colorOf(s.constellation);
}

/** SVG 尺寸：外接圆 + 射线 + 留白 */
function svgSize(s: StarNode) {
  return (outerR(s) + rayLenOf(s) + 3) * 2;
}

/** SVG 视口：以星核中心为原点 */
function svgViewBox(s: StarNode) {
  const half = outerR(s) + rayLenOf(s) + 3;
  return `-${half} -${half} ${half * 2} ${half * 2}`;
}

/** 标准五角星路径：外接圆 rOuter，内接圆 rInner，默认 5 角 */
function starPath(cx: number, cy: number, rOuter: number, rInner: number, points = 5) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    d +=
      (i === 0 ? "M" : "L") +
      (cx + r * Math.cos(a)).toFixed(2) +
      "," +
      (cy + r * Math.sin(a)).toFixed(2);
  }
  return d + "Z";
}

/** 星尘粒子数量：大 5 / 中 3 / 小 2 */
function dustCountOf(s: StarNode) {
  return s.level === 1 ? 5 : s.level === 2 ? 3 : 2;
}

/** 星尘粒子样式：由节点 id 与序号推导的确定性伪随机，避免重复渲染时跳动 */
function dustStyle(s: StarNode, i: number) {
  const n = dustCountOf(s);
  if (!n) return { display: "none" };
  const seed = (s.id.length * 31 + i * 57) % 100;
  const angle = (i / n) * Math.PI * 2 + (seed / 100) * Math.PI * 2;
  const dist = outerR(s) * (1.2 + (seed % 30) / 40); // 飘散半径
  return {
    left: "50%",
    top: "50%",
    "--dx": (Math.cos(angle) * dist).toFixed(1) + "px",
    "--dy": (Math.sin(angle) * dist).toFixed(1) + "px",
    "--dust-color": s.level === 1 ? "#ffffff" : coreColorOf(s),
    animationDuration: (2.2 + (seed % 18) / 10).toFixed(2) + "s",
    animationDelay: ((seed % 30) / 10).toFixed(2) + "s",
  };
}

/** 星体符号容器：尺寸 + 三层光晕的 CSS 变量（外晕/内晕/星核） */
function symbolStyle(s: StarNode) {
  const glow = s.level === 1 ? "rgba(255,215,106,.95)" : glowOf(s.constellation);
  return {
    width: svgSize(s) + "px",
    height: svgSize(s) + "px",
    "--core": outerR(s), // 光晕按星核半径等比缩放
    "--glow": glow,
    "--gi": glowIntensityOf(s),
    "--halo-delay": anim[s.id]?.delay ?? "0s",
  };
}

function starClass(s: StarNode) {
  const cls: string[] = [];
  if (focusedId.value === s.id) cls.push("is-focused");
  else if (focusedId.value && linkedIds.value.has(s.id)) cls.push("is-linked");
  else if (focusedId.value) cls.push("is-dimmed");
  if (matchedIds.value.includes(s.id)) cls.push("is-matched");
  return cls;
}

/* ==================== 分区角标 / 搜索光柱 / Tooltip 样式 ==================== */
function zoneStyle(c: Constellation) {
  const map: Record<string, Record<string, string>> = {
    morning: { left: "3%", top: "3%" },
    cloud: { right: "3%", top: "3%", textAlign: "right" },
    rain: { left: "3%", bottom: "4%" },
    dusk: { right: "3%", bottom: "4%", textAlign: "right" },
  };
  return { ...map[c.id], color: c.color };
}

function beamStyle(id: string, i: number) {
  const pv = pos[id];
  if (!pv) return {};
  return {
    left: pv.x + "px",
    bottom: size.h - pv.y + "px",
    height: pv.y + "px",
    background: `linear-gradient(to top, ${colorOf(starMap[id].constellation)}, transparent)`,
    animationDelay: `${i * 0.07}s`,
  };
}

const tooltipStyle = computed(() => {
  const pv = hoveredId.value ? pos[hoveredId.value] : undefined;
  if (!pv) return {};
  const w = 180;
  const left = Math.max(8, Math.min(pv.x - w / 2, size.w - w - 8));
  const top = pv.y < 70 ? pv.y + 30 : pv.y - 56;
  return { left: left + "px", top: top + "px" };
});

/* ==================== 交互逻辑 ==================== */
function onClick(id: string) {
  // 再次点击同一颗星星 = 收起详情
  focusedId.value = focusedId.value === id ? null : id;
}

function reset() {
  focusedId.value = null;
  hoveredId.value = null;
}

/* 搜索：防抖 200ms，匹配中文名 / 英文 / 中文口语化标签 */
let searchTimer: number | undefined;
function applySearch(q: string) {
  const v = q.trim().toLowerCase();
  if (!v) {
    matchedIds.value = [];
    return;
  }
  matchedIds.value = stars
    .filter((s) => [s.name, s.en, ...s.tags].some((t) => t.toLowerCase().includes(v)))
    .map((s) => s.id);
}
watch(searchText, (val) => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => applySearch(val), 200);
});

/* ==================== Canvas 粒子背景 ==================== */
let rafId = 0;
let dpr = 1;
let particles: {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tw: number;
}[] = [];

function initCanvas() {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size.w * dpr;
  canvas.height = size.h * dpr;
  canvas.style.width = size.w + "px";
  canvas.style.height = size.h + "px";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // 粒子数量随面积自适应，上限 90 个，保证低端设备流畅
  const count = Math.min(90, Math.floor((size.w * size.h) / 9000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * size.w,
    y: Math.random() * size.h,
    r: 0.6 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(0.08 + Math.random() * 0.25), // 缓慢向上飘浮，像萤火
    a: 0.25 + Math.random() * 0.5,
    tw: 0.5 + Math.random() * 1.5, // 闪烁频率
  }));
}

/** 逐帧绘制：粒子缓慢上飘 + 正弦闪烁 */
function tick() {
  rafId = requestAnimationFrame(tick);
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = size.w;
  const h = size.h;
  ctx.clearRect(0, 0, w, h);
  const t = performance.now() / 1000;
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    // 出界回绕
    if (p.y < -4) {
      p.y = h + 4;
      p.x = Math.random() * w;
    }
    if (p.x < -4) p.x = w + 4;
    if (p.x > w + 4) p.x = -4;
    const alpha = p.a * (0.55 + 0.45 * Math.sin(t * p.tw + p.x));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(214,226,255,${alpha.toFixed(3)})`;
    ctx.fill();
  }
}

/* ==================== 生命周期 ==================== */
function handleResize() {
  computePositions();
  initCanvas();
}

function handleKey(e: KeyboardEvent) {
  if (e.key === "Escape") reset();
}

let ro: ResizeObserver | null = null;
let stopWatchRef: (() => void) | null = null;

/** 启动星盘：容器就绪后才初始化 */
function boot() {
  if (!containerRef.value) return;
  computePositions();
  initCanvas();
  tick();
  // 用 ResizeObserver 监听容器尺寸变化：初始 observe 会立即回调一次，
  // 若挂载时容器尺寸为 0（隐藏窗口/懒加载），尺寸就绪后会自动重算坐标
  ro = new ResizeObserver(() => handleResize());
  ro.observe(containerRef.value);
  window.addEventListener("keydown", handleKey);
}

onMounted(() => {
  // ClientOnly 的插槽内容可能晚于本组件挂载渲染，watch 容器引用变为元素后再启动
  stopWatchRef = watch(containerRef, (el) => {
    if (!el) return;
    stopWatchRef?.();
    boot();
  });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.clearTimeout(searchTimer);
  stopWatchRef?.();
  ro?.disconnect();
  window.removeEventListener("keydown", handleKey);
});

/** 当前聚焦的星星对象 */
const focused = computed(() => (focusedId.value ? starMap[focusedId.value] : null));
const focusedConstellation = computed(() =>
  focused.value ? constellationOf(focused.value.constellation) : undefined,
);
</script>

<template>
  <ClientOnly>
    <div ref="containerRef" class="starmap" :class="{ 'is-fullscreen': props.fullscreen }">
      <!-- 粒子背景 -->
      <canvas ref="canvasRef" class="starmap-particles"></canvas>

      <!-- 星轨连线（发光虚线 + 流动动画） -->
      <svg
        class="starmap-lines"
        :width="size.w"
        :height="size.h"
        :viewBox="`0 0 ${size.w} ${size.h}`"
      >
        <g v-for="ln in linePairs" :key="`${ln.from}-${ln.to}`">
          <line
            class="star-line"
            :class="lineClass(ln)"
            :x1="p(ln.from)?.x"
            :y1="p(ln.from)?.y"
            :x2="p(ln.to)?.x"
            :y2="p(ln.to)?.y"
            :stroke="colorOf(starMap[ln.from].constellation)"
          />
        </g>
      </svg>

      <!-- 四大星座分区角标 -->
      <div v-for="c in constellations" :key="c.id" class="zone" :style="zoneStyle(c)">
        {{ c.icon }} {{ c.name }} · {{ c.en }}
      </div>

      <!-- 星星本体：星光体（中文命名，五角星 + 三层光晕 + 星芒射线 + 星尘） -->
      <div
        v-for="s in stars"
        :key="s.id"
        class="star"
        :class="starClass(s)"
        :style="starStyle(s)"
        @mouseenter="hoveredId = s.id"
        @mouseleave="hoveredId = null"
        @click.stop="onClick(s.id)"
      >
        <div class="star-symbol" :style="symbolStyle(s)">
          <svg
            class="star-svg"
            :width="svgSize(s)"
            :height="svgSize(s)"
            :viewBox="svgViewBox(s)"
            :style="{ animationDuration: anim[s.id]?.dur, animationDelay: anim[s.id]?.delay }"
          >
            <!-- 星芒射线：仅大/中星星，缓慢旋转 + 明灭 -->
            <g v-if="s.level <= 2" class="star-rays">
              <line
                v-for="i in rayCountOf(s)"
                :key="'ray' + i"
                :x1="0"
                :y1="-innerR(s) - 1"
                :x2="0"
                :y2="-innerR(s) - rayLenOf(s)"
                :transform="`rotate(${(i / rayCountOf(s)) * 360})`"
                :stroke="coreColorOf(s)"
              />
            </g>
            <!-- 星核：标准五角星（外接圆 outerR，内接圆 outerR × 0.4） -->
            <path
              class="star-core"
              :d="starPath(0, 0, outerR(s), outerR(s) * 0.4)"
              :fill="coreColorOf(s)"
            />
          </svg>
          <!-- 星尘粒子：围绕星体漂浮 -->
          <span
            v-for="i in dustCountOf(s)"
            :key="'dust' + i"
            class="stardust"
            :style="dustStyle(s, i)"
          ></span>
        </div>
        <span class="star-label">{{ s.name }}</span>
      </div>

      <!-- 搜索命中的冲天光柱 -->
      <div
        v-for="(id, i) in matchedIds"
        :key="'beam-' + id"
        class="beam"
        :style="beamStyle(id, i)"
      ></div>

      <!-- 悬停 Tooltip：显示英文拼写（中文名已在星星上） -->
      <div
        v-if="hoveredId && hoveredId !== focusedId && pos[hoveredId]"
        class="tooltip"
        :style="tooltipStyle"
      >
        <div class="tt-name">{{ starMap[hoveredId].name }}</div>
        <div class="tt-en">{{ starMap[hoveredId].en }}</div>
      </div>

      <!-- 顶栏：搜索框（中文大白话）+ 返回星空 -->
      <div class="starmap-topbar">
        <div class="search-box">
          <span class="search-icon">🔭</span>
          <input
            v-model="searchText"
            type="text"
            placeholder="输入中文大白话：横着排 / 居中 / 必填…"
          />
          <button v-if="searchText" class="clear-btn" @click="searchText = ''">✕</button>
        </div>
        <button v-if="focusedId" class="reset-btn" @click="reset">返回星空</button>
      </div>

      <!-- 光之翼速查面板：中文解释 + 英文拼写 + 谐音助记 + 代码示例 -->
      <transition name="wing">
        <aside v-if="focused" class="wing-panel">
          <div class="wing-head">
            <span class="wing-zone" :style="{ color: focusedConstellation?.color }">
              {{ focusedConstellation?.icon }} {{ focusedConstellation?.name }}
            </span>
            <button class="wing-close" @click="reset">✕</button>
          </div>
          <h3 class="wing-name">{{ focused.name }}</h3>
          <div class="wing-en">{{ focused.en }}</div>
          <p class="wing-desc">{{ focused.desc }}</p>
          <div v-if="focused.phonetic || focused.mnemonic" class="wing-memo">
            <div v-if="focused.phonetic" class="memo-row">
              <b>音节</b><span>{{ focused.phonetic }}</span>
            </div>
            <div v-if="focused.mnemonic" class="memo-row">
              <b>谐音</b><span>{{ focused.mnemonic }}</span>
            </div>
          </div>
          <div v-if="focused.code" class="wing-code">
            <pre>{{ focused.code }}</pre>
          </div>
          <div class="wing-tags">
            <span v-for="t in focused.tags" :key="t" class="tag">{{ t }}</span>
          </div>
          <div class="wing-foot">
            <a v-if="focused.link" :href="base + focused.link" class="wing-read">📖 阅读原文</a>
            <template v-else>
              <a :href="base + domainOf(focused.constellation).handbook">
                📖 {{ focusedConstellation?.name }}知识手册</a> ·
              <a :href="base + domainOf(focused.constellation).scenario">🔍 场景索引</a>
            </template>
          </div>
        </aside>
      </transition>
    </div>
    <template #fallback>
      <div class="starmap-loading">🕊️ 星盘加载中…</div>
    </template>
  </ClientOnly>
</template>

<style scoped>
/* ==================== 星盘容器：深邃蓝紫夜空 ==================== */
.starmap {
  position: relative;
  width: 100%;
  height: 620px;
  margin: 20px 0;
  border-radius: 18px;
  overflow: hidden;
  background: radial-gradient(
    120% 120% at 50% 0%,
    #1b2a6b 0%,
    #141b4d 38%,
    #0a0e2a 72%,
    #060a1e 100%
  );
  box-shadow:
    inset 0 0 80px rgba(70, 90, 220, 0.18),
    0 10px 40px rgba(10, 15, 60, 0.35);
}

/* 全屏模式：3-Reference/index.md 入口，铺满视口 */
.starmap.is-fullscreen {
  height: 100vh;
  margin: 0;
  border-radius: 0;
}

.starmap-particles {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.starmap-lines {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ==================== 星轨连线：发光虚线，光点沿虚线流动 ==================== */
.star-line {
  stroke-width: 1.2;
  stroke-dasharray: 4 14;
  opacity: 0.32;
  animation: line-flow 26s linear infinite;
}

.star-line.is-active {
  opacity: 0.75;
  stroke-width: 1.6;
}

.star-line.is-dimmed {
  opacity: 0.07;
}

@keyframes line-flow {
  to {
    stroke-dashoffset: -180;
  }
}

/* ==================== 星座分区角标 ==================== */
.zone {
  position: absolute;
  z-index: 2;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  opacity: 0.6;
  pointer-events: none;
}

/* ==================== 星星：星光体 ==================== */
.star {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
  will-change: transform, opacity;
}

/* 星体符号容器：外晕/内晕由伪元素承载，星核为 SVG */
.star-symbol {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.3s ease;
}

/* 第一层 · 外晕：大而通透的弥散光，缓慢呼吸 */
.star-symbol::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: calc(var(--core) * 5.2px);
  height: calc(var(--core) * 5.2px);
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow) 0%, transparent 68%);
  opacity: calc(0.4 * var(--gi));
  filter: blur(3px);
  animation: halo-breathe 3.4s ease-in-out infinite;
  animation-delay: var(--halo-delay, 0s);
  pointer-events: none;
}

/* 第二层 · 内晕：紧贴星核的亮晕 */
.star-symbol::after {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  width: calc(var(--core) * 2.4px);
  height: calc(var(--core) * 2.4px);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.55) 0%,
    var(--glow) 32%,
    transparent 72%
  );
  opacity: calc(0.55 * var(--gi));
  filter: blur(1px);
  pointer-events: none;
}

/* 第三层 · 星核：五角星 SVG，蜡烛式随机闪烁（节奏由内联样式随机化） */
.star-svg {
  position: relative;
  z-index: 1;
  display: block;
  animation: candle-flicker 3.2s ease-in-out infinite;
}

/* 星芒射线：缓慢旋转 + 明灭（仅大/中星星） */
.star-rays {
  transform-box: fill-box;
  transform-origin: center;
  animation:
    ray-spin 18s linear infinite,
    ray-twinkle 2.8s ease-in-out infinite;
}

.star-rays line {
  stroke-width: 1.1;
  stroke-linecap: round;
  opacity: 0.7;
}

/* 星尘粒子：围绕星核向外飘散并淡出 */
.stardust {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 3px;
  height: 3px;
  margin: -1.5px 0 0 -1.5px;
  border-radius: 50%;
  background: var(--dust-color);
  box-shadow: 0 0 5px var(--dust-color);
  opacity: 0;
  pointer-events: none;
  animation: dust-float 3s ease-in-out infinite;
}

/* 大星星（核心模块）恒亮，聚焦时停止闪烁、内晕增强 */
.star.is-focused {
  opacity: 1;
}

.star.is-focused .star-svg {
  animation: none;
}

.star.is-focused .star-symbol::after {
  opacity: calc(0.8 * var(--gi));
}

/* 相连星星：高亮 + 光脉冲 */
.star.is-linked .star-symbol {
  filter: brightness(1.3);
  animation: linked-pulse 1.6s ease-in-out infinite;
}

/* 不相干的星星：整体暗淡 */
.star.is-dimmed {
  opacity: 0.13;
  pointer-events: none;
}

/* 搜索命中：提亮 */
.star.is-matched .star-symbol {
  filter: brightness(1.5);
}

/* 悬停：星体发出光脉冲 */
.star:not(.is-focused):hover .star-symbol {
  filter: brightness(1.55);
}

.star:not(.is-focused):hover .star-label {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.star-label {
  margin-top: 6px;
  font-size: 11px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

/* 外晕呼吸：光晕柔和明灭（替代原来的机械缩放） */
@keyframes halo-breathe {
  0%,
  100% {
    opacity: calc(0.32 * var(--gi));
  }
  50% {
    opacity: calc(0.48 * var(--gi));
  }
}

/* 蜡烛式随机闪烁：不规则时间点 + 亮度抖动 + 轻微透明度变化 */
@keyframes candle-flicker {
  0%,
  100% {
    filter: brightness(1);
    opacity: 1;
  }
  5% {
    filter: brightness(1.3);
  }
  11% {
    filter: brightness(0.88);
    opacity: 0.97;
  }
  19% {
    filter: brightness(1.22);
  }
  27% {
    filter: brightness(0.8);
    opacity: 0.95;
  }
  36% {
    filter: brightness(1.35);
  }
  45% {
    filter: brightness(1.02);
  }
  54% {
    filter: brightness(0.9);
    opacity: 0.98;
  }
  63% {
    filter: brightness(1.42);
  }
  72% {
    filter: brightness(1.1);
  }
  82% {
    filter: brightness(0.85);
    opacity: 0.96;
  }
  91% {
    filter: brightness(1.25);
  }
}

/* 射线缓慢旋转 */
@keyframes ray-spin {
  to {
    transform: rotate(360deg);
  }
}

/* 射线明灭 */
@keyframes ray-twinkle {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.95;
  }
}

/* 星尘粒子：从星核向外飘散并淡出 */
@keyframes dust-float {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  25% {
    opacity: 0.85;
  }
  75% {
    opacity: 0.3;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.35);
    opacity: 0;
  }
}

/* 相连星星的光脉冲 */
@keyframes linked-pulse {
  0%,
  100% {
    filter: brightness(1.3);
  }
  50% {
    filter: brightness(1.7);
  }
}

/* ==================== 搜索光柱 ==================== */
.beam {
  position: absolute;
  z-index: 4;
  width: 3px;
  transform: translateX(-50%);
  transform-origin: bottom;
  border-radius: 2px;
  animation: beam-rise 1.1s ease-out forwards;
  pointer-events: none;
}

@keyframes beam-rise {
  from {
    opacity: 0;
    transform: translateX(-50%) scaleY(0);
  }
  to {
    opacity: 0.85;
    transform: translateX(-50%) scaleY(1);
  }
}

/* ==================== 悬停 Tooltip ==================== */
.tooltip {
  position: absolute;
  z-index: 8;
  width: 180px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(8, 12, 40, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}

.tt-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.tt-en {
  margin-top: 2px;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  color: #a8b1ff;
}

/* ==================== 顶栏：搜索 + 返回 ==================== */
.starmap-topbar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  pointer-events: none;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  width: min(420px, 78%);
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(10, 14, 46, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  pointer-events: auto;
  transition: border-color 0.3s;
}

.search-box:focus-within {
  border-color: rgba(168, 177, 255, 0.6);
}

.search-icon {
  font-size: 14px;
  opacity: 0.9;
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-size: 13px;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.clear-btn {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 12px;
}

.reset-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  background: rgba(10, 14, 46, 0.72);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  pointer-events: auto;
  backdrop-filter: blur(8px);
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background: rgba(52, 64, 160, 0.85);
}

/* ==================== 光之翼速查面板 ==================== */
.wing-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  width: min(360px, 40%);
  padding: 20px 22px;
  overflow-y: auto;
  background: rgba(10, 14, 46, 0.88);
  border-left: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px);
  box-shadow: -12px 0 32px rgba(0, 0, 0, 0.35);
}

.wing-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wing-zone {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.wing-close {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  cursor: pointer;
}

.wing-close:hover {
  color: #fff;
}

.wing-name {
  margin: 10px 0 2px;
  font-size: 24px;
  color: #fff;
}

.wing-en {
  font-family: Consolas, "Courier New", monospace;
  font-size: 15px;
  color: #a8b1ff;
}

.wing-desc {
  margin: 12px 0;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
}

.wing-memo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.memo-row {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.85);
}

.memo-row b {
  flex-shrink: 0;
  color: #ffd76a;
  font-weight: 600;
}

.wing-code {
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0b0f2c;
}

.wing-code pre {
  margin: 0;
  padding: 12px 14px;
  overflow-x: auto;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #d7e0ff;
}

.wing-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}

.tag {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.wing-foot {
  margin-top: 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.wing-foot a {
  color: #a8b1ff;
  text-decoration: none;
}

.wing-read {
  display: inline-block;
  margin-top: 4px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(168, 177, 255, 0.4);
  background: rgba(168, 177, 255, 0.08);
}

.wing-read:hover {
  background: rgba(168, 177, 255, 0.18);
}

.wing-foot a:hover {
  text-decoration: underline;
}

/* 面板滑入动画 */
.wing-enter-active {
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s;
}

.wing-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.25s;
}

.wing-enter-from,
.wing-leave-to {
  transform: translateX(60px);
  opacity: 0;
}

.starmap-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--vp-c-text-2, #606266);
  font-size: 14px;
}

/* ==================== 小屏适配 ==================== */
@media (max-width: 720px) {
  .starmap {
    height: 500px;
  }

  .wing-panel {
    top: auto;
    width: 100%;
    max-height: 46%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
  }

  .wing-enter-from,
  .wing-leave-to {
    transform: translateY(40px);
  }
}
</style>
