# 工作区策略参考

## 目标

在本项目内, workspace 相关决策只回答一个问题: 当前任务是否真的需要独立工作区, 以及独立后如何继续回到项目级分支与提交规则。

## 判断顺序

1. 如果当前目录没有未提交改动, 且任务不会污染正在进行的另一项工作, 优先继续使用当前工作区
2. 如果需要隔离未提交改动、并行处理多个任务, 或明确需要单独上下文, 可以使用独立工作区
3. 如果“独立工作区”这个想法来自上游默认 `using-git-worktrees` 前提, 先到 `using-git-worktrees` 完成一次性重定向
4. 完成重定向后, workspace 的具体安排仍由本项目规则决定, 不回退到上游默认目录、命名或提交流程

## 项目级约束

- workspace 是否独立, 不改变 git flow 的分支来源规则
- workspace 是否独立, 不改变 commit 前必须向用户确认的规则
- workspace 是否独立, 不改变 angular commit 与 co-author trailer 规则
- workspace 只是隔离执行现场, 不是额外发明一套 git 工作流

## 输出要求

- 先说清当前为什么需要或不需要独立工作区
- 如果需要独立工作区, 再回到 `references/branch-strategy.md` 判断分支类型
- 进入提交阶段时, 统一回到 `guides/prepare-commit.md`

## 禁止事项

- 不把“想隔离工作区”直接等同于“沿用上游默认 worktree 流程”
- 不因为使用独立工作区, 就绕过项目级 branch/commit policy
- 不在这里重新定义目录命名或提交节奏的上游默认习惯
