# Project Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `.opencode/skills/` 下落地 4 个项目级 skill, 使其符合本仓库的渐进式披露、分层目录和项目工作流约束。

**Architecture:** 每个 skill 采用“薄入口 + 分层支撑文档”的结构。`SKILL.md` 只负责触发条件、硬性边界和导航, 详细规则下沉到 `guides/`、`references/`、`checklists/`。`using-git-worktrees` 不复用上游默认工作流, 而是作为项目级重定向入口, 将 git 相关决策统一导向 `git-workflow`。

**Tech Stack:** Markdown, OpenCode project skills, LanternCX/superpowers conventions

---

## File Structure

### New directories

- `.opencode/`
- `.opencode/skills/`
- `.opencode/skills/doc-maintainer/`
- `.opencode/skills/doc-maintainer/guides/`
- `.opencode/skills/doc-maintainer/references/`
- `.opencode/skills/doc-maintainer/checklists/`
- `.opencode/skills/git-workflow/`
- `.opencode/skills/git-workflow/guides/`
- `.opencode/skills/git-workflow/references/`
- `.opencode/skills/git-workflow/checklists/`
- `.opencode/skills/code-standard/`
- `.opencode/skills/code-standard/guides/`
- `.opencode/skills/code-standard/references/`
- `.opencode/skills/code-standard/checklists/`
- `.opencode/skills/using-git-worktrees/`
- `.opencode/skills/using-git-worktrees/guides/`
- `.opencode/skills/using-git-worktrees/references/`
- `.opencode/skills/using-git-worktrees/checklists/`

### New files

- `.opencode/skills/doc-maintainer/SKILL.md`
- `.opencode/skills/doc-maintainer/guides/choose-doc-type.md`
- `.opencode/skills/doc-maintainer/guides/add-user-doc.md`
- `.opencode/skills/doc-maintainer/guides/add-dev-doc.md`
- `.opencode/skills/doc-maintainer/guides/update-existing-doc.md`
- `.opencode/skills/doc-maintainer/references/doc-layout.md`
- `.opencode/skills/doc-maintainer/references/doc-style.md`
- `.opencode/skills/doc-maintainer/references/language-policy.md`
- `.opencode/skills/doc-maintainer/checklists/doc-change-checklist.md`
- `.opencode/skills/git-workflow/SKILL.md`
- `.opencode/skills/git-workflow/guides/start-feature.md`
- `.opencode/skills/git-workflow/guides/prepare-commit.md`
- `.opencode/skills/git-workflow/guides/release-flow.md`
- `.opencode/skills/git-workflow/references/branch-strategy.md`
- `.opencode/skills/git-workflow/references/commit-convention.md`
- `.opencode/skills/git-workflow/references/commit-confirmation.md`
- `.opencode/skills/git-workflow/references/co-author-policy.md`
- `.opencode/skills/git-workflow/checklists/pre-commit-checklist.md`
- `.opencode/skills/git-workflow/checklists/branch-checklist.md`
- `.opencode/skills/code-standard/SKILL.md`
- `.opencode/skills/code-standard/guides/create-module.md`
- `.opencode/skills/code-standard/guides/refactor-module.md`
- `.opencode/skills/code-standard/guides/add-comments.md`
- `.opencode/skills/code-standard/guides/add-logging.md`
- `.opencode/skills/code-standard/references/architecture-rules.md`
- `.opencode/skills/code-standard/references/comment-style.md`
- `.opencode/skills/code-standard/references/persistence-rules.md`
- `.opencode/skills/code-standard/references/logging-rules.md`
- `.opencode/skills/code-standard/checklists/code-review-checklist.md`
- `.opencode/skills/using-git-worktrees/SKILL.md`
- `.opencode/skills/using-git-worktrees/guides/redirect-to-project-workflow.md`
- `.opencode/skills/using-git-worktrees/references/redirect-policy.md`
- `.opencode/skills/using-git-worktrees/checklists/workflow-switch-checklist.md`

### Existing files to reference during implementation

- `docs/plans/base.md`
- `docs/superpowers/specs/2026-03-19-project-skills-design.md`

### File responsibilities

- `.opencode/skills/*/SKILL.md`: 薄入口, 只放触发条件、硬性边界、导航和升级路径
- `.opencode/skills/*/guides/*.md`: 按场景拆分的操作引导
- `.opencode/skills/*/references/*.md`: 规则细则与策略定义
- `.opencode/skills/*/checklists/*.md`: 执行前后检查单

### Task 1: 创建目录骨架

