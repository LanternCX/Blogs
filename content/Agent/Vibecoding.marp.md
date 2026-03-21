---
marp: true
theme: uncover
_class: invert
paginate: true
size: 16:9
---

<style>

</style>
# 浅尝 Vibe Coding

分享关于 vibe coding 的一些探索和思考

---

# 前言

今年 vibe coding 确实很热门，趁着放假学习了一下。

虽然之前一直有在用但是没有系统研究过 Agentic workflow

---

## 目录

- 找个项目实战
- 几个痛点
- 解决方案
    - 学生党推荐的高性价比选型
    - 工作流
- 最后

---

# 找个项目实战

写一个邮件管理的 Telegram Bot
[LanternCX/MailBot](https://github.com/LanternCX/MailBot)

---

# 为什么需要一套自己的工作流

coding agent 可以分为两类：
以 **Cursor** 为代表的插件和软件型工具
以 **Claude-Code** 为代表的 CLI 型工具

我日常任务也分两类：**明确型**、**探索型**

前者用 CLI，后者用编辑器工具（因为需要更高频的 Review）

---

# 几个痛点

没有工程约束，AI 也会写shi山

**意图对齐**：AI 写的不一定是我想的
**代码一致性**：每个 AI 都有自己的设计语言和码风
**上下文、幻觉**：经常重复造轮子等等
**CI/CD**：纯软还好办，但是做嵌入式之类的方向就不太好办

---

# 解决方案


选一个高性价比的 Coding Agent 方案

优化工作流`.agents`
用好 Plan、Skills 等等
让 AI 有记忆、有约束
并且能合理压缩上下文

---

# 学生党推荐的高性价比选型

- **Copilot**：学生包非常友好。对很多日常编码需求来说是够用的，性价比高，而且和 VS Code 深度集成，也有 CLI 版本的 Copilot-cli，可惜就是免费的 Copilot Pro 额度有点低，还是要省着点用。

---

- **Gemini**：个人版有方案可以白嫖学生优惠，但稳定性要打问号，之前 Google 已经封了一批；而家庭组拼车更是来历不明和不稳定不说，很多家庭组实际上是不带 Gemini-cli 和 Antigravity 的（不过也有的是带的）。我现在 Gemini Pro 就是拼车来的，主要还是承担日常的对话任务，相当于大号 Google。

- **Codex**：我现在主力在用 Codex。小黄鱼 10r 以内就能买到一个月的拼车，只不过我还没有深度使用，不知道稳定性如何。

---


- **Cursor 和 Claude-code**：确实相比于 Gemini 和 Codex 不是很有性价比，不过体验应该是最好的一批。
**国国内模型和工具**：我的观察是，Qwen、GLM、minimax 这些模型的口碑都不错，但我还没有系统性实测，所以暂时不做结论。像 Trae 这类国内的工具我虽然体验过但是也没有深度体验，所以只保留观察，不给推荐结论。

---

# 流程主线

流程主线固定为：
> 需求 → 开发 → 调试 → 上线 → 复盘沉淀。


---

### 1. 需求阶段
   先用 **Plan 模式**对齐意图。
   明确目标、边界、验收条件。
   这一部分需要重点进行 Review。


---

### 2. 开发阶段
   用 `Skills + AGENTS.md + RULES.md` 约束代码和设计一致性。
   统一规则，不让不同 agent 带入各自默认流程。

---

### 3. 调试阶段
先验证功能正确性，再看结构一致性。
重点检查命名、模块边界、文档同步。

---

### 4. 上线阶段
- 纯软件项目 GitHub Actions 之类的自动化工具是最好的，其次 Github 也开源了他们的[GitHub Agentic Workflows](https://github.com/github/gh-aw)。
- 和硬件交互更多的、更为底层的领域，例如我正在做的嵌入式和 robotic 项目应该需要补 MCP 协议能力和更多 skills 扩展，这一部分其实有待探索。

---

### 5. 复盘沉淀阶段
   - 把关键变更沉淀到 `.agents/progress/entries`。
   - 在 `PROGRESS.md` 维护目录和摘要，做长期记忆和上下文压缩。

---

### .anents 文件夹

```
.agents
├── AGENTS.md
├── RULES.md
├── PROGRESS.md
├── progress/entries/YYYY
│   	└── YYYY-MM-DD-N.md
└── skills
    ├── git-workflow-guard
    │   └── SKILL.md
    ├── code-standards
    │   └── SKILL.md
    ├── progress-tracker
    │   └── SKILL.md
    └── doc-maintainer
        └── SKILL.md
```

---

### PROGRESS.md

---

**Prompt 1**：先确定 `PROJECT_LANG`，后续所有文件语言和注释规范都依赖这个决策。如果不先锁定，后面很容易出现中英文混写和规范冲突。

```markdown
你是初始化代理。先做语言决策，不做业务实现。

任务：
1) 在 zh 和 en 中确定 `PROJECT_LANG`。
2) 输出决策依据。
3) 锁定后续生成规则：
   - `PROJECT_LANG=en`：`.agents` 下新生成文件必须全英文。
   - `PROJECT_LANG=zh`：可用中文，注释允许中文但只能使用半角标点。

输出：`PROJECT_LANG`、依据、下一步计划。
```

---

**Prompt 2**：只先搭最小目录骨架，不碰业务代码。这样后续 agent 有稳定入口，但不会过早绑定具体实现。

```markdown
基于已锁定的 `PROJECT_LANG`，初始化最小目录，不改业务代码。

必须创建：
- `.agents/AGENTS.md`
- `.agents/RULES.md`
- `.agents/PROGRESS.md`
- `.agents/progress/entries/2026/`
- `.agents/skills/`

约束：
- `RULES.md` 标记为用户手动维护，未经明确授权不得改写。
- 保持结构最小可用，不额外扩展业务文件。

输出：创建结果清单。
```

---

**Prompt 3**：`AGENTS.md` 是总治理入口。这里一次性写清 Git 流程、提交规范、注释规范和架构原则，后续 agent 才能在同一套规则里工作。

```markdown
生成 `.agents/AGENTS.md` 最小治理规则。

必须包含：
1) Git Flow 分支策略。
2) Angular/Conventional Commit 规范。
3) 注释规范：
   - `PROJECT_LANG=zh` 时，注释可中文，但只用半角标点。
   - `PROJECT_LANG=en` 时，注释必须全英文。
4) Doxygen 风格注释要求。
5) 架构原则：高内聚、低耦合。
6) `RULES.md` 优先级高于 agent 默认习惯。

要求：规则简洁，可执行。
```

---

**Prompt 4**：`PROGRESS.md` 负责长期记忆和可追溯性。这里强制写入 commit 关联字段，确保每条经验都能回溯到代码变更。

```markdown
生成 `.agents/PROGRESS.md`，只保留最小可用结构：
- Purpose
- Storage Layout
- Entry Template
- TOC Rules
- Global TOC 表头

Entry Template 必须包含：
- Related Commit Message（必填）
- Related Commit Hash（建议）

要求：没有 commit message 的 entry 不允许入库。
```

---

**Prompt 5**：skills 先建最小骨架，不写业务细节。目标是让 agent 可以复用治理能力，而不是被单项目实现锁死。现在几乎所有工具都有 skills 的完整支持，因此实际上这一步之遥说明需要创建哪些方面的 skills 就好了，这里只做示例。

```markdown
初始化最小 skills 骨架，并创建对应 `SKILL.md`：
- git-workflow-guard
- code-standards
- progress-tracker
- doc-maintainer

每个 `SKILL.md` 仅包含：
- 适用场景
- 输入
- 输出
- 执行约束

要求：保持通用，不绑定具体业务实现。
```

---

**Prompt 6**：最后做一次结构化自检，避免初始化看起来完成但规则缺项。尤其要检查语言一致性、RULES 保护和 commit 字段约束。

```markdown
对初始化结果执行自检并输出报告。

检查项：
1) `.agents` 结构是否完整。
2) `AGENTS.md` 是否包含 Git Flow、Angular Commit、Doxygen、高内聚低耦合。
3) `RULES.md` 是否被标记为用户手动维护且受保护。
4) 文件语言是否满足 `PROJECT_LANG` 约束。
5) `PROGRESS.md` 是否强制 `Related Commit Message`。

输出：通过项、不通过项、修复建议。
```

---

- 本质上 `PROGRESS.md` 就是给 AI 做了一套简单的错题本 + RAG，使得模型拥有了结构化的记忆，能够自主进化

- 这套结构的核心目标就是两点，agent 可替换，流程不可变

- 当然我也添加了一些 `instructions/rules`，只不过是全局规则

---

- 传统软件工程工业里已经成熟的方法，应该重新落实到 AI 协作过程里。

- `designer \ engineer \ 码农` VS `manager`

- AI 协作不是减少工程化，而是更依赖工程化。