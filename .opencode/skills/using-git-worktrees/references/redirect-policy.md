# 重定向策略

## 覆写原则

- 本 skill 的职责是覆盖上游默认 `using-git-worktrees` 行为，不是复述或裁剪上游流程
- 一旦触发 worktree 相关语义，优先处理“不要沿用默认前提”，再处理项目级决策入口

## 明确禁用的默认前提

- 不使用上游默认 worktree 目录位置做决策
- 不使用上游默认分支命名习惯做决策
- 不使用上游默认提交节奏、提交信息或收尾方式做决策
- 不把“创建 worktree”视为天然先手动作；是否创建、如何安排，统一交给 `git-workflow`

## 统一重定向规则

- 分支相关问题：转到 `git-workflow`
- 工作区安排问题：转到 `git-workflow`
- 提交准备与提交约束：转到 `git-workflow`
- 只有“识别触发语义并中断上游默认行为”留在本 skill 内
- 这是一次性重定向，不接受在同一前提下从 `git-workflow` 回退到本 skill 重新判断

## 典型触发语义

- `worktree`
- 隔离工作区
- 并行工作区
- 避免污染当前工作区
- 不想影响当前未提交改动

## 边界说明

- 只要请求显式出现 worktree、隔离工作区、并行工作区等语义, 都可以先进入本 skill 做前提检查
- 只有当前流程仍在沿用上游默认 worktree 前提时, 本 skill 才负责中断并重写该前提
- 如果只是正常的项目级 workspace 选择, 则在完成前提检查后交给 `git-workflow/references/workspace-strategy.md`

## 合规表达

- 可以说：本项目不沿用默认 `using-git-worktrees` 工作流，相关分支、工作区、提交决策统一转到 `git-workflow`
- 不要说：按默认 worktree 流程先建一个目录，再按常见命名开分支继续
