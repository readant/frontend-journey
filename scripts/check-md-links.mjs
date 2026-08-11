/**
 * 死链检查脚本 —— 扫描 docs 下所有 .md 文件中的本地链接，验证目标文件/锚点是否存在。
 *
 * 覆盖的链接形式：
 *  - Markdown 链接 / 图片：[text](path)  ![alt](path)
 *  - 相对路径（相对当前文件）、站点根路径（/xxx，相对 docs 根）
 *  - 带锚点（#foo）的链接：文件存在性 + 目标文件中锚点存在性
 *  - 组件引用（<Foo />）不检查；外部 http(s) 链接不检查；纯锚点（#foo）不检查
 *
 * 用法：node scripts/check-md-links.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");

/** 递归收集 docs 下所有 .md 文件 */
function collectMd(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return collectMd(full);
    if (e.isFile() && e.name.endsWith(".md")) return [full];
    return [];
  });
}

/** 提取文本中的所有中文字符串字面量锚点（markdown 标题自动生成 slug） */
function collectHeadings(file) {
  const content = readFileSync(file, "utf8");
  const headings = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^#{1,6}\s+(.*)$/);
    if (m) {
      headings.push(
        slugify(
          m[1]
            .replace(/`([^`]+)`/g, "$1")
            .replace(/[\[\]<>{}]/g, "")
            .trim(),
        ),
      );
    }
  }
  return new Set(headings);
}

/** GitHub 风格 slug 生成 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** 将 md 文件名解析为对应用户路由（用于锚点判断时可忽略，仅作参考） */
const allMd = collectMd(DOCS);
const mdSet = new Set(allMd);

const problems = [];
let checked = 0;

for (const file of allMd) {
  const content = readFileSync(file, "utf8");
  // 同时匹配 [text](...) 与 ![alt](...)
  const linkRe = /!?\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(content)) !== null) {
    let target = m[1].trim();
    if (!target || target.startsWith("http://") || target.startsWith("https://")) continue;

    // 分离锚点
    let hash = "";
    const hashIdx = target.indexOf("#");
    if (hashIdx !== -1) {
      hash = target.slice(hashIdx + 1);
      target = target.slice(0, hashIdx);
    }
    // 分离查询参数（忽略 query）
    const qIdx = target.indexOf("?");
    if (qIdx !== -1) target = target.slice(0, qIdx);

    target = decodeURIComponent(target).trim();
    if (!target) continue; // 纯锚点
    if (target.endsWith("...")) continue; // 示例占位符（如 /03-js/...）

    checked++;

    // 目标解析：绝对路径（/xxx）相对 docs，否则相对当前文件目录
    let abs;
    if (target.startsWith("/")) {
      abs = normalize(join(DOCS, target));
    } else {
      abs = normalize(join(dirname(file), target));
    }

    // VitePress 路由约定：
    //  - 以 / 结尾的路径 → 目录下的 index.md
    //  - 无扩展名且文件不存在 → 尝试补 .md
    //  - public/ 下资源映射到站点根（/xxx → docs/public/xxx）
    const PUBLIC = join(DOCS, "public");
    const resolveFile = (p) => {
      if (existsSync(p) && statSync(p).isFile()) return p;
      if (existsSync(p) && statSync(p).isDirectory() && existsSync(join(p, "index.md")))
        return join(p, "index.md");
      if (!/\.\w+$/.test(p) && existsSync(p + ".md")) return p + ".md";
      // 站点根资源回退到 public/
      if (p.startsWith(DOCS)) {
        const pub = PUBLIC + p.slice(DOCS.length);
        if (existsSync(pub) && statSync(pub).isFile()) return pub;
      }
      return null;
    };

    const absFile = resolveFile(abs);
    if (!absFile) {
      problems.push({ file: relative(file), target: m[1].trim(), reason: "目标不存在" });
      continue;
    }
    abs = absFile;

    const exists = true;
    if (!exists) {
      problems.push({ file: relative(file), target: m[1].trim(), reason: "目标不存在" });
      continue;
    }

    // 若为 md 且带锚点，校验目标文件中锚点是否存在
    if (hash && abs.endsWith(".md")) {
      const headings = collectHeadings(abs);
      if (!headings.has(slugify(hash))) {
        problems.push({ file: relative(file), target: m[1].trim(), reason: `锚点 #${hash} 不存在` });
      }
    }
  }
}

function relative(p) {
  return normalize(join(".", "docs", p.slice(DOCS.length))).replace(/\\/g, "/");
}

console.log(`\n扫描完成：${allMd.length} 个 md 文件，${checked} 个本地链接被验证。`);
if (problems.length === 0) {
  console.log("✅ 未发现死链。");
} else {
  console.log(`\n发现 ${problems.length} 处问题：`);
  for (const p of problems) {
    console.log(`  ❌ ${p.file}\n     → ${p.target}\n       原因：${p.reason}`);
  }
}
console.log("");