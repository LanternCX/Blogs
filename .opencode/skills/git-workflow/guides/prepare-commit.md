# 准备提交

## 目标

在真正执行 commit 之前，先完成变更收敛、规则校验、用户确认与 message 组装。

## 流程

1. 先核对当前分支与暂存范围是否符合预期，再运行 `checklists/pre-commit-checklist.md`。
2. 到 `references/commit-convention.md` 拟定本次 angular commit message。
3. 到 `references/co-author-policy.md` 准备必带 trailer。
4. 到 `references/commit-confirmation.md` 按要求向用户确认；未收到确认，只能停留在“已准备好提交”的状态。
5. 获得确认后，再执行提交。

## 硬规则

- “每次 commit 前必须先向用户确认”是强制规则，不因改动小、文档改动或用户语气默认同意而跳过
- commit message、co-author trailer 与确认话术都以对应 `references/` 文档为唯一规则源
- 此 guide 只覆盖准备与提交约束，不替代发布或分支策略说明

## 最小确认话术要求

- 明确告诉用户“即将执行 commit”
- 给出拟使用的 angular commit message 与 co-author trailer
- 等待用户确认后再提交
