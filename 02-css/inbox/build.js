const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const ASSETS_SRC = path.join(ROOT, 'assets');
const ASSETS_DST = path.join(DIST, 'assets');

const CHAPTERS = [
  { dir: '01-基础语法与机制', title: '01. 基础语法与机制' },
  { dir: '02-选择器', title: '02. 选择器' },
  { dir: '03-盒子模型', title: '03. 盒子模型' },
  { dir: '04-布局与定位', title: '04. 布局与定位' },
  { dir: '05-视觉样式与美化', title: '05. 视觉样式与美化' },
  { dir: '06-变换与动画', title: '06. 变换与动画' },
  { dir: '07-响应式设计', title: '07. 响应式设计' },
  { dir: '08-工程化与现代CSS', title: '08. 工程化与现代CSS' },
  { dir: '09-设计模式与实战', title: '09. 设计模式与实战' }
];

const CALLOUT_MAP = {
  warning: '注意',
  tip: '提示',
  important: '重点'
};

function postProcessCallouts(html) {
  return html.replace(/<blockquote>\s*<p>\[!(warning|tip|important)\]\s*(.*?)<\/p>/gs, (match, type, content) => {
    const label = CALLOUT_MAP[type.toLowerCase()] || type;
    return `<blockquote class="${type.toLowerCase()}"><div class="callout-label">${label}</div><p>${content}</p>`;
  }).replace(/<\/blockquote>\s*<\/blockquote>/g, '</blockquote>');
}

function postProcessCodeBlocks(html) {
  return html.replace(/<pre><code class="language-(\w+)">/g, (match, lang) => {
    return `<pre><span class="lang-label">${lang}</span><code class="language-${lang}">`;
  });
}

function postProcessCheatsheet(html) {
  const cheatsheetHeading = html.indexOf('<h2>速查语法</h2>');
  if (cheatsheetHeading === -1) return html;
  return html.substring(0, cheatsheetHeading) +
    '<div class="cheatsheet">' +
    html.substring(cheatsheetHeading) +
    '</div>';
}

marked.setOptions({
  breaks: true,
  gfm: true
});

const TEMPLATE = `<!DOCTYPE html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | CSS 核心知识体系</title>
  <meta name="description" content="{description}">
  <link rel="stylesheet" href="{assetPath}assets/css/theme.css">
  <link rel="icon" href="{assetPath}assets/images/favicon.svg" type="image/svg+xml">
</head>
<body>
  <button class="nav-toggle" aria-label="切换导航">
    <span></span>
  </button>

  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>CSS 核心知识</h1>
        <div class="subtitle">系统化学习笔记</div>
      </div>
      <ul class="sidebar-nav">
        <li class="nav-section">导航</li>
        <li><a href="{indexPath}index.html"><span class="nav-index">🏠</span> 首页</a></li>
        <li class="nav-section">章节</li>
        {sidebarItems}
      </ul>
    </aside>

    <main class="main-content">
      <header class="content-header">
        <div class="breadcrumb">
          <a href="{indexPath}index.html">首页</a>
          <span class="sep">/</span>
          <span>{title}</span>
        </div>
        <div class="header-row">
          <h1>{title}</h1>
          {demoLink}
        </div>
        <p class="description">{description}</p>
      </header>

      <article class="content" id="content">
        {content}
      </article>
    </main>

    <aside class="toc" id="toc">
      <h4>本页目录</h4>
      <ul id="toc-list"></ul>
    </aside>
  </div>

  <button class="back-to-top" aria-label="返回顶部">↑</button>

  <script src="{assetPath}assets/js/main.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const content = document.querySelector('.content');
      if (!content) return;

      const headings = content.querySelectorAll('h2, h3');
      const tocList = document.getElementById('toc-list');
      if (tocList && headings.length > 0) {
        headings.forEach((h, i) => {
          if (!h.id) h.id = 'section-' + i;
          const level = h.tagName === 'H2' ? 2 : 3;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#' + h.id;
          a.textContent = h.textContent;
          a.style.paddingLeft = (level - 2) * 12 + 'px';
          li.appendChild(a);
          tocList.appendChild(li);
        });
      }

      const toc = document.getElementById('toc');
      if (toc && headings.length > 0) {
        toc.style.display = 'block';
      }
    });
  </script>
</body>
</html>`;

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  ensureDir(dst);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function getDescription(htmlContent) {
  const noBlockquote = htmlContent.replace(/<blockquote[^>]*>.*?<\/blockquote>/gs, '');
  const pMatch = noBlockquote.match(/<p[^>]*>(.*?)<\/p>/);
  if (pMatch && pMatch[1]) {
    const text = pMatch[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 10) return cleanDescription(text);
  }
  const bqMatch = htmlContent.match(/<blockquote[^>]*>(.*?)<\/blockquote>/s);
  if (bqMatch && bqMatch[1]) {
    const innerPMatch = bqMatch[1].match(/<p[^>]*>(.*?)<\/p>/);
    if (innerPMatch && innerPMatch[1]) {
      const text = innerPMatch[1].replace(/<[^>]+>/g, '').trim();
      if (text.length > 5) return cleanDescription(text);
    }
  }
  return 'CSS 学习笔记章节';
}

