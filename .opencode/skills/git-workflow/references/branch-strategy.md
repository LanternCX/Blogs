# 分支策略参考

## 基础分支

- `main`：生产可发布分支，只承接 release 完成后的结果与 hotfix 修复结果
- `dev`：日常集成分支，feature 与 release 默认从这里衍生

## git flow 对应关系

- `feature/*`：从 `dev` 开出，完成后回到 `dev`
- `release/*`：从 `dev` 开出，发版完成后回到 `main` 与 `dev`
- `hotfix/*`：从 `main` 开出，修复完成后回到 `main` 与 `dev`

## 判断规则

- 还在开发中的常规需求：`feature/*`
- 进入发版冻结与验收：`release/*`
- 已上线版本的紧急问题：`hotfix/*`

## 禁止事项

- 不直接在 `main` 上做日常开发
- 不把普通需求直接落到 `dev` 而跳过 feature 分支
- 不把 hotfix 从 `dev` 拉出
- 不在此参考中假设必须使用上游默认 worktree；若当前上下文仍在沿用该前提，先转到 `using-git-worktrees` 做一次性重定向，再回到这里判断分支类型
