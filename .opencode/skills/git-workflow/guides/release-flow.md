# 发布流程

## 目标

按 git flow 处理版本冻结、发布与紧急修复，避免把发布步骤混入普通 feature 流程。

## 发布主线

1. 需要发版时，先到 `references/branch-strategy.md` 确认 release 分支来源与回合目标。
2. release 分支只接收发版必要的修正，例如版本号、文档、回归修复与发布收尾。
3. 发布中的每次提交，都转到 `guides/prepare-commit.md` 处理，不在此 guide 内重复定义提交规则。
4. 如果发布后线上出现紧急问题，回到 `references/branch-strategy.md` 按 hotfix 路径处理。

## 提交约束

- release 与 hotfix 中的提交规则与普通流程一致，统一遵循 `guides/prepare-commit.md` 与相关 `references/`

## 不要做的事

- 不要把普通功能继续堆进 release 分支
- 不要跳过 `dev` 回合，造成后续开发线缺失发布修复
- 不要因为“只是发版收尾”就绕过提交确认与提交格式规则

## 路由提醒

- 如果发布流程仍在沿用上游默认 worktree 或隔离工作区前提，先转到 `using-git-worktrees` 做一次性重定向，再回到本 guide 对应的项目级流程
