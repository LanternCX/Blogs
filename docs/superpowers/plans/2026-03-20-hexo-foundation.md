# Hexo 基础骨架 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在当前仓库中建立可本地运行的 Hexo 基础站点, 并完成一批现有 Markdown 内容到 Hexo 结构的抽样迁移验证。

**Architecture:** 站点本体采用标准 Hexo 目录结构, 普通文章进入 `source/_posts/`, 独立页面进入 `source/<page>/index.md`。迁移逻辑独立放在 `scripts/migration/` 下, 先用 Node 内置测试覆盖标题提取、Git author date 提取、内容分流、路径映射与样本迁移记录, 再用脚本生成抽样内容与映射文档。

**Tech Stack:** Node.js, Hexo, npm scripts, Node built-in test runner, Markdown, YAML front matter

---

## File Structure

### New files

- `package.json`
- `package-lock.json`
- `.gitignore`
- `_config.yml`
- `scaffolds/post.md`
- `scaffolds/page.md`
- `source/about/index.md`
- `source/friends/index.md`
- `source/_posts/HZCU 2025 Freshman STL.md`
- `source/_posts/OOP.md`
- `source/_posts/3DOF-Robotic-Arm.md`
- `scripts/migration/extract-title.cjs`
- `scripts/migration/git-dates.cjs`
- `scripts/migration/classify-content.cjs`
- `scripts/migration/render-front-matter.cjs`
- `scripts/migration/path-mapper.cjs`
- `scripts/migration/sample-set.cjs`
- `scripts/migration/migrate-samples.cjs`
- `test/migration/extract-title.test.cjs`
- `test/migration/git-dates.test.cjs`
- `test/migration/classify-content.test.cjs`
- `test/migration/render-front-matter.test.cjs`
- `test/migration/path-mapper.test.cjs`
- `test/migration/migrate-samples.test.cjs`
- `docs/migration/hexo-sample-mapping.md`

### Existing files to reference

- `README.md`
- `Pages/about.md`
- `Pages/friends.md`
- `ACM-ICPC/HZCU 2025 Freshman STL.md`
- `Note/OOP.md`
- `Robotic/3DOF-Robotic-Arm.md`
- `docs/superpowers/specs/2026-03-20-hexo-foundation-design.md`

### File responsibilities

- `package.json`: 定义 Hexo 依赖与开发命令
- `_config.yml`: 定义站点标题、语言、URL、目录与默认主题
- `scaffolds/*.md`: 定义后续新建文章和页面的基础 front matter 模板
- `scripts/migration/extract-title.cjs`: 提取正文中的第一个 Markdown 标题
- `scripts/migration/git-dates.cjs`: 构造 Git author date 查询命令并标准化 `date`/`updated`
- `scripts/migration/classify-content.cjs`: 判断内容属于 `post` 还是 `page`
- `scripts/migration/render-front-matter.cjs`: 将 front matter 与正文渲染成 Hexo 可读文档
- `scripts/migration/path-mapper.cjs`: 将源文件路径映射为 Hexo 目标路径
- `scripts/migration/sample-set.cjs`: 固定第一阶段抽样迁移的输入集合
- `scripts/migration/migrate-samples.cjs`: 组合各迁移规则并产出样本文件与映射说明
- `test/migration/*.test.cjs`: 覆盖迁移规则与样本迁移流程的 TDD 测试
- `source/about/index.md`、`source/friends/index.md`: 独立页面迁移样本
- `source/_posts/*.md`: 普通文章迁移样本, 文件名默认沿用原 Markdown 文件名
- `docs/migration/hexo-sample-mapping.md`: 记录抽样来源文件、目标路径、分类映射与人工复核项

### Task 1: 初始化 Hexo 站点骨架

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.gitignore`
- Create: `_config.yml`
- Create: `scaffolds/post.md`
- Create: `scaffolds/page.md`
- Modify: `README.md`

- [ ] **Step 1: 写入最小 `package.json` 依赖与脚本**

```json
{
  "name": "blogs",
  "private": true,
  "scripts": {
    "test": "node --test test/**/*.test.cjs",
    "hexo:clean": "hexo clean",
    "hexo:generate": "hexo generate",
    "hexo:serve": "hexo server",
    "migrate:samples": "node scripts/migration/migrate-samples.cjs"
  },
  "dependencies": {
    "hexo": "^7.3.0",
    "hexo-cli": "^4.3.2",
    "js-yaml": "^4.1.0"
  }
}
```

- [ ] **Step 2: 安装依赖并生成锁文件**

Run: `npm install`
Expected: 成功生成 `package-lock.json`, 且无依赖解析错误

- [ ] **Step 3: 写入站点配置 `_config.yml`**

```yaml
title: Caoxin Blog
subtitle: ''
description: ''
author: caoxin
language: zh-CN
timezone: Asia/Shanghai
url: https://www.caoxin.xyz
root: /
permalink: :year/:month/:day/:title/
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
theme: landscape
```

- [ ] **Step 4: 写入文章与页面 scaffold**

`scaffolds/post.md`:

```md
---
title: {{ title }}
date: {{ date }}
updated: {{ date }}
categories:
---
```

`scaffolds/page.md`:

```md
---
title: {{ title }}
date: {{ date }}
updated: {{ date }}
---
```

- [ ] **Step 5: 更新 `README.md` 为最小用户入口**

要求至少包含:

- 项目介绍
- 快速开始
- 开发文档链接
- 部署文档占位链接

- [ ] **Step 6: 运行 Hexo 基础命令验证骨架可执行**

Run: `npx hexo version`
Expected: 输出 Hexo 与 Node 版本信息, 命令成功退出

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .gitignore _config.yml scaffolds README.md
git commit -m "feat: bootstrap hexo site skeleton"
```

