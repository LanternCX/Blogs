---
name: git-workflow
description: Use when 需要创建分支、准备提交、整理发布流程，或判断本项目 git flow、angular commit、提交确认与 co-author 约束时
---

# git-workflow

## Overview

本项目 git 采用 git flow，基础分支为 `main` 与 `dev`。此入口只定义触发条件与硬边界，具体操作拆分到 guides、references 与 checklists。

## When to Use

- 需要开始新功能、修复、发布或回收分支
- 需要准备 commit，但不确定分支来源、提交格式或确认步骤
- 需要确认本项目 git flow、angular commit、co-author 或提交前检查规则
- 需要处理会默认假设 worktree 的 git 流程场景

## Hard Boundaries

- 本项目 git 工作流以 git flow 为准，基础分支固定为 `main` 与 `dev`
- commit message 必须遵循 angular commit，不能退化为通用描述风格
- 每次执行 commit 前都必须先获得用户确认，未确认不得提交
- 每次 commit message 都必须附带 `Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>`
- 本 skill 不定义上游默认 worktree 流程；如果当前上下文还在沿用该默认前提，先转到 `using-git-worktrees` 完成一次性重定向，重定向完成后仍回到本 skill 处理分支与提交规则

## Navigation

- 开始功能或修复：`guides/start-feature.md`
- 准备提交：`guides/prepare-commit.md`
- 发布流程：`guides/release-flow.md`
- 分支策略：`references/branch-strategy.md`
- 工作区策略：`references/workspace-strategy.md`
- 提交规范：`references/commit-convention.md`
- 提交确认：`references/commit-confirmation.md`
- co-author 规则：`references/co-author-policy.md`
- 分支自检：`checklists/branch-checklist.md`
- 提交前自检：`checklists/pre-commit-checklist.md`
- 仍在沿用上游默认 worktree 前提时：`using-git-worktrees`

## Escalation

- 无法判断分支应从 `dev`、`main` 还是 release/hotfix 衍生时，先查 `references/branch-strategy.md`
- 需要判断是否应使用独立工作区时, 先查 `references/workspace-strategy.md`
- 需要真正执行 commit 时，先按 `references/commit-confirmation.md` 向用户确认
- 需要拼装 commit message 时，先查 `references/commit-convention.md` 与 `references/co-author-policy.md`
- 流程仍在沿用上游默认 worktree、隔离工作区、并行工作区或避免污染当前工作区的前提时，先转到 `using-git-worktrees` 做一次性重定向；完成后回到本 skill 继续处理 branch/commit policy
