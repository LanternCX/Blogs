---
name: using-git-worktrees
description: Use when 提到 worktree、隔离工作区、并行工作区、避免污染当前工作区或不想影响当前未提交改动时
---

# using-git-worktrees

## Overview

这个 skill 只负责识别并中断上游默认 `using-git-worktrees` 前提，再把后续 branch、workspace、commit policy 交回本项目 `git-workflow`。具体规则放在 guides、references 与 checklists。

## When to Use

- 用户或上下文明确提到 `worktree`
- 需要隔离当前工作区，避免污染现有改动
- 需要并行工作区来处理多个任务或分支
- 某个流程默认假设要按 worktree 目录、默认分支或默认命名习惯继续决策

## Hard Boundaries

- 本项目不使用 superpowers 默认 `using-git-worktrees` 工作流
- 不依据上游默认 worktree 目录、默认分支命名或默认提交习惯做任何决策
- 本 skill 只负责一次性重定向；完成后由 `git-workflow` 继续处理 branch、workspace、commit policy
- 这个 skill 不单独定义默认 worktree 实施步骤，也不接受从 `git-workflow` 回退来再次判断同一前提

## Navigation

- 覆写后的重定向流程：`guides/redirect-to-project-workflow.md`
- 覆写策略与禁用项：`references/redirect-policy.md`
- 切换前自检：`checklists/workflow-switch-checklist.md`
- 项目级分支、工作区、提交规则：`git-workflow`

## Escalation

- 只要发现请求仍在沿用上游默认 `using-git-worktrees` 前提，立即按 `guides/redirect-to-project-workflow.md` 改写流程
- 完成一次性重定向后，停止在本 skill 内继续推断，转到 `git-workflow`
- 如果现有上下文没有说明为何需要隔离或并行工作区，先用 `checklists/workflow-switch-checklist.md` 补齐触发条件，再继续
