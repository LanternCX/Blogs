# 项目 Skills 设计说明

## 概述

本文档定义本仓库的 4 个项目级本地 skill, 统一放置在 `.opencode/skills/` 下:

- `doc-maintainer`
- `git-workflow`
- `code-standard`
- `using-git-worktrees`

本设计采用平衡型约束和渐进式披露。
每个 `SKILL.md` 只作为轻量入口, 负责说明何时使用、哪些边界必须遵守、以及应该继续阅读哪些子文档。
详细规则不直接堆叠在入口文件中, 而是下沉到分层子目录。

## 目标

- 让项目级 agent 行为与 `docs/plans/base.md` 保持一致
- 保持 `SKILL.md` 足够小、易检索、以导航为主
- 将场景引导、规则细则、执行检查拆分到不同目录
- 覆写默认的 `using-git-worktrees` 行为, 让 git 决策遵循本仓库自己的工作流
- 保证最终项目内的 skill 内容使用中文

## 非目标

- 不在本阶段实现博客迁移、Memos 集成、Telegram Bot、CI 或部署流程本身
- 不把所有项目规则直接塞进每个 `SKILL.md`
- 不直接复用上游默认的 `using-git-worktrees` 工作流

## 设计原则

### 平衡型约束

4 个 skill 统一采用平衡型风格:

- 硬性规则保持明确且易于发现
- 需要结合场景判断的内容下沉到支撑文档
- 入口文件负责防止明显跑偏, 但不膨胀成超长规则手册

### 渐进式披露

每个 skill 入口只暴露安全路由所需的最小信息:

- 职责边界
- 触发条件
- 硬性边界
- 跳转路径
- 跨 skill 升级路径

更细的规则统一放入子目录, 让 agent 按需读取, 避免一次性加载全部约束。

### 分层目录结构

4 个 skill 统一采用三层支撑结构:

- `guides/`: 面向场景的引导文档
- `references/`: 规范性规则文档
- `checklists/`: 收尾阶段使用的短检查单

统一层次可以保证导航方式一致, 同时允许每个 skill 独立演进。

## 目录结构

```text
.opencode/
  skills/
    doc-maintainer/
      SKILL.md
      guides/
        choose-doc-type.md
        add-user-doc.md
        add-dev-doc.md
        update-existing-doc.md
      references/
        doc-layout.md
        doc-style.md
        language-policy.md
      checklists/
        doc-change-checklist.md

    git-workflow/
      SKILL.md
      guides/
        start-feature.md
        prepare-commit.md
        release-flow.md
      references/
        branch-strategy.md
        commit-convention.md
        commit-confirmation.md
        co-author-policy.md
      checklists/
        pre-commit-checklist.md
        branch-checklist.md

    code-standard/
      SKILL.md
      guides/
        create-module.md
        refactor-module.md
        add-comments.md
        add-logging.md
      references/
        architecture-rules.md
        comment-style.md
        persistence-rules.md
        logging-rules.md
      checklists/
        code-review-checklist.md

    using-git-worktrees/
      SKILL.md
      guides/
        redirect-to-project-workflow.md
      references/
        redirect-policy.md
      checklists/
        workflow-switch-checklist.md
```

## 各 Skill 职责

### `doc-maintainer`

职责:

- 对文档修改进行分类
- 将内容放到正确的项目位置
- 保持用户文档与开发文档的边界清晰

主要触发场景:

- 创建或修改 `README.md`
- 新增、重组或维护 `docs/` 下的内容
- 更新开发规范、部署说明或说明性文档

应在 `SKILL.md` 中直接暴露的硬性边界:

- 本项目为中文项目, 项目文档默认使用中文
- 用户文档与开发文档必须可以清晰区分
- 根文档与 `docs/` 下文档的放置位置必须遵循项目布局规范
- 根用户文档必须包含项目介绍、快速开始、开发文档链接、部署文档链接

升级路径:

- 涉及 git 流程约束时, 跳转到 `git-workflow`
- 涉及代码规范说明时, 跳转到 `code-standard`

### `git-workflow`

职责:

- 定义仓库本地 git 行为
- 防止偏离项目要求的 git 工作流
- 集中管理分支与提交相关规则

主要触发场景:

- 创建分支
- 准备提交
- 规划 release 或 tag 相关 git 操作
- 在实现过程中需要判断 git 约束时

应在 `SKILL.md` 中直接暴露的硬性边界:

- 使用 git flow
- 使用 angular commit 规范
- 每次 commit 操作前都必须先向用户确认
- 每次 commit message 都必须带上要求的 co-author trailer

升级路径:

