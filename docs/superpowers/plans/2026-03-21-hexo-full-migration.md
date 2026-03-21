# Hexo 全量迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有博客内容重组到 `content/` 作为统一内容源, 并基于该内容源全量生成 Hexo `source/` 文章与页面, 同时产出完整迁移报告与人工复核清单。

**Architecture:** 迁移流程拆成规则定义、Git 元数据采集、目录重组、内容扫描、单文件迁移、资源处理、托管输出清理、报告生成与站点验证 8 个独立单元。`content/` 保存博客内容源, `source/` 只保存 Hexo 最终消费结果, `.migration/` 保存 README 白名单、Git 元数据与页面托管清单, 使全量迁移可重复执行且不污染站点消费目录。

**Tech Stack:** Node.js, Hexo, npm scripts, Node built-in test runner, Markdown, YAML front matter, git metadata, filesystem migration utilities

---

## File Structure

### New files

- `.migration/include-readmes.json`
- `.migration/git-meta.json`
- `.migration/pages-manifest.json`
- `content/.gitkeep`
- `docs/migration/hexo-full-migration-report.md`
- `scripts/migration/collect-git-meta.cjs`
- `scripts/migration/content-rules.cjs`
- `scripts/migration/content-scan.cjs`
- `scripts/migration/content-reorganize.cjs`
- `scripts/migration/content-record.cjs`
- `scripts/migration/resource-handler.cjs`
- `scripts/migration/source-cleanup.cjs`
- `scripts/migration/migrate-all.cjs`
- `test/migration/collect-git-meta.test.cjs`
- `test/migration/content-rules.test.cjs`
- `test/migration/content-scan.test.cjs`
- `test/migration/content-reorganize.test.cjs`
- `test/migration/content-record.test.cjs`
- `test/migration/resource-handler.test.cjs`
- `test/migration/source-cleanup.test.cjs`
- `test/migration/migrate-all.test.cjs`

### Existing files to modify

- `package.json`
- `package-lock.json`
- `README.md`
- `scripts/migration/classify-content.cjs`
- `scripts/migration/path-mapper.cjs`
- `scripts/migration/migrate-samples.cjs`
- `test/migration/hexo-cli.test.cjs`
- `test/migration/hexo-rendering.test.cjs`

### Directories to move under `content/`

- `ACM-ICPC/`
- `Agent/`
- `Debug-Lab/`
- `EDC/`
- `Note/`
- `Other/`
- `Photography/`
- `Robotic/`
- `Smart Car/`
- `Pages/`

### Task 1: 固化内容判定与 README 白名单规则

**Files:**
- Create: `.migration/include-readmes.json`
- Create: `scripts/migration/content-rules.cjs`
- Create: `test/migration/content-rules.test.cjs`
- Modify: `package.json`

- [ ] **Step 1: 写失败测试覆盖规则边界**
覆盖 README 默认排除、`.marp.md` 排除、`content/Pages/*.md` 判定为 `page`、其余候选 Markdown 判定为 `post`、白名单文件不存在时按空白名单处理、白名单 JSON 结构非法时报错、路径重复时报错、非 `README.md` 路径时报错、非规范化路径时报错、路径不在博客目录白名单下时报错、路径指向文件不存在时报错

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/content-rules.test.cjs`
Expected: FAIL, 因缺少规则实现

- [ ] **Step 3: 写入默认空白名单文件**
路径: `.migration/include-readmes.json`
内容要求: 只包含空的 `paths` 数组

- [ ] **Step 4: 实现内容规则模块**
要求: 固定博客目录白名单、严格处理 README 白名单、禁止 `content/Pages/README.md` 进入站点、按目录位置闭环判定 `page/post`

- [ ] **Step 5: 在 `package.json` 添加全量迁移命令**
新增脚本: `migrate:all`

- [ ] **Step 6: 运行测试确认通过**
Run: `npm test -- test/migration/content-rules.test.cjs`
Expected: PASS

- [ ] **Step 7: 准备提交**
Run: `git add .migration/include-readmes.json package.json scripts/migration/content-rules.cjs test/migration/content-rules.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 2: 固化单文件迁移记录规则

