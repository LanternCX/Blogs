---
marp: true
theme: uncover
_class: invert
paginate: true
size: 16:9
---

# 面向 **Agent** 编程
## **Vibe Coding** 
## 设计哲学与最佳实践

---

## [**写在前面**](https://www.caoxin.xyz/index.php/archives/85/#cl-2)

过年期间深度改造了 **vibe coding** 工作流
从 **Copilot Pro** 到完整的 **Agentic Workflow**
实践项目：**MailBot**、**Ark**、**mpy-cli**、**codex-gateway**

这篇文章是写给谁的？更多的是实验室内部培训。
这篇文章是怎么写出的？[阅读、归纳、实践](https://www.caoxin.xyz/index.php/archives/85/#cl-4)

---

## **前置知识**

- **AI** 编程常见通用名词：**Agent**、**Vibe Coding**、**Agentic Development**
- **LLM** 相关：**Token**、**Transformer**、**上下文窗口**、**幻觉**
- **Git** / **GitHub** 以及常见工作范式：**CI/CD**、**PR**、**Code Review**
- 常见的 **Agent** 功能：**Skills**、**MCP**、**Commands**、**Agent**、**Subagent**

---

## [**工作流**](https://www.caoxin.xyz/index.php/archives/85/#cl-5)

我现在的工作流是 **OpenCode** + **Codex** / **Copilot** + **Superpowers Fork**
小任务用自己的订阅 (按 **Token** 计费)
大任务换 **Copilot** (按次数计费)
写了一个 **codex-gateway** 转发 **OAuth** 订阅

---

## [**Superpowers**](https://www.caoxin.xyz/index.php/archives/85/#cl-6)

**Agent** 不同于 **Chat Bot** 的两个点：
**有手有脚**：更改容易逃过 **Review** 变成史山
**能力极强**：**LLM** 代码能力远超个人
**重心转移**：从 **Coding** 到 **Prompt Engineering**
设计合理的边界条件规范 **LLM** 行为

---

## [**ReAct 机制**](https://www.caoxin.xyz/index.php/archives/85/#cl-7)

**Reasoning and Acting**
核心思想：强制模型获取外部信息，减少幻觉
动态反馈状态机闭环：
**Thought** (思考) -> **Action** (行动) -> **Observation** (观察)
优化方式：帮助模型在 **ReAct** 循环中搜集信息

---

## [**上下文管理**](https://www.caoxin.xyz/index.php/archives/85/#cl-8)

**Transformer** 架构限制与固定上下文窗口
按进入时机分类：
每次发消息：系统提示词、元数据、**AGENTS.md**、**Skills** 列表
运行过程中：**Skill** 正文、按需读取的文件、**Tools** 上下文
原则：让所有的上下文都具有弹性

---

## [**意图对齐**](https://www.caoxin.xyz/index.php/archives/85/#cl-9)

自然语言描述是模糊的，容易产生语义扩展
**Brainstorming Skill**
链路：需求 - **Plan** - **Plan Review** - **Coding**
解耦 **Code Review** 和 **Plan Review**
持久化方案：写入 `doc/plans` 并提交 **Git**

---

## [**TDD**](https://www.caoxin.xyz/index.php/archives/85/#cl-10)

测试驱动开发 (**Test-Driven Development**)
**红-绿-重构** 循环
在编写业务逻辑代码之前，先编写测试代码
通过测试和业务代码对抗，有效防止 **AI** 写 **Bug**

---

## [**Subagent**](https://www.caoxin.xyz/index.php/archives/85/#cl-11)

任务分发给子 **Agent** 完成
减少主 **Agent** 的无用上下文占用
注入不同的角色设定提示词，激发专业操作
符合 **Everything in Skills** 设计理念

---

## [**Code Review**](https://www.caoxin.xyz/index.php/archives/85/#cl-12)

软件开发生命周期的关键质量保证环节
迁移到 **Agentic Workflow**
通过 **Code Review Agent** 对 **Coding Agent** 进行检查
自动使用 `requesting-code-review` 和 `receiving-code-review`

---

## [**项目级 Memory**](https://www.caoxin.xyz/index.php/archives/85/#cl-13)

跨 **Session** 连续性与自我进化
基于轻量级 **RAG** 的 `.progress` 体系
记录 **Debug** 日志、功能开发日志与 **Global TOC** 索引
让 **Agent** 随项目一起进化

---

## [**Everything in CLI**](https://www.caoxin.xyz/index.php/archives/85/#cl-14)

万物皆可命令行
建立 **Agent Friendly** 的接入层
**Agent** 更适合纯文本的输入与输出
**GUI** 对程序非必须，只要有合适的用户接口

---

## [**Everything in Skills**](https://www.caoxin.xyz/index.php/archives/85/#cl-15)

`skills` 是 `superpowers` 的核心抽象
不应该额外抽象成一套跨平台统一系统
平台原生机制 > 额外包装层
只学会写 **Skills** 就足够覆盖所有场景

---

## [**软件工程**](https://www.caoxin.xyz/index.php/archives/85/#cl-16)

对 **AI** 用**软件工程**，防止写出史山

---

## [设计范式](https://www.caoxin.xyz/index.php/archives/85/#cl-17)

**YAGNI** (你通常不需要它)：阻止塞入不需要的废料
**DRY** (不要重复自己)：将现有代码整理干净

---

## [架构治理](https://www.caoxin.xyz/index.php/archives/85/#cl-18)

**高内聚**：模块职责清晰，任务单一
**低耦合**：模块间减少相互依赖

---

## [Git 工作流](https://www.caoxin.xyz/index.php/archives/85/#cl-19)

**Commit Message**：参考 **Angular** 提交信息规范
**Git Branch**：**dev** 与 **main** 分支管理

---

## [OOP](https://www.caoxin.xyz/index.php/archives/85/#cl-20)

面向对象编程 (**Object-Oriented Programming**)
将现实世界中的事物抽象为各类对象
围绕对象的数据和行为来组织代码结构

---

## [最佳实践](https://www.caoxin.xyz/index.php/archives/85/#cl-21)

**Best Practice**：业界认可的最有效方法
**TDD**、**DRY**、**YAGNI**、**Code Review** 均属此类
通过 **Agent** 寻找并参考业内最佳实践

---

## [**苦涩的教训与 Scaling Law**](https://www.caoxin.xyz/index.php/archives/85/#cl-22)

苦涩的教训
算力（通用计算能力）最终总是胜过人类先验知识
寻找最适合 **AI** 理解的简单范式

**Scaling Law**
性能与**计算量**、**参数量**和**数据量**呈幂律关系
谁掌握了数据，谁就有话语权

---

## [我的配置](https://www.caoxin.xyz/index.php/archives/85/#cl-25)

---

## [**杂谈**](https://www.caoxin.xyz/index.php/archives/85/#cl-26)

**关于思考**: 人类擅长从宏大模糊问题中找解，多 **IO** 整理思路

**技术选型**：选适合 **AI** 发挥的 (如 **Go**、**SQLite**)
选新技术而非仅靠熟悉的技术

**成本控制**: **Cache Hit**、国内模型、模型选择

**工程能力**: 好的 **Infra** 决定产出速度，从失败中改进工作流

**Project Based Learning**：从项目、实践中学习

---

## [**写在最后**](https://www.caoxin.xyz/index.php/archives/85/#cl-35)

对于工程：对 **AI** 用**软件工程**，积极 **Review**，学习**最佳实践**
对于个人：多 **IO** (阅读、思考、实践)，保持学习，跳出舒适区
**技术可能会过时，但学习与思考的能力总是硬通货。**

---

# **Thanks!**
