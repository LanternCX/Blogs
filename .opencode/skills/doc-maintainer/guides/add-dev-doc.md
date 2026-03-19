# 新增开发文档

开发文档服务于项目维护者、贡献者与 Agent，目标是让读者知道如何在仓库内一致地开发与协作。

## 必备覆盖范围

开发文档必须明确覆盖以下三类内容，缺一不可：

- 代码规范
- git 工作流
- Agent 使用规范

## 必备说明

- 项目 skill 位于 `.opencode/skills/`
- 涉及 git 规则时，导航到 `git-workflow`
- 涉及代码规范说明时，导航到 `code-standard`
- Agent 使用规范以 `references/agent-doc-policy.md` 为主规则源
- 本项目文档默认中文

## 推荐结构

1. 开发环境或进入仓库的前置说明
2. 仓库结构或关键目录
3. 代码规范说明或 `code-standard` 链接
4. git 工作流说明或 `git-workflow` 链接
5. Agent 使用规范
6. 项目 skill 位置：`.opencode/skills/`
7. 相关扩展文档链接

## 写作要求

- 对开发协作动作给出明确入口，不要求读者自行猜测
- 能链接到现有 skill 时优先链接，避免重复维护规则
- 对 Agent 约束使用直接、可执行的表述

## 禁止事项

- 不遗漏代码规范、git 工作流、Agent 使用规范中的任一项
- 不省略 `.opencode/skills/` 这个项目 skill 位置
- 不在开发文档中仅写“参考项目约定”而不给出具体入口