**Files:**
- Create: `.opencode/`
- Create: `.opencode/skills/`
- Create: `.opencode/skills/doc-maintainer/`
- Create: `.opencode/skills/doc-maintainer/guides/`
- Create: `.opencode/skills/doc-maintainer/references/`
- Create: `.opencode/skills/doc-maintainer/checklists/`
- Create: `.opencode/skills/git-workflow/`
- Create: `.opencode/skills/git-workflow/guides/`
- Create: `.opencode/skills/git-workflow/references/`
- Create: `.opencode/skills/git-workflow/checklists/`
- Create: `.opencode/skills/code-standard/`
- Create: `.opencode/skills/code-standard/guides/`
- Create: `.opencode/skills/code-standard/references/`
- Create: `.opencode/skills/code-standard/checklists/`
- Create: `.opencode/skills/using-git-worktrees/`
- Create: `.opencode/skills/using-git-worktrees/guides/`
- Create: `.opencode/skills/using-git-worktrees/references/`
- Create: `.opencode/skills/using-git-worktrees/checklists/`

- [ ] **Step 1: 确认当前仓库中不存在 `.opencode/skills/` 冲突结构**

Run: `python - <<'PY'
from pathlib import Path
path = Path('.opencode/skills')
print(path.exists())
if path.exists():
    for p in sorted(path.iterdir()):
        print(p)
PY`
Expected: 默认输出 `False`, 或输出已存在的项目级 skill 结构供后续合并判断

- [ ] **Step 2: 创建完整目录树**

Run: `mkdir -p .opencode/skills/doc-maintainer/guides .opencode/skills/doc-maintainer/references .opencode/skills/doc-maintainer/checklists .opencode/skills/git-workflow/guides .opencode/skills/git-workflow/references .opencode/skills/git-workflow/checklists .opencode/skills/code-standard/guides .opencode/skills/code-standard/references .opencode/skills/code-standard/checklists .opencode/skills/using-git-worktrees/guides .opencode/skills/using-git-worktrees/references .opencode/skills/using-git-worktrees/checklists`
Expected: 命令成功, 无报错

- [ ] **Step 3: 读取目录树确认层次正确**

Run: `python - <<'PY'
from pathlib import Path
for p in sorted(Path('.opencode/skills').rglob('*')):
    print(p)
PY`
Expected: 输出 4 个 skill 及其 `guides/`、`references/`、`checklists/` 子目录

- [ ] **Step 4: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 2: 编写 4 个薄入口 `SKILL.md`

**Files:**
- Create: `.opencode/skills/doc-maintainer/SKILL.md`
- Create: `.opencode/skills/git-workflow/SKILL.md`
- Create: `.opencode/skills/code-standard/SKILL.md`
- Create: `.opencode/skills/using-git-worktrees/SKILL.md`

- [ ] **Step 1: 为每个 skill 写 YAML frontmatter**

要求:

- `name` 使用 kebab-case
- `description` 以 `Use when ...` 开头
- 描述只说明触发条件, 不总结完整流程

- [ ] **Step 2: 为 `doc-maintainer/SKILL.md` 写最小入口**

必须包含:

- 中文项目文档默认中文
- 用户文档与开发文档必须分流
- 根文档与 `docs/` 放置规则需要遵守
- 根用户文档必须包含项目介绍、快速开始、开发文档链接、部署文档链接
- 导航到 `guides/`、`references/`、`checklists/`
- 涉及 git 或代码规范时的升级路径

- [ ] **Step 3: 为 `git-workflow/SKILL.md` 写最小入口**

必须包含:

- git flow
- angular commit
- commit 前必须向用户确认
- co-author trailer 要求
- 当 worktree 假设出现时转到 `using-git-worktrees`

- [ ] **Step 4: 为 `code-standard/SKILL.md` 写最小入口**

必须包含:

- 高内聚低耦合
- Doxygen 风格文档注释
- 中文项目注释使用中文
- 注释与文档字符串使用半角标点, 且适用时标点后保留一个空格
- 运行目录持久化
- 标准输出 + 持久化滚动日志

- [ ] **Step 5: 为 `using-git-worktrees/SKILL.md` 写最小入口**

必须包含:

- 本项目不采用上游默认 `using-git-worktrees` 工作流
- git 工作区、分支、提交决策统一重定向到 `git-workflow`
- 本文件只负责拦截和路由, 不承载完整 git 规则

- [ ] **Step 6: 逐文件自检, 确保入口足够薄**

检查点:

