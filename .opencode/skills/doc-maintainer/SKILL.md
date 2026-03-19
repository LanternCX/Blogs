---
name: doc-maintainer
description: Use when 需要新增、更新或整理项目文档, 并且必须判断用户文档与开发文档归属时
---

# doc-maintainer

## Overview

维护项目文档时，先判断文档面向用户还是开发者，再按对应 guide 落地。细节规则放在配套 guides、references 与 checklist 中。

## When to Use

- 需要新增用户文档、开发文档或更新既有文档
- 需要补齐文档入口、文档结构、语言规范或项目约束
- 需要确认某份文档应放在用户文档还是开发文档体系

## Hard Boundaries

- 不在此 skill 中定义代码规范细则；涉及代码规范时转到 `code-standard`
- 不在此 skill 中定义 git 规则细则；涉及 git 工作流时转到 `git-workflow`
- 不把用户文档与开发文档混写在同一定位不清的入口中
- 本项目文档默认使用中文，除非项目已有明确例外
- 根用户文档必须包含项目介绍、快速开始、开发文档链接、部署文档链接
- 开发文档必须覆盖代码规范、git 工作流、Agent 使用规范，并明确项目 skill 位于 `.opencode/skills/`

## Navigation

- 判断文档类型：`guides/choose-doc-type.md`
- 新增用户文档：`guides/add-user-doc.md`
- 新增开发文档：`guides/add-dev-doc.md`
- 更新既有文档：`guides/update-existing-doc.md`
- 文档布局参考：`references/doc-layout.md`
- 文档风格参考：`references/doc-style.md`
- 语言规范参考：`references/language-policy.md`
- Agent 文档规范：`references/agent-doc-policy.md`
- 变更前自检：`checklists/doc-change-checklist.md`
- git 相关约束：`git-workflow`
- 代码规范说明：`code-standard`

## Escalation

- 无法判断文档受众时，先按 `guides/choose-doc-type.md` 分类，再暴露分歧点
- 需要补充 git 流程说明时，明确引用 `git-workflow`
- 需要补充代码规范说明时，明确引用 `code-standard`
