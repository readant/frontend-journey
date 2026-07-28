const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INBOX = path.join(ROOT, '02-css', 'inbox');
const DOCS = path.join(ROOT, 'docs');
const CSS_DOCS = path.join(DOCS, '02-css');
const PUBLIC_DEMOS = path.join(DOCS, 'public', 'demos', '02-css');

const CHAPTERS = [
  { dir: '01-基础语法与机制', title: '基础语法与机制', file: '01-basics', desc: '语法结构、引入方式、层叠优先级、继承性、单位体系' },
  { dir: '02-选择器', title: '选择器', file: '02-selectors', desc: '基础/组合/属性/伪类/伪元素选择器' },
  { dir: '03-盒子模型', title: '盒子模型', file: '03-box-model', desc: '标准/怪异盒模型、margin/padding/border、外边距合并' },
  { dir: '04-布局与定位', title: '布局与定位', file: '04-layout-positioning', desc: '文档流、浮动、定位、Flexbox、Grid' },
  { dir: '05-视觉样式与美化', title: '视觉样式与美化', file: '05-visual-styling', desc: '文本字体、颜色背景、边框圆角、滤镜混合模式' },
  { dir: '06-变换与动画', title: '变换与动画', file: '06-transform-animation', desc: '2D/3D 变换、过渡、关键帧动画' },
  { dir: '07-响应式设计', title: '响应式设计', file: '07-responsive', desc: '视口、媒体查询、断点策略、容器查询' },
  { dir: '08-工程化与现代CSS', title: '工程化与现代 CSS', file: '08-modern-css', desc: 'CSS 变量、预处理器、方法论、性能优化' },
  { dir: '09-设计模式与实战', title: '设计模式与实战', file: '09-design-patterns', desc: '居中方案、圣杯布局、Clearfix、自定义形状' }
];

function convertCallouts(content) {
  let result = content;
  result = result.replace(
    /> \[!(warning|tip|important)\]\s*(.*?)\r?\n((?:>.*\r?\n?)*)/g,
    (match, type, title, body) => {
      const typeMap = { warning: 'warning', tip: 'tip', important: 'danger' };
      const vType = typeMap[type.toLowerCase()] || type.toLowerCase();
      const titleStr = title.trim();
      let convertedBody = body.replace(/^>\s?/gm, '').trim();
      return `::: ${vType}${titleStr ? ' ' + titleStr : ''}\n${convertedBody}\n:::`;
    }
  );
  return result;
}

function extractTitleAndStripH1(content) {
  const match = content.match(/^#\s+(.+)\r?\n+/m);
  const title = match ? match[1].trim() : '';
  const stripped = content.replace(/^#\s+.+\r?\n+/m, '');
  return { title, content: stripped };
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function migrateChapter(chapter) {
  const srcMd = path.join(INBOX, chapter.dir, 'README.md');
  if (!fs.existsSync(srcMd)) {
    console.log(`  ⚠️  跳过 ${chapter.dir} (README.md 不存在)`);
    return;
  }

  let raw = fs.readFileSync(srcMd, 'utf-8');
  const { title, content: stripped } = extractTitleAndStripH1(raw);
  let content = convertCallouts(stripped);

  const frontmatter = title ? `---\ntitle: ${title}\n---\n\n` : '';
  content = frontmatter + content;

  content += `\n\n---\n\n::: info 互动演示\n本章配套了交互式演示文件，可直观体验所学概念：\n\n[🎮 打开 ${chapter.title} 演示](/demos/02-css/${chapter.file}.html)\n:::\n`;

  const outDir = path.join(CSS_DOCS, chapter.file);
  ensureDir(outDir);
  fs.writeFileSync(path.join(outDir, 'index.md'), content, 'utf-8');

  const demoSrc = path.join(INBOX, chapter.dir, 'demo.html');
  if (fs.existsSync(demoSrc)) {
    const demoDst = path.join(PUBLIC_DEMOS, `${chapter.file}.html`);
    ensureDir(path.dirname(demoDst));
    fs.copyFileSync(demoSrc, demoDst);
    console.log(`  ✅ ${chapter.file}/index.md + demo → /demos/02-css/${chapter.file}.html`);
  } else {
    console.log(`  ✅ ${chapter.file}/index.md`);
  }
}

function createIndex() {
  const cardsHtml = CHAPTERS.map((ch, idx) => {
    return `<a href="/02-css/${ch.file}/" class="chapter-card">
  <div class="chapter-num">${String(idx + 1).padStart(2, '0')}</div>
  <div class="chapter-info">
    <h3>${ch.title}</h3>
    <p>${ch.desc}</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>`;
  }).join('\n');

  const indexMd = `# CSS 核心知识体系

系统化、可扩展的 CSS 学习笔记 · 9 大章节 · 50+ 知识点 · 速查语法

<div class="chapter-grid">
${cardsHtml}
</div>

<style>
.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.chapter-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 12px;
  transition: all 0.2s;
  background: var(--vp-c-bg-soft, #f6f6f7);
  text-decoration: none !important;
  color: inherit !important;
}
.chapter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: var(--vp-c-brand-1, #3451b2);
}
.chapter-num {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft, rgba(100, 108, 255, 0.14));
  color: var(--vp-c-brand-1, #3451b2);
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chapter-info { flex: 1; min-width: 0; }
.chapter-info h3 { margin: 0; font-size: 15px; color: inherit; }
.chapter-info p { margin: 4px 0 0; font-size: 13px; color: var(--vp-c-text-2, #606266); line-height: 1.4; }
.chapter-arrow {
  color: var(--vp-c-text-2, #606266);
  font-size: 18px;
  transition: transform 0.2s;
}
.chapter-card:hover .chapter-arrow {
  transform: translateX(4px);
  color: var(--vp-c-brand-1, #3451b2);
}
</style>

## 章节速览

| # | 章节 | 核心内容 |
|---|------|---------|
${CHAPTERS.map((ch, i) => `| ${i + 1} | [${ch.title}](/02-css/${ch.file}/) | ${ch.desc} |`).join('\n')}

## 笔记规范

- 每章末尾含 **速查语法** 小节，方便快速查阅
- 提示框类型：\`\`\`warning\`\`\` 注意、\`\`\`tip\`\`\` 技巧、\`\`\`danger\`\`\` 重点
- 配套 **互动演示** 文件，点击章节末尾链接即可打开
`;

  const indexPath = path.join(CSS_DOCS, 'index.md');
  fs.writeFileSync(indexPath, indexMd, 'utf-8');
  console.log('  ✅ docs/02-css/index.md');
}

function main() {
  console.log('🚀 开始迁移 CSS 笔记到 VitePress...\n');

  ensureDir(CSS_DOCS);
  ensureDir(PUBLIC_DEMOS);

  console.log('📝 迁移章节内容...');
  CHAPTERS.forEach(migrateChapter);

  console.log('\n🏠 创建 CSS 章节首页...');
  createIndex();

  console.log('\n✨ 迁移完成！');
  console.log(`\n📂 迁移目标: ${CSS_DOCS}`);
  console.log(`🎮 演示文件: ${PUBLIC_DEMOS}`);
  console.log('\n下一步: 运行 `npm run build` 验证构建');
}

main();