**Files:**
- Create: `scripts/migration/content-record.cjs`
- Create: `test/migration/content-record.test.cjs`
- Modify: `scripts/migration/path-mapper.cjs`

- [ ] **Step 1: 写失败测试覆盖迁移结果分类**
覆盖成功迁移、缺标题导致 `manual_review_unwritten`、缺 Git 时间导致 `degraded`、目标路径冲突导致 `manual_review_unwritten`、嵌套页面导致 `manual_review_unwritten`、非法目标文件名或非法 slug 导致 `manual_review_unwritten`

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/content-record.test.cjs`
Expected: FAIL

- [ ] **Step 3: 实现单文件迁移记录模块**
要求输出固定字段: `sourcePath`、`kind`、`category` 或 `slug`、`targetPath`、`frontMatter`、`body`、`resultKind`、`reason`

- [ ] **Step 4: 运行测试确认通过**
Run: `npm test -- test/migration/content-record.test.cjs`
Expected: PASS

- [ ] **Step 5: 准备提交**
Run: `git add scripts/migration/content-record.cjs scripts/migration/path-mapper.cjs test/migration/content-record.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 3: 在重组前采集原始路径 Git 元数据

**Files:**
- Create: `scripts/migration/collect-git-meta.cjs`
- Create: `test/migration/collect-git-meta.test.cjs`
- Create: `.migration/git-meta.json`

- [ ] **Step 1: 写失败测试覆盖原始路径键与空历史场景**
覆盖输出键使用重组前原始路径、单元素时间数组、空 `git log` 结果不伪造时间

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/collect-git-meta.test.cjs`
Expected: FAIL

- [ ] **Step 3: 实现 Git 元数据采集器**
要求: 只扫描重组前顶层博客目录中的 Markdown, 命令固定为 `git log --format=%aI -- "<relative-path>"`, 输出原始路径键的 JSON 文件

- [ ] **Step 4: 运行测试确认通过**
Run: `npm test -- test/migration/collect-git-meta.test.cjs`
Expected: PASS

- [ ] **Step 5: 执行一次元数据采集**
Run: `node scripts/migration/collect-git-meta.cjs`
Expected: 生成 `.migration/git-meta.json`

- [ ] **Step 6: 准备提交**
Run: `git add .migration/git-meta.json scripts/migration/collect-git-meta.cjs test/migration/collect-git-meta.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 4: 重组博客目录到 `content/`

**Files:**
- Create: `content/.gitkeep`
- Create: `scripts/migration/content-reorganize.cjs`
- Create: `test/migration/content-reorganize.test.cjs`
- Modify: `ACM-ICPC/`
- Modify: `Agent/`
- Modify: `Debug-Lab/`
- Modify: `EDC/`
- Modify: `Note/`
- Modify: `Other/`
- Modify: `Photography/`
- Modify: `Robotic/`
- Modify: `Smart Car/`
- Modify: `Pages/`

- [ ] **Step 1: 写失败测试覆盖重组计划与安全检查**
覆盖白名单目录重组计划、目标目录已存在时报错、非白名单目录不移动

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/content-reorganize.test.cjs`
Expected: FAIL

- [ ] **Step 3: 实现重组计划与安全检查**
要求: 只允许移动博客目录白名单中的顶层目录, 输出 `git mv` 计划, 发现冲突立即失败

- [ ] **Step 4: 运行测试确认通过**
Run: `npm test -- test/migration/content-reorganize.test.cjs`
Expected: PASS

- [ ] **Step 5: 执行真实目录重组**
Run: `node scripts/migration/content-reorganize.cjs`
Expected: 顶层博客目录通过 `git mv` 迁入 `content/`, 不允许退化为普通文件移动

- [ ] **Step 6: 准备提交**
Run: `git add content scripts/migration/content-reorganize.cjs test/migration/content-reorganize.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 5: 扫描 `content/` 内容源

