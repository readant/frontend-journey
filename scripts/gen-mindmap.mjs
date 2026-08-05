/**
 * 思维导图生成脚本（多模块支持）
 * 扫描 docs/ 下所有含 mindmap 目录的模块，逐个读取 mindmap-data.yml
 * → 生成 markmap 格式的 Markdown → 写入各模块的 mindmap-content.md
 * 修改 YAML 后运行: npm run gen:mindmap
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = join(__dirname, '..', 'docs')

// 扫描 docs/ 下所有含 mindmap 子目录的模块（如 01-html / 02-css / 03-js）
const modules = readdirSync(DOCS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(DOCS_DIR, d.name, 'mindmap', 'mindmap-data.yml')))
  .map(d => d.name)

if (modules.length === 0) {
  console.warn('未找到任何 mindmap-data.yml，请先创建数据源文件')
  process.exit(0)
}

let totalBranches = 0
let totalNodes = 0

for (const mod of modules) {
  const MINDMAP_DIR = join(DOCS_DIR, mod, 'mindmap')

  // 读取 YAML 数据源
  const dataPath = join(MINDMAP_DIR, 'mindmap-data.yml')
  const data = parse(readFileSync(dataPath, 'utf-8'))

  // 生成 markmap 格式的 Markdown（嵌套列表）
  let md = `# ${data.title}\n\n`

  for (const branch of data.branches) {
    // 二级标题作为分支
    md += `## ${branch.name}\n\n`
    for (const child of branch.children) {
      // 列表项：[编号 名称](链接)
      md += `- [${child.num} ${child.name}](${child.link})\n`
      // 子项：关键词
      md += `  - ${child.keys}\n`
    }
    md += '\n'
  }

  // 写入 markmap 内容文件
  const outPath = join(MINDMAP_DIR, 'mindmap-content.md')
  writeFileSync(outPath, md, 'utf-8')

  totalBranches += data.branches.length
  totalNodes += data.branches.reduce((s, b) => s + b.children.length, 0)
  console.log(`✓ [${mod}] 思维导图已生成: ${outPath}`)
  console.log(`  分支: ${data.branches.length} 个, 节点: ${data.branches.reduce((s, b) => s + b.children.length, 0)} 个`)
}

console.log(`\n✅ 共生成 ${modules.length} 个模块的思维导图`)
console.log(`   总计分支: ${totalBranches}, 节点: ${totalNodes}`)