提交前必须先征求用户确认, 并追加 co-author trailer。

### Task 2: 为迁移规则写失败测试

**Files:**
- Create: `test/migration/extract-title.test.cjs`
- Create: `test/migration/git-dates.test.cjs`
- Create: `test/migration/classify-content.test.cjs`
- Create: `test/migration/render-front-matter.test.cjs`
- Create: `test/migration/path-mapper.test.cjs`
- Create: `test/migration/migrate-samples.test.cjs`

- [ ] **Step 1: 为标题提取逻辑写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')
const { extractTitle } = require('../../scripts/migration/extract-title.cjs')

test('extractTitle reads the first markdown heading', () => {
  const input = '导语\n\n## 第一标题\n\n### 第二标题\n'
  assert.equal(extractTitle(input), '第一标题')
})
```

- [ ] **Step 2: 为 Git 时间命令与标准化逻辑写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')
const { buildGitDateCommand, normalizeGitDates } = require('../../scripts/migration/git-dates.cjs')

test('buildGitDateCommand uses author date format without follow', () => {
  assert.equal(buildGitDateCommand('Note/OOP.md'), 'git log --format=%aI -- "Note/OOP.md"')
})

test('normalizeGitDates returns date and updated fields', () => {
  const result = normalizeGitDates({
    lines: ['2024-02-01T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  })

  assert.deepEqual(result, {
    date: '2024-01-01T00:00:00+08:00',
    updated: '2024-02-01T00:00:00+08:00'
  })
})
```

- [ ] **Step 3: 为页面与文章分流逻辑写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')
const { classifyContent } = require('../../scripts/migration/classify-content.cjs')

test('classifyContent marks Pages/about.md as page', () => {
  assert.equal(classifyContent('Pages/about.md').kind, 'page')
})

test('classifyContent marks Note/OOP.md as post', () => {
  assert.equal(classifyContent('Note/OOP.md').kind, 'post')
})
```

- [ ] **Step 4: 为 front matter 渲染逻辑写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')
const { renderFrontMatterDocument } = require('../../scripts/migration/render-front-matter.cjs')

test('renderFrontMatterDocument prepends yaml block', () => {
  const result = renderFrontMatterDocument({
    frontMatter: {
      title: '文章标题',
      date: '2024-01-01T00:00:00+08:00',
      updated: '2024-02-01T00:00:00+08:00',
      categories: ['Note']
    },
    body: '## 文章标题\n\n正文'
  })

  assert.match(result, /^---\n/)
  assert.match(result, /title: 文章标题/)
  assert.match(result, /categories:\n  - Note/)
})
```

- [ ] **Step 5: 为路径映射逻辑写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')
const { mapTargetPath } = require('../../scripts/migration/path-mapper.cjs')

test('mapTargetPath maps page into source directory', () => {
  assert.equal(mapTargetPath('Pages/friends.md', { kind: 'page', slug: 'friends' }), 'source/friends/index.md')
})

test('mapTargetPath keeps original post file names', () => {
  assert.equal(mapTargetPath('Note/OOP.md', { kind: 'post', fileName: 'OOP.md' }), 'source/_posts/OOP.md')
})
```

- [ ] **Step 6: 为抽样迁移记录写失败测试**

```js
const test = require('node:test')
const assert = require('node:assert/strict')
const { buildSampleRecord } = require('../../scripts/migration/migrate-samples.cjs')

