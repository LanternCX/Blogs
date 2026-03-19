---
name: code-standard
description: Use when 需要创建模块、重构模块、补充代码注释、接入日志能力, 或确认本项目架构、注释、持久化与日志硬性规范时
---

# code-standard

## Overview

本项目代码规范以高内聚、低耦合为核心。此入口只保留触发条件、硬性边界与导航, 具体做法拆分到 guides、references 与 checklists。

## When to Use

- 需要新建模块、拆分职责、整理依赖或控制模块边界
- 需要重构现有实现, 但必须保持架构稳定与耦合受控
- 需要新增或修正文档注释、行内注释、文档字符串
- 需要接入、调整或审查日志系统与需要持久化的文件落盘策略
- 需要在 code review 中快速核对本项目代码规范

## Hard Boundaries

- 代码设计必须优先满足高内聚、低耦合, 禁止把无关职责堆入同一模块
- 文档注释统一采用 Doxygen 风格, 默认使用 `@brief`, 按需补充 `@param`、`@return`、`@note`、`@warning`
- 本项目注释统一使用中文, 注释与文档字符串中的标点统一使用半角符号, 标点后必须跟一个空格, 单行注释行尾禁止使用句号、逗号、分号、冒号等收尾标点
- 需要持久化的文件统一写到程序运行目录, 不得写入系统目录或用户目录的全局位置
- 日志系统必须同时支持 stdout 与可持久化滚动日志, 不能只保留其中一种输出
- 本 skill 不定义 git 流程与文档归档流程; 涉及提交、分支或文档分类时分别转到 `git-workflow` 与 `doc-maintainer`

## Navigation

- 创建模块: `guides/create-module.md`
- 重构模块: `guides/refactor-module.md`
- 补充注释: `guides/add-comments.md`
- 增加日志: `guides/add-logging.md`
- 架构规则: `references/architecture-rules.md`
- 注释规则: `references/comment-style.md`
- 持久化规则: `references/persistence-rules.md`
- 日志规则: `references/logging-rules.md`
- code review 自检: `checklists/code-review-checklist.md`
- git 流程: `git-workflow`
- 文档维护: `doc-maintainer`

## Escalation

- 无法判断模块边界时, 先按 `references/architecture-rules.md` 收敛职责与依赖方向
- 无法判断注释应写到什么粒度时, 先按 `references/comment-style.md` 约束为最小必要说明
- 需要决定文件落盘位置时, 先按 `references/persistence-rules.md` 确认程序运行目录方案
- 需要设计日志输出链路时, 先按 `references/logging-rules.md` 校验 stdout 与滚动落盘是否同时成立
