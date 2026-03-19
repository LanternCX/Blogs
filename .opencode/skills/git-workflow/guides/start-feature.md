# 开始功能或修复

## 目标

在本项目内按 git flow 启动新工作，明确分支来源与命名，不把日常开发直接落在 `main` 或 `dev`。

## 流程

1. 先判断任务属于常规开发、发版整理还是线上紧急修复。
2. 到 `references/branch-strategy.md` 确认应该使用哪类分支，以及分支应从哪里衍生。
3. 开工前用 `checklists/branch-checklist.md` 检查当前工作区是否已经偏离 git flow 预期。
4. 如果当前需要判断是否应使用独立工作区, 先到 `references/workspace-strategy.md` 判断; 若仍在沿用上游默认前提, 先转到 `using-git-worktrees` 做一次性重定向。
5. 准备真正提交前，转到 `guides/prepare-commit.md`，不要在此 guide 内直接延伸到提交规则。

## 必须满足

- 明确写出本项目使用 git flow，而不是仅说“从 `dev` 开发”
- 基础分支固定为 `main` 与 `dev`
- 不引入默认 worktree 前提

## 常见分流

- 只是常规功能开发或非线上修复：走 feature 分支
- 已发布版本出现紧急问题：走 hotfix 分支
- 需要冻结版本、补文档、做收尾测试：走 release 分支