- 没有把长规则段落塞回 `SKILL.md`
- 每个入口都存在明确导航
- 每个入口都存在至少一个升级路径

- [ ] **Step 7: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 3: 填充 `doc-maintainer` 支撑文档

**Files:**
- Create: `.opencode/skills/doc-maintainer/guides/choose-doc-type.md`
- Create: `.opencode/skills/doc-maintainer/guides/add-user-doc.md`
- Create: `.opencode/skills/doc-maintainer/guides/add-dev-doc.md`
- Create: `.opencode/skills/doc-maintainer/guides/update-existing-doc.md`
- Create: `.opencode/skills/doc-maintainer/references/doc-layout.md`
- Create: `.opencode/skills/doc-maintainer/references/doc-style.md`
- Create: `.opencode/skills/doc-maintainer/references/language-policy.md`
- Create: `.opencode/skills/doc-maintainer/checklists/doc-change-checklist.md`

- [ ] **Step 1: 编写 `references/language-policy.md`**

必须覆盖:

- 本项目为中文项目
- 项目文档默认中文
- 固定英文技术术语的保留原则

- [ ] **Step 2: 编写 `references/doc-layout.md`**

必须覆盖:

- 用户文档与开发文档的目录边界
- 根文档的职责
- `docs/` 下文档的职责
- 根用户文档必须包含项目介绍、快速开始、开发文档链接、部署文档链接

- [ ] **Step 3: 编写 `references/doc-style.md`**

必须覆盖:

- 开源项目级文档要求
- 中文项目使用中文
- 文档结构清晰, 避免将开发内容混入用户入口
- 开发文档必须注明代码规范、git 工作流、agent 使用规范, 且项目 skill 位于 `.opencode/skills/`

- [ ] **Step 4: 编写 4 个 `guides/` 场景文档**

最小职责:

- `choose-doc-type.md`: 先判断文档属于哪一类
- `add-user-doc.md`: 新增用户文档的落点与检查项
- `add-dev-doc.md`: 新增开发文档的落点与检查项
- `update-existing-doc.md`: 修改现有文档时如何避免破坏分流

- [ ] **Step 5: 编写 `checklists/doc-change-checklist.md`**

必须包含:

- 放置路径检查
- 用户/开发文档分类检查
- 中文语言检查
- 根文档链接完整性检查
- 开发文档是否覆盖代码规范、git 工作流、agent 使用规范

- [ ] **Step 6: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 4: 填充 `git-workflow` 支撑文档

**Files:**
- Create: `.opencode/skills/git-workflow/guides/start-feature.md`
- Create: `.opencode/skills/git-workflow/guides/prepare-commit.md`
- Create: `.opencode/skills/git-workflow/guides/release-flow.md`
- Create: `.opencode/skills/git-workflow/references/branch-strategy.md`
- Create: `.opencode/skills/git-workflow/references/commit-convention.md`
- Create: `.opencode/skills/git-workflow/references/commit-confirmation.md`
- Create: `.opencode/skills/git-workflow/references/co-author-policy.md`
- Create: `.opencode/skills/git-workflow/checklists/pre-commit-checklist.md`
- Create: `.opencode/skills/git-workflow/checklists/branch-checklist.md`

- [ ] **Step 1: 编写 `references/branch-strategy.md`**

必须覆盖:

- `main`、`dev` 作为基础分支
- 使用 git flow 的最小分支策略
- 功能开发默认从 `dev` 分出

- [ ] **Step 2: 编写 `references/commit-convention.md`**

必须覆盖:

- angular commit 规范
- 常用 type 的选用原则
- 提交信息应聚焦变更目的

- [ ] **Step 3: 编写 `references/commit-confirmation.md`**

必须覆盖:

- 每次 commit 都必须先向用户确认
- 未确认时只能准备提交内容, 不能实际执行提交
- 如果用户只要求改代码, 默认不主动提交

- [ ] **Step 4: 编写 `references/co-author-policy.md`**

必须明确写出:

- `Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>`

- [ ] **Step 5: 编写 3 个 `guides/` 文档**

最小职责:

- `start-feature.md`: 如何在本项目中开始功能工作
- `prepare-commit.md`: 如何在未提交前整理提交候选内容
- `release-flow.md`: 如何理解 tag、release、CI 触发与 git 操作边界

- [ ] **Step 6: 编写 2 个 `checklists/` 文档**

必须包含:

- 分支是否正确
- commit message 是否符合 angular commit
- 是否已向用户确认
- 是否附带 co-author

- [ ] **Step 7: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 5: 填充 `code-standard` 支撑文档

