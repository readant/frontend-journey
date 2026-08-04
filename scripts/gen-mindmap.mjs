/**
 * 思维导图生成脚本
 * 读取 mindmap-data.yml → 生成 markmap 格式的 Markdown → 写入 mindmap-content.md
 * 修改 YAML 后运行: npm run gen:mindmap
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MINDMAP_DIR = join(__dirname, '..', 'docs', '02-css', 'mindmap')

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

console.log(`✓ 思维导图内容已生成: ${outPath}`)
console.log(`  分支: ${data.branches.length} 个`)
console.log(`  节点: ${data.branches.reduce((s, b) => s + b.children.length, 0)} 个`)