test('buildSampleRecord maps top-level directory into categories for posts', () => {
  const record = buildSampleRecord({
    sourcePath: 'Note/OOP.md',
    markdown: '## OOP\n\n正文',
    gitDateLines: ['2024-01-03T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  })

  assert.equal(record.kind, 'post')
  assert.equal(record.targetPath, 'source/_posts/OOP.md')
  assert.deepEqual(record.frontMatter.categories, ['Note'])
})

test('buildSampleRecord omits categories for pages', () => {
  const record = buildSampleRecord({
    sourcePath: 'Pages/about.md',
    markdown: '## 关于\n\n正文',
    gitDateLines: ['2024-01-02T00:00:00+08:00', '2024-01-01T00:00:00+08:00']
  })

  assert.equal(record.kind, 'page')
  assert.equal(record.targetPath, 'source/about/index.md')
  assert.equal('categories' in record.frontMatter, false)
})
```

- [ ] **Step 7: 运行测试并确认失败**

Run: `npm test`
Expected: FAIL, 报错缺少 `scripts/migration/*.cjs` 对应实现

- [ ] **Step 8: Commit**

```bash
git add test/migration
git commit -m "test: define migration rule expectations"
```

提交前必须先征求用户确认, 并追加 co-author trailer。

### Task 3: 实现迁移规则模块

**Files:**
- Create: `scripts/migration/extract-title.cjs`
- Create: `scripts/migration/git-dates.cjs`
- Create: `scripts/migration/classify-content.cjs`
- Create: `scripts/migration/render-front-matter.cjs`
- Create: `scripts/migration/path-mapper.cjs`
- Create: `scripts/migration/sample-set.cjs`

- [ ] **Step 1: 实现标题提取模块**

```js
function extractTitle(markdown) {
  const lines = markdown.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(/^#{1,6}\s+(.+)$/)
    if (match) {
      return match[1].trim()
    }
  }
  throw new Error('Missing markdown heading')
}

module.exports = { extractTitle }
```

- [ ] **Step 2: 实现 Git 时间命令与标准化模块**

```js
function buildGitDateCommand(relativePath) {
  return `git log --format=%aI -- "${relativePath}"`
}

function normalizeGitDates({ lines }) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error('Missing git author dates')
  }

  return {
    date: lines[lines.length - 1],
    updated: lines[0]
  }
}

module.exports = { buildGitDateCommand, normalizeGitDates }
```

- [ ] **Step 3: 实现内容分流模块**

```js
const path = require('node:path')

function classifyContent(relativePath) {
  const normalized = relativePath.split(path.sep).join('/')
  if (normalized.startsWith('Pages/')) {
    return { kind: 'page', slug: path.basename(normalized, '.md').toLowerCase() }
  }

  return { kind: 'post' }
}

module.exports = { classifyContent }
```

- [ ] **Step 4: 实现 front matter 渲染模块**

```js
const yaml = require('js-yaml')

function renderFrontMatterDocument({ frontMatter, body }) {
  const header = yaml.dump(frontMatter, { lineWidth: 120 }).trimEnd()
  return `---\n${header}\n---\n\n${body.trimStart()}`
}

module.exports = { renderFrontMatterDocument }
```

- [ ] **Step 5: 实现目标路径映射模块**

```js
function mapTargetPath(_sourcePath, meta) {
  if (meta.kind === 'page') {
    return `source/${meta.slug}/index.md`
  }

  return `source/_posts/${meta.fileName}`
}

module.exports = { mapTargetPath }
```

- [ ] **Step 6: 固定第一阶段样本集合**

```js
const SAMPLE_PATHS = [
  'ACM-ICPC/HZCU 2025 Freshman STL.md',
  'Note/OOP.md',
  'Robotic/3DOF-Robotic-Arm.md',
  'Pages/about.md',
  'Pages/friends.md'
]

module.exports = { SAMPLE_PATHS }
```

- [ ] **Step 7: 运行测试并确认通过**

Run: `npm test`
Expected: PASS, 除 `migrate-samples.cjs` 相关测试外其余规则测试通过, 或仅剩样本迁移记录测试失败

- [ ] **Step 8: Commit**

```bash
git add scripts/migration test/migration
git commit -m "feat: implement hexo migration rules"
```

提交前必须先征求用户确认, 并追加 co-author trailer。

### Task 4: 实现抽样迁移脚本与映射文档

**Files:**
- Create: `scripts/migration/migrate-samples.cjs`
- Create: `docs/migration/hexo-sample-mapping.md`

- [ ] **Step 1: 运行当前测试并确认仅剩样本迁移记录相关失败**

Run: `npm test`
Expected: FAIL, 错误集中在 `test/migration/migrate-samples.test.cjs`

- [ ] **Step 2: 实现 `buildSampleRecord` 组装逻辑**

```js
function buildSampleRecord({ sourcePath, markdown, gitDateLines }) {
  // 调用 classifyContent、extractTitle、normalizeGitDates、mapTargetPath
  // post 的 categories 取 sourcePath 的一级目录
  // page 不写 categories
}
```

- [ ] **Step 3: 在脚本中实现 Git author date 读取逻辑**

实现要求:

- 使用 `git log --format=%aI -- "<relative-path>"` 读取当前路径历史
- 取第一行作为 `updated` 的来源, 最后一行作为 `date` 的来源
- 若命令无输出, 将该文件记入人工复核项
- 第一阶段不引入 `--follow`, 避免偏离 spec 的重命名策略

- [ ] **Step 4: 在脚本中实现样本文件写入逻辑**

要求:

- 普通文章写入 `source/_posts/`
- 页面写入 `source/<slug>/index.md`
- 普通文章目标文件名默认沿用原 Markdown 文件名
- 正文保留原 Markdown 内容, 不主动删除原有首个标题
- 标题缺失或 Git 时间缺失时, 仅写入人工复核项, 不伪造元数据

- [ ] **Step 5: 生成迁移说明文档 `docs/migration/hexo-sample-mapping.md`**

文档至少包含:

- 来源路径
- 目标路径
- 内容类型 `post` / `page`
- `categories` 映射结果
- 人工复核项清单

- [ ] **Step 6: 运行测试并确认通过**

Run: `npm test`
Expected: PASS, 包含 `test/migration/migrate-samples.test.cjs` 在内的全部测试通过

- [ ] **Step 7: 运行抽样迁移命令**

Run: `npm run migrate:samples`
Expected: 成功生成 5 个目标 Markdown 文件与 1 份迁移说明文档

- [ ] **Step 8: Commit**

```bash
git add scripts/migration/migrate-samples.cjs docs/migration source/about source/friends source/_posts
git commit -m "feat: generate sample hexo content"
```

提交前必须先征求用户确认, 并追加 co-author trailer。

### Task 5: 校验 Hexo 站点渲染闭环

**Files:**
- Modify: `_config.yml`
- Modify: `docs/migration/hexo-sample-mapping.md`
- Modify: `source/about/index.md`
- Modify: `source/friends/index.md`
- Modify: `source/_posts/HZCU 2025 Freshman STL.md`
- Modify: `source/_posts/OOP.md`
- Modify: `source/_posts/3DOF-Robotic-Arm.md`

- [ ] **Step 1: 执行清理命令**

Run: `npm run hexo:clean`
Expected: 成功清理缓存与旧生成产物

- [ ] **Step 2: 执行生成命令**

Run: `npm run hexo:generate`
Expected: PASS, 生成 `public/` 目录且无 front matter 解析错误

- [ ] **Step 3: 执行本地预览命令并验证关键路径**

Run: `npm run hexo:serve`
Expected: 本地服务启动成功, 可访问首页、`/about/`、`/friends/` 和 3 篇样本文章详情页

- [ ] **Step 4: 若生成或预览失败, 最小修正配置或样本内容**

修正范围限制为:

- `_config.yml`
- 抽样迁移生成的 5 个 Markdown 文件
- `docs/migration/hexo-sample-mapping.md` 中的人工复核说明

- [ ] **Step 5: 再次运行测试与站点命令**

Run: `npm test && npm run hexo:clean && npm run hexo:generate`
Expected: 全部通过

- [ ] **Step 6: Commit**

```bash
git add _config.yml docs/migration source test scripts
git commit -m "fix: verify hexo sample site rendering"
```

提交前必须先征求用户确认, 并追加 co-author trailer。

### Task 6: 文档收尾与交付说明

**Files:**
- Modify: `README.md`
- Modify: `docs/migration/hexo-sample-mapping.md`

- [ ] **Step 1: 更新 `README.md` 的快速开始命令**

要求至少包含:

- `npm install`
- `npm test`
- `npm run migrate:samples`
- `npm run hexo:generate`
- `npm run hexo:serve`

- [ ] **Step 2: 在迁移说明文档中补充人工复核项和后续建议**

至少补充:

- 哪些文件因缺少标题或 Git 时间需要人工处理
- 全量迁移前应先解决哪些问题

- [ ] **Step 3: 交付前执行最终验证**

Run: `npm test && npm run migrate:samples && npm run hexo:clean && npm run hexo:generate`
Expected: 全部通过, 且输出与文档描述一致

- [ ] **Step 4: 整理交付说明**

交付说明至少包含:

- 已建立 Hexo 站点骨架
- 已完成哪些样本迁移
- 已验证哪些命令
- 哪些内容仍属于人工复核或下一阶段工作
- 尚未提交时需要提醒用户确认 commit

- [ ] **Step 5: Commit**

```bash
git add README.md docs/migration
git commit -m "docs: document hexo migration workflow"
```

提交前必须先征求用户确认, 并追加 co-author trailer。