**Files:**
- Create: `scripts/migration/content-scan.cjs`
- Create: `test/migration/content-scan.test.cjs`
- Modify: `scripts/migration/classify-content.cjs`

- [ ] **Step 1: 写失败测试覆盖扫描与过滤结果**
覆盖 `.marp.md` 排除、README 默认排除、白名单 README 纳入、`content/Pages/*.md` 标记为 `page`、其他候选 Markdown 标记为 `post`

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/content-scan.test.cjs`
Expected: FAIL

- [ ] **Step 3: 实现扫描器**
输出字段至少包含 `sourcePath`、`kind`、`category`、`slug`

- [ ] **Step 4: 运行测试确认通过**
Run: `npm test -- test/migration/content-scan.test.cjs`
Expected: PASS

- [ ] **Step 5: 准备提交**
Run: `git add scripts/migration/classify-content.cjs scripts/migration/content-scan.cjs test/migration/content-scan.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 6: 处理显式引用的本地资源

**Files:**
- Create: `scripts/migration/resource-handler.cjs`
- Create: `test/migration/resource-handler.test.cjs`

- [ ] **Step 1: 写失败测试覆盖资源识别与改写边界**
覆盖正文相对图片链接、front matter 中 `cover/banner/thumbnail/image` 字段、非允许字段不自动改写且进入人工复核、外链不复制、未引用的旁挂文件不处理、资源缺失导致降级、链接改写幂等

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/resource-handler.test.cjs`
Expected: FAIL

- [ ] **Step 3: 实现资源处理器**
要求: 只处理显式引用资源, 页面与文章资源目标位置不同, 资源缺失与复制冲突记为 `degraded`

- [ ] **Step 4: 运行测试确认通过**
Run: `npm test -- test/migration/resource-handler.test.cjs`
Expected: PASS

- [ ] **Step 5: 准备提交**
Run: `git add scripts/migration/resource-handler.cjs test/migration/resource-handler.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 7: 安全清理托管的 `source/` 输出

**Files:**
- Create: `.migration/pages-manifest.json`
- Create: `scripts/migration/source-cleanup.cjs`
- Create: `test/migration/source-cleanup.test.cjs`

- [ ] **Step 1: 写失败测试覆盖托管输出清理规则**
覆盖只清理 `source/_posts/`、只清理 manifest 中登记的页面目录、manifest 不存在时按空清单处理、不误删手工维护目录

- [ ] **Step 2: 运行测试确认失败**
Run: `npm test -- test/migration/source-cleanup.test.cjs`
Expected: FAIL

- [ ] **Step 3: 实现清理模块**
要求: 只清理托管输出, 不删除手工维护目录

- [ ] **Step 4: 运行测试确认通过**
Run: `npm test -- test/migration/source-cleanup.test.cjs`
Expected: PASS

- [ ] **Step 5: 准备提交**
Run: `git add .migration/pages-manifest.json scripts/migration/source-cleanup.cjs test/migration/source-cleanup.test.cjs`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 8: 实现全量迁移入口与报告生成

**Files:**
- Create: `scripts/migration/migrate-all.cjs`
- Create: `test/migration/migrate-all.test.cjs`
- Create: `docs/migration/hexo-full-migration-report.md`
- Modify: `scripts/migration/migrate-samples.cjs`
- Modify: `README.md`

- [ ] **Step 1: 写失败测试覆盖迁移报告结构**
覆盖报告章节、成功迁移记录字段、降级迁移记录字段、人工复核未写入记录字段、统计字段, 以及手工附录在重复执行后仍保留

- [ ] **Step 2: 写失败测试覆盖全量迁移主流程**
覆盖报告文件输出、页面 manifest 输出、重复执行可通过、README 白名单非法输入直接失败

- [ ] **Step 3: 运行测试确认失败**
Run: `npm test -- test/migration/migrate-all.test.cjs`
Expected: FAIL