**Files:**
- Create: `.opencode/skills/code-standard/guides/create-module.md`
- Create: `.opencode/skills/code-standard/guides/refactor-module.md`
- Create: `.opencode/skills/code-standard/guides/add-comments.md`
- Create: `.opencode/skills/code-standard/guides/add-logging.md`
- Create: `.opencode/skills/code-standard/references/architecture-rules.md`
- Create: `.opencode/skills/code-standard/references/comment-style.md`
- Create: `.opencode/skills/code-standard/references/persistence-rules.md`
- Create: `.opencode/skills/code-standard/references/logging-rules.md`
- Create: `.opencode/skills/code-standard/checklists/code-review-checklist.md`

- [ ] **Step 1: 编写 `references/architecture-rules.md`**

必须覆盖:

- 高内聚低耦合
- 单一职责倾向
- 根据现有代码形态渐进演进, 不做无关重构

- [ ] **Step 2: 编写 `references/comment-style.md`**

必须覆盖:

- Doxygen 风格
- `@brief` 默认要求
- 按需使用 `@param`、`@return`、`@note`、`@warning`
- 注释与文档字符串中的半角标点规则
- 单行注释行尾不加句号、逗号、分号、冒号等收尾标点
- 中文项目注释使用中文

- [ ] **Step 3: 编写 `references/persistence-rules.md`**

必须覆盖:

- 静态可持久化文件写入程序运行目录
- 不写系统目录
- 配置、日志、运行时数据库等典型例子

- [ ] **Step 4: 编写 `references/logging-rules.md`**

必须覆盖:

- 日志同时输出到 stdout
- 提供可持久化切片或滚动日志
- 记录级别与基本运维可读性

- [ ] **Step 5: 编写 4 个 `guides/` 文档**

最小职责:

- `create-module.md`: 新增模块时如何先看边界再落地
- `refactor-module.md`: 如何做与当前任务相关的最小重构
- `add-comments.md`: 注释应何时添加、如何避免无价值注释
- `add-logging.md`: 日志点如何兼顾 stdout 与持久化

- [ ] **Step 6: 编写 `checklists/code-review-checklist.md`**

必须包含:

- 架构边界检查
- 注释语言与格式检查
- 单行注释行尾标点检查
- 持久化路径检查
- 日志能力检查

- [ ] **Step 7: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 6: 填充 `using-git-worktrees` 支撑文档

**Files:**
- Create: `.opencode/skills/using-git-worktrees/guides/redirect-to-project-workflow.md`
- Create: `.opencode/skills/using-git-worktrees/references/redirect-policy.md`
- Create: `.opencode/skills/using-git-worktrees/checklists/workflow-switch-checklist.md`

- [ ] **Step 1: 编写 `references/redirect-policy.md`**

必须覆盖:

- 本项目覆盖上游默认 `using-git-worktrees` 行为
- 不采用 superpowers 默认 worktree 工作流
- 涉及工作区、分支、提交时转交 `git-workflow`
- 与 `using-git-worktrees/SKILL.md` 重复声明该覆盖关系, 防止后续漂移

- [ ] **Step 2: 编写 `guides/redirect-to-project-workflow.md`**

必须覆盖:

- 何时识别自己正要进入上游默认流程
- 识别后如何停止并转向项目 `git-workflow`
- 何时只需要 git 流程, 不需要 worktree

- [ ] **Step 3: 编写 `checklists/workflow-switch-checklist.md`**

必须包含:

- 是否误用了上游默认流程
- 是否已切换到项目级 `git-workflow`
- 是否在 commit 前触发用户确认要求

- [ ] **Step 4: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 7: 通读与一致性校验

