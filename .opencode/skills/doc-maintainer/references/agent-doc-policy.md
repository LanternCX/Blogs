# Agent 文档规范

## 适用范围

当开发文档需要说明 Agent 使用规范时, 统一以本文件作为主规则源。

## 必备内容

- 本项目必须使用 `LanternCX/superpowers` 这个 fork 开发
- 本项目采用 `.opencode` 作为 agent 工作目录
- 如果后续需要迁移 agent 工作目录, 必须完整迁移 `.opencode`

## 写作要求

- 开发文档写 Agent 规范时, 明确写出上述三条, 不要只写“遵循项目 agent 约定”
- 若开发文档已拆分多个章节, Agent 规范应有独立标题, 不埋在杂项说明里
- 如需说明项目 skill 位置, 直接写 `.opencode/skills/`

## 导航关系

- 涉及 git 行为时, 链接到 `git-workflow`
- 涉及代码规范时, 链接到 `code-standard`