- 当流程从 worktree 假设开始时, 先转到 `using-git-worktrees`

### `code-standard`

职责:

- 定义代码修改时需要遵循的工程规范
- 集中管理架构、注释、持久化和日志约束

主要触发场景:

- 新建模块
- 重构现有模块
- 补充或修改注释
- 引入日志或持久化运行数据

应在 `SKILL.md` 中直接暴露的硬性边界:

- 优先遵循高内聚、低耦合设计
- 需要文档注释时, 统一使用 Doxygen 风格
- 本项目为中文项目, 注释使用中文
- 注释与文档字符串中的标点使用半角符号, 且适用时在标点后保留一个空格
- 可持久化文件必须写入程序运行目录, 不能写入系统目录
- 日志系统必须同时支持标准输出和持久化滚动日志

升级路径:

- 当代码变更需要同步更新开发文档时, 跳转到 `doc-maintainer`

### `using-git-worktrees`

职责:

- 拦截上游 skill 的默认行为
- 将 git 工作区相关决策重定向到本仓库自己的规则

主要触发场景:

- agent 准备沿用上游默认 worktree 工作流时
- 任务描述暗示要依据 superpowers 默认方式创建或切换隔离工作区时

应在 `SKILL.md` 中直接暴露的硬性边界:

- 本项目不要使用上游默认的 `using-git-worktrees` 工作流
- 分支、工作区、提交相关决策统一重定向到项目级 `git-workflow`

设计说明:

这个 skill 应刻意保持极薄。
它的职责是拦截和路由, 不是详细指导 worktree 编排。
同时, 它应作为覆盖上游默认行为的项目级入口。

## `SKILL.md` 最小模板约定

每个 skill 的入口文件统一采用最小骨架:

```md
---
name: skill-name
description: Use when ...
---

# Skill Name

## Overview
一句话说明职责边界

## When to Use
- 触发场景 A
- 触发场景 B
- 触发场景 C

## Hard Boundaries
- 不可协商的规则 1
- 不可协商的规则 2
- 不可协商的规则 3

## Navigation
- 如果要做 X, 阅读 `guides/...`
- 如果要查规则 Y, 阅读 `references/...`
- 如果准备收尾, 阅读 `checklists/...`

## Escalation
- 如果任务跨到其他领域, 切换到 `...`
```

所有入口文件都需要遵守这些规则:

- 保持轻量, 以索引和路由为主
- 不内嵌完整规则集
- 文件命名统一使用 kebab-case
- 项目自写内容统一使用中文, 固定外部术语可保留英文
- 对安全关键或流程关键的硬性规则必须显式写出

## 支撑文件职责

### `guides/`

按场景组织的引导文档。
重点回答“当前场景下下一步该做什么”, 而不是重复整套规则。

### `references/`

规范性规则文档。
用于存放不适合堆在 skill 入口中的详细要求, 如分支策略、注释标点规则、日志标准等。

### `checklists/`

短检查单。
主要在收尾阶段使用, 用来确认关键路由、格式或流程要求没有被遗漏。

## Cross-Skill 路由关系

4 个 skill 应形成一个小型的项目级路由网络:

- `doc-maintainer` 将 git 约束路由到 `git-workflow`
- `doc-maintainer` 将代码规范文档路由到 `code-standard`
- `code-standard` 将文档补充工作路由到 `doc-maintainer`
- `using-git-worktrees` 将工作区与分支行为路由到 `git-workflow`

这样可以在保持单个 skill 高内聚的同时, 保留项目级约束之间的连接关系。

## 风险与缓解

### 风险: 入口文件逐渐膨胀

缓解方式:

- 严格区分索引内容与规则内容
- 新增细则时优先写入 `references/`, 而不是继续往 `SKILL.md` 追加

### 风险: 多个 skill 出现重复规则并逐渐漂移

缓解方式:

- 规范性细则尽量只在一个 owning skill 中维护
- 通过导航和升级路径复用规则, 避免跨 skill 拷贝正文

### 风险: 上游 worktree 假设重新混入项目流程

缓解方式:

- 让 `using-git-worktrees` 明确承担重定向器职责
- 在 `SKILL.md` 与 `references/redirect-policy.md` 中重复声明覆盖关系

## 下一阶段实现重点

implementation plan 应重点覆盖以下内容:

1. 创建 `.opencode/skills/` 目录树
2. 为 4 个 skill 编写轻量 `SKILL.md` 入口文件
3. 补齐第一层 `guides/`、`references/`、`checklists/`
4. 确保 git 相关文档明确写出 commit 前确认与 co-author 要求
5. 确保重定向 skill 明确覆盖上游默认 worktree 工作流