function cleanDescription(text) {
  let cleaned = text.replace(/\[!\w+\]\s*/g, '');
  if (cleaned.length > 80) cleaned = cleaned.substring(0, 77) + '...';
  return cleaned;
}

function stripFirstH1(mdContent) {
  return mdContent.replace(/^#\s+.+\n+/m, '');
}

function generateSidebar(currentDir) {
  return CHAPTERS.map((ch, idx) => {
    const href = currentDir ? `../${ch.dir}/index.html` : `${ch.dir}/index.html`;
    return `<li><a href="${href}"><span class="nav-index">${idx + 1}</span> ${ch.dir.replace(/^\d+-/, '')}</a></li>`;
  }).join('\n        ');
}

function buildChapter(chapter) {
  const mdPath = path.join(ROOT, chapter.dir, 'README.md');
  if (!fs.existsSync(mdPath)) {
    console.log(`  ⚠️  跳过 ${chapter.dir} (README.md 不存在)`);
    return;
  }

  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const cleanedMd = stripFirstH1(mdContent);
  const rawHtml = marked.parse(cleanedMd);
  const processedHtml = postProcessCheatsheet(postProcessCodeBlocks(postProcessCallouts(rawHtml)));
  const description = getDescription(processedHtml);

  const demoPath = path.join(ROOT, chapter.dir, 'demo.html');
  const hasDemo = fs.existsSync(demoPath);

  const assetPath = '../';
  const indexPath = '../';
  const sidebarItems = generateSidebar(true);

  const html = TEMPLATE
    .replaceAll('{title}', chapter.title)
    .replaceAll('{description}', description)
    .replace('{content}', processedHtml)
    .replace('{sidebarItems}', sidebarItems)
    .replaceAll('{assetPath}', assetPath)
    .replaceAll('{indexPath}', indexPath)
    .replace('{demoLink}', hasDemo ? `<a href="demo.html" class="demo-link" target="_blank">🎮 互动演示</a>` : '');

  const outDir = path.join(DIST, chapter.dir);
  ensureDir(outDir);

  if (hasDemo) {
    fs.copyFileSync(demoPath, path.join(outDir, 'demo.html'));
  }

  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  console.log(`  ✅ ${chapter.dir}/index.html`);
}

function buildIndex() {
  const chaptersList = CHAPTERS.map((ch, idx) => {
    const descMap = {
      '01-基础语法与机制': 'CSS 语法结构、引入方式、层叠优先级、继承性、单位体系',
      '02-选择器': '基础选择器、组合选择器、属性选择器、伪类与伪元素',
      '03-盒子模型': '标准/怪异盒模型、margin/padding/border、外边距合并',
      '04-布局与定位': '文档流、浮动、定位、Flexbox、Grid 布局',
      '05-视觉样式与美化': '文本字体、颜色背景、边框圆角、滤镜与混合模式',
      '06-变换与动画': '2D/3D 变换、过渡、关键帧动画、性能优化',
      '07-响应式设计': '视口、媒体查询、断点策略、容器查询',
      '08-工程化与现代CSS': 'CSS 变量、预处理器、方法论、性能优化',
      '09-设计模式与实战': '居中方案、圣杯布局、Clearfix、自定义形状'
    };
    const demoExists = fs.existsSync(path.join(ROOT, ch.dir, 'demo.html'));
    const demoBadge = demoExists ? `<span class="demo-badge">🎮 演示</span>` : '';
    return `
        <div class="chapter-card">
          <a href="${ch.dir}/index.html" class="chapter-link">
            <div class="chapter-num">${String(idx + 1).padStart(2, '0')}</div>
            <div class="chapter-info">
              <h3>${ch.dir.replace(/^\d+-/, '')} ${demoBadge}</h3>
              <p>${descMap[ch.dir] || ''}</p>
            </div>
            <div class="chapter-arrow">→</div>
          </a>
        </div>`;
  }).join('');

  const sidebarItems = generateSidebar(false);
  const assetPath = '';
  const indexPath = '';

  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS 核心知识体系</title>
  <link rel="stylesheet" href="assets/css/theme.css">
  <style>
    .hero {
      text-align: center;
      padding: 60px 20px 40px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      border-radius: var(--radius-lg);
      margin-bottom: 48px;
    }
    .hero h1 { font-size: 36px; margin: 0 0 12px; }
    .hero p { font-size: 17px; opacity: 0.9; margin: 0; }
    .chapter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .chapter-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      transition: all 0.2s;
      overflow: hidden;
    }
    .chapter-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }
    .chapter-link {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      text-decoration: none;
      color: inherit;
    }
    .chapter-num {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--primary-light);
      color: var(--primary);
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .chapter-info { flex: 1; min-width: 0; }
    .chapter-info h3 { margin: 0 0 4px; font-size: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .demo-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      background: var(--primary-light);
      color: var(--primary);
      border-radius: 10px;
      vertical-align: middle;
    }
    .chapter-info p { margin: 0; font-size: 13px; color: var(--text-secondary); line-height: 1.4; }
    .chapter-arrow {
      color: var(--text-secondary);
      font-size: 20px;
      transition: transform 0.2s;
    }
    .chapter-card:hover .chapter-arrow {
      transform: translateX(4px);
      color: var(--primary);
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      margin: 40px 0;
      padding: 24px;
      background: var(--bg-secondary);
      border-radius: var(--radius);
    }
    .stat { text-align: center; }
    .stat-num { font-size: 28px; font-weight: 700; color: var(--primary); }
    .stat-label { font-size: 13px; color: var(--text-secondary); }
  </style>
