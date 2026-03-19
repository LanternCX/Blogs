# 分支自检清单

- 已确认本项目使用 git flow，而不是临时分支习惯
- 已确认基础分支为 `main` 与 `dev`
- 新功能或常规修复从 `dev` 拉出 `feature/*`
- 发版整理从 `dev` 拉出 `release/*`
- 线上紧急修复从 `main` 拉出 `hotfix/*`
- 当前流程如果仍在沿用上游默认 worktree 前提，已先转到 `using-git-worktrees` 完成一次性重定向
- 没有直接在 `main` 或 `dev` 上承接不该直接提交的任务