- [ ] **Step 4: 实现全量迁移入口**
主流程顺序固定为: 读取白名单 -> 扫描 `content/` -> 读取 `.migration/git-meta.json` -> 清理托管输出 -> 构建单文件迁移记录 -> 处理资源 -> 写入 `source/` -> 写入 `.migration/pages-manifest.json` -> 写入 `docs/migration/hexo-full-migration-report.md`

- [ ] **Step 4.1: 固定报告的生成区与手工附录区**
要求: `docs/migration/hexo-full-migration-report.md` 的自动生成内容位于前半段, 手工附录位于固定章节 `## 手工附录`, 重复执行 `migrate:all` 时必须保留该章节及其后续内容

- [ ] **Step 5: 运行测试确认通过**
Run: `npm test -- test/migration/migrate-all.test.cjs`
Expected: PASS

- [ ] **Step 6: 执行全量迁移**
Run: `npm run migrate:all`
Expected: 成功生成全量 `source/` 内容、页面 manifest 和迁移报告

- [ ] **Step 7: 更新 `README.md`**
至少补充 `content/`、`source/`、`.migration/` 的职责以及 `migrate:all` 的使用顺序

- [ ] **Step 8: 准备提交**
Run: `git add README.md docs/migration/hexo-full-migration-report.md scripts/migration/migrate-all.cjs scripts/migration/migrate-samples.cjs test/migration/migrate-all.test.cjs .migration/pages-manifest.json`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

### Task 9: 验证全量站点渲染闭环

**Files:**
- Modify: `test/migration/hexo-cli.test.cjs`
- Modify: `test/migration/hexo-rendering.test.cjs`
- Modify: `docs/migration/hexo-full-migration-report.md`

- [ ] **Step 1: 扩展 CLI 测试为全量迁移场景**
覆盖 `hexo list post` 识别多个分类目录的文章, 分类页与归档页生成后存在

- [ ] **Step 2: 扩展渲染测试为全量迁移场景**
覆盖首页列出多篇迁移文章、`about` 和 `friends` 页面可访问、至少 3 个不同分类目录的文章详情页可访问、输出不含原始模板标记

- [ ] **Step 3: 运行测试确认失败或暴露缺口**
Run: `npm test -- test/migration/hexo-cli.test.cjs test/migration/hexo-rendering.test.cjs`
Expected: 若全量迁移输出不完整则 FAIL

- [ ] **Step 4: 若测试失败, 做最小修复并重新验证**
修复范围限制为: 全量迁移脚本、迁移报告生成逻辑、`source/` 输出、以及与渲染闭环直接相关的测试或配置

- [ ] **Step 5: 执行最终迁移与生成**
Run: `npm run migrate:all && npm run hexo:clean && npm run hexo:generate`
Expected: 成功生成首页、分类、归档、页面与文章详情页

- [ ] **Step 6: 执行最终全量验证**
Run: `npm test && npm run migrate:all && npm run hexo:clean && npm run hexo:generate`
Expected: 所有测试通过, 站点生成成功

- [ ] **Step 7: 执行本地预览烟雾验证**
Run: `npm run hexo:serve`
Expected: 本地服务启动成功, 并用 HTTP 请求命令至少检查以下 URL: `/`, `/categories/`, `/archives/`, `/about/`, `/friends/`, 以及来自 3 个不同分类目录的文章详情页; 验证完成后显式停止本地服务

- [ ] **Step 8: 在报告的手工附录中补充最终验证摘要**
至少包含执行命令、通过的测试数量、成功迁移 / 降级迁移 / 未写入统计

- [ ] **Step 9: 准备提交**
Run: `git add test/migration/hexo-cli.test.cjs test/migration/hexo-rendering.test.cjs docs/migration/hexo-full-migration-report.md`
Expected: 仅暂存本任务文件, 提交动作需在获得用户确认后单独执行

## Commit Rule

- [ ] 每次执行 commit 前必须先征求用户确认
- [ ] 根据项目基线规则, 每个 commit message 都必须附带 co-author trailer