</head>
<body>
  <button class="nav-toggle" aria-label="切换导航">
    <span></span>
  </button>

  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>CSS 核心知识</h1>
        <div class="subtitle">系统化学习笔记</div>
      </div>
      <ul class="sidebar-nav">
        <li class="nav-section">导航</li>
        <li><a href="index.html"><span class="nav-index">🏠</span> 首页</a></li>
        <li class="nav-section">章节</li>
        ${sidebarItems}
      </ul>
    </aside>

    <main class="main-content">
      <section class="hero">
        <h1>CSS 核心知识体系</h1>
        <p>9 大章节 · 系统化架构 · 速查语法</p>
      </section>

      <section class="stats">
        <div class="stat">
          <div class="stat-num">9</div>
          <div class="stat-label">核心章节</div>
        </div>
        <div class="stat">
          <div class="stat-num">50+</div>
          <div class="stat-label">知识点</div>
        </div>
        <div class="stat">
          <div class="stat-num">100+</div>
          <div class="stat-label">代码示例</div>
        </div>
      </section>

      <section class="chapter-grid">
        ${chaptersList}
      </section>
    </main>
  </div>

  <button class="back-to-top" aria-label="返回顶部">↑</button>
  <script src="assets/js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml, 'utf-8');
  console.log('  ✅ index.html');
}

function build() {
  console.log('🚀 开始构建 CSS 笔记系统...\n');

  ensureDir(DIST);

  console.log('📦 复制共享资源...');
  if (fs.existsSync(ASSETS_SRC)) {
    copyDir(ASSETS_SRC, ASSETS_DST);
    console.log('  ✅ assets/');
  }

  console.log('\n📝 构建章节页面...');
  CHAPTERS.forEach(buildChapter);

  console.log('\n🏠 构建首页...');
  buildIndex();

  console.log('\n✨ 构建完成！');
  console.log(`\n📂 输出目录: ${DIST}`);
  console.log('🚀 本地预览: npx serve dist/ 或直接打开 dist/index.html');
}

build();