**Files:**
- Modify: `.opencode/skills/doc-maintainer/SKILL.md`
- Modify: `.opencode/skills/doc-maintainer/guides/choose-doc-type.md`
- Modify: `.opencode/skills/doc-maintainer/guides/add-user-doc.md`
- Modify: `.opencode/skills/doc-maintainer/guides/add-dev-doc.md`
- Modify: `.opencode/skills/doc-maintainer/guides/update-existing-doc.md`
- Modify: `.opencode/skills/doc-maintainer/references/doc-layout.md`
- Modify: `.opencode/skills/doc-maintainer/references/doc-style.md`
- Modify: `.opencode/skills/doc-maintainer/references/language-policy.md`
- Modify: `.opencode/skills/doc-maintainer/checklists/doc-change-checklist.md`
- Modify: `.opencode/skills/git-workflow/SKILL.md`
- Modify: `.opencode/skills/git-workflow/guides/start-feature.md`
- Modify: `.opencode/skills/git-workflow/guides/prepare-commit.md`
- Modify: `.opencode/skills/git-workflow/guides/release-flow.md`
- Modify: `.opencode/skills/git-workflow/references/branch-strategy.md`
- Modify: `.opencode/skills/git-workflow/references/commit-convention.md`
- Modify: `.opencode/skills/git-workflow/references/commit-confirmation.md`
- Modify: `.opencode/skills/git-workflow/references/co-author-policy.md`
- Modify: `.opencode/skills/git-workflow/checklists/pre-commit-checklist.md`
- Modify: `.opencode/skills/git-workflow/checklists/branch-checklist.md`
- Modify: `.opencode/skills/code-standard/SKILL.md`
- Modify: `.opencode/skills/code-standard/guides/create-module.md`
- Modify: `.opencode/skills/code-standard/guides/refactor-module.md`
- Modify: `.opencode/skills/code-standard/guides/add-comments.md`
- Modify: `.opencode/skills/code-standard/guides/add-logging.md`
- Modify: `.opencode/skills/code-standard/references/architecture-rules.md`
- Modify: `.opencode/skills/code-standard/references/comment-style.md`
- Modify: `.opencode/skills/code-standard/references/persistence-rules.md`
- Modify: `.opencode/skills/code-standard/references/logging-rules.md`
- Modify: `.opencode/skills/code-standard/checklists/code-review-checklist.md`
- Modify: `.opencode/skills/using-git-worktrees/SKILL.md`
- Modify: `.opencode/skills/using-git-worktrees/guides/redirect-to-project-workflow.md`
- Modify: `.opencode/skills/using-git-worktrees/references/redirect-policy.md`
- Modify: `.opencode/skills/using-git-worktrees/checklists/workflow-switch-checklist.md`

- [ ] **Step 1: 检查 4 个 `SKILL.md` 是否都保持薄入口**

检查点:

- 没有冗长规则堆积
- 都有导航
- 都有升级路径
- `doc-maintainer/SKILL.md` 明确写出根用户文档四项必备内容
- `code-standard/SKILL.md` 明确写出半角标点与标点后空格要求

- [ ] **Step 2: 检查跨 skill 路由是否一致**

检查点:

- `doc-maintainer` 能路由到 `git-workflow` 与 `code-standard`
- `code-standard` 能路由到 `doc-maintainer`
- `using-git-worktrees` 能路由到 `git-workflow`

- [ ] **Step 3: 检查项目硬规则是否已全部落盘**

至少确认:

- 中文项目语言策略
- Doxygen 与半角标点规则
- 单行注释行尾不加收尾标点
- git flow
- angular commit
- commit 前确认
- co-author
- 运行目录持久化
- stdout + 持久化日志
- 开发文档中的代码规范、git 工作流、agent 使用规范

- [ ] **Step 4: 用全文搜索检查禁止遗漏的关键语句**

Run: `rg -n "commit|Co-authored-by|git flow|Doxygen|运行目录|worktree|中文" .opencode/skills`
Expected: 关键规则在对应 skill 下均能检索到

- [ ] **Step 5: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。

### Task 8: 验证与交接

**Files:**
- Test: `.opencode/skills/**/*`

- [ ] **Step 1: 读取所有 `SKILL.md` 检查 frontmatter 完整性**

Run: `python - <<'PY'
from pathlib import Path
for path in sorted(Path('.opencode/skills').glob('*/SKILL.md')):
    text = path.read_text()
    print(path)
    print(text.splitlines()[:6])
PY`
Expected: 每个入口都带 frontmatter, 并包含 `name`、`description`、`When to Use`、`Hard Boundaries`、`Navigation`、`Escalation`

- [ ] **Step 2: 对 4 个 skill 各抽查 1 个固定支撑文档, 确认渐进式披露成立**

检查点:

- `doc-maintainer/references/doc-layout.md`
- `git-workflow/references/commit-confirmation.md`
- `code-standard/references/comment-style.md`
- `using-git-worktrees/references/redirect-policy.md`
- 入口简短
- 细则位于子文档
- 子文档之间职责不混乱

- [ ] **Step 3: 整理交付说明**

交付内容至少包含:

- 创建了哪些 skill 与文件
- 哪些项目规则已经写入
- 尚未执行 commit, 原因是需用户确认

- [ ] **Step 4: Commit**

此步暂不执行。
根据项目规则, 任何 commit 之前都必须先向用户确认。
