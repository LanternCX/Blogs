# 工作流切换检查清单

在继续处理前，逐项确认：

- [ ] 已识别请求是否包含 `worktree`、隔离工作区、并行工作区或避免污染当前工作区的语义
- [ ] 已明确声明本项目不使用 superpowers 默认 `using-git-worktrees` 工作流
- [ ] 已停止依据默认 worktree 目录、默认分支命名或默认提交习惯做推断
- [ ] 已完成一次性重定向, 并把 branch、workspace、commit policy 交回 `git-workflow`
- [ ] 如上下文仍不清楚任务类型，已准备转到 `git-workflow/references/branch-strategy.md` 继续判断
