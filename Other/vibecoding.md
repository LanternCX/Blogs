# 关于 Vibe Coding 的思考与探索

今年我最直接的感受是：vibe coding 真的把开发门槛压下来了。很多以前要完整团队做的东西，现在个人开发者也能做，尤其是那种只服务我自己的高定制化工具。

前一阵子玩了下 openclaw。它确实足够通用，但对我当时的需求来说有点大炮打蚊子，token 花得不算少，最后拿到的价值却没有跟着等比例增长。再加上我自己的工作流已经被不少工具改造过一轮，真正还缺 AI 帮忙的高频场景，其实不多。

剩下最刚需的一块，是邮件和一些事务性管理。现成工具要么太重，要么不贴手。所以我最后决定自己写一套：带 AI 总结和翻译功能的低成本 Telegram 邮件 Bot。项目地址：[LanternCX/MailBot: A low-cost and lightweight mail agent](https://github.com/LanternCX/MailBot)

事情到这里就变了：问题不再是怎么找到一个好的工具，而是怎么把 vibe coding 这件事做得更快、更稳、更省钱。

恰好在知乎也读了胡渊鸣大佬的文章：[如何有效地给 10 个 Claude Code 打工](https://zhuanlan.zhihu.com/p/2007147036185744607)，深受启发，于是决定系统性的学习探索一下 Vibe Coding。

## 为什么需要一套自己的工作流

现在的 coding agent 可以分为两类：以 Cursor 为代表的插件和软件型工具和以 Claude-Code 为代表的 CLI 型工具。

而我日常任务大概也可以分成两类。

一类是目标非常明确的：我在开工前就知道该怎么去写、最后结果大概长什么样，更多是执行问题。另一类是探索型任务：方向大概有，但细节和具体的设计需要边做边试。

这直接决定了我怎么选 agent：

- **明确型任务**，我更偏向 CLI。派活直接、推进快，可以放心让它高自主性地到后台去跑，不需要过多的监督。
- **探索型任务**，我更偏向编辑器工具，有一个图形化页面让 review 代码更方便。

所以对我来说，vibe coding 的价值不是全自动替代开发，而是把我从重复劳动里解放出来，把时间留给更高杠杆的事情。

大部分 LLM 厂都有自己的 CLI 工具和图形化工具，而且实际上在设计好工作流之后体验不会差特别多，本质上是选择高性价比的模型方案。

## Vibe Coding 的问题

跑过几轮之后，我发现 AI 写代码和人写代码一样：没有工程约束，就会慢慢长成屎山。主要卡在这几件事上。

第一是**意图对齐**：需求如果没说清楚，AI 跑得越快，偏得也越快。返工很多时候不是模型不行，而是输入阶段就没对齐。

第二是**代码一致性**：单个任务看起来都能完成，但跨会话后命名、结构和边界会逐步失控。没有统一规范，维护成本会迅速上涨。

第三是**上下文问题**：会话一长，AI 就容易漏掉关键约束，或者开始脑补。我自己的体验是，每开一个新 session 往往都要重新喂一遍背景，token 和时间都会持续消耗。

第四是 **CI/CD 的现实差异**：纯软件项目接 GitHub Actions 还算顺手；但我也在做嵌入式和 Robotic 方向的工作，硬件协同一上来，工程链路复杂度会明显上升。

## 解决方案

### 学生党推荐的高性价比选型

对我这样的学生党来说，成本不是附加题，而是主问题。我自己也很敏感，所以现在选 agent 不看谁最强，而是看谁在我预算里最稳定可用。首先是模型方面，世界上顶尖的模型其实无非 Gemini、OpenAI、Claude，写代码这部分甚至只有 gpt-codex 和 claude 可以用，Gemini 也还可以。不过最近国产模型有一些新的动向，据说效果不错，不过我没有体验过。

我于是我选择尽量在小黄鱼上淘到高可用的 AI 工具：

- **Copilot**：学生包非常友好。对很多日常编码需求来说是够用的，性价比高，而且和 VS Code 深度集成，也有 CLI 版本的 Copilot-cli，可惜就是免费的 Copilot Pro 额度有点低，还是要省着点用。
- **Gemini**：个人版有方案可以白嫖学生优惠，但稳定性要打问号，之前 Google 已经封了一批；而家庭组拼车更是来历不明和不稳定不说，很多家庭组实际上是不带 Gemini-cli 和 Antigravity 的（不过也有的是带的）。我现在 Gemini Pro 就是拼车来的，主要还是承担日常的对话任务，相当于大号 Google。
- **Codex**：我现在主力在用 Codex。小黄鱼 10r 以内就能买到一个月的拼车，只不过我还没有深度使用，不知道稳定性如何。
- **Cursor 和 Claude-code**：确实相比于 Gemini 和 Codex 不是很有性价比，不过体验应该是最好的一批。
- **国产模型和工具**：我的观察是，Qwen、GLM、minimax 这些模型的口碑都不错，但我还没有系统性实测，所以暂时不做结论。像 Trae 这类国晨工具我虽然体验过但是也没有深度体验，所以只保留观察，不给推荐结论。

对我而言，在预算紧张时，优先级始终是稳定连续可用，其次才是理论最强模型。

### 工程上的落地方式

这部分我现在尽量写成固定流程，避免每次换 agent 就重来一遍。

#### 流程主线

> 需求 → 开发 → 调试 → 上线 → 复盘沉淀

1. **需求阶段**
   - 先用 **Plan 模式**对齐意图。
   - 明确目标、边界、验收条件。
   - 这一部分需要重点进行 Review。
2. **开发阶段**
   - 用 `Skills + AGENTS.md + RULES.md` 约束代码和设计一致性。
   - 统一规则，不让不同 agent 带入各自默认流程。
3. **调试阶段**
   - 先验证功能正确性，再看结构一致性。
   - 重点检查命名、模块边界、文档同步。
4. **上线阶段**
   - 纯软件项目 GitHub Actions 之类的自动化工具是最好的，其次 Github 也开源了他们的[GitHub Agentic Workflows](https://github.com/github/gh-aw)。
   - 和硬件交互更多的、更为底层的领域，例如我正在做的嵌入式和 robotic 项目应该需要补 MCP 协议能力和更多 skills 扩展，这一部分其实有待探索。
5. **复盘沉淀阶段**
   - 把关键变更沉淀到 `.agents/progress/entries`。
   - 在 `PROGRESS.md` 维护目录和摘要，做长期记忆和上下文压缩。

#### 工作流治理原则

在我看来：铁打的工作流，流水的 agent。

我希望做到不管用哪家 agent，开多少个 `session`，工作流都不变，也就是维护代码一致性。

`AGENTS.md` 是统一入口。

`CLAUDE.md`、`GEMINI.md` 只做适配层，不作为主流程定义源，统一使用 `AGENTS.md`。

`.agents/RULES.md` 用来手动维护的偏好文件。agent 必须读取并遵守，未经用户明确要求不得自动改写。

其次就是 `instructions/rules` 以及 `skills` 功能基本上所有的 coding agent 都是自带的，本文其实更多的是在胡渊鸣大佬的博客提出的 `PROGRESS.md` 的基础上进行了适当的扩充和完善以适应低成本个人开发者（尤其是学生党）的场景。

#### 初始化 `.agents` 的最小结构

```text
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

#### `PROGRESS.md` 的 Index

| Page ID | Date | Title | Path | Keywords |
| --- | --- | --- | --- | --- |
| 20260221-1 | 2026-02-21 | Initialized PROGRESS workflow and progress-tracker skill | `./progress/entries/2026/2026-02-21-1.md` | progress-tracker, governance, logging |
| 20260221-2 | 2026-02-21 | Added git-workflow-guard governance skill | `./progress/entries/2026/2026-02-21-2.md` | git-flow, conventional-commits, co-author |
| 20260222-1 | 2026-02-22 | Migrated PROGRESS to .agents structured entries | `./progress/entries/2026/2026-02-22-1.md` | toc, structure, indexing |

每个 `entries` 文件都必须记录相关 commit 信息，至少包含：

- `Related Commit Message`（必填）
- `Related Commit Hash`（建议）

并且 commit message 需要符合 Angular/Conventional Commit 规范，分支管理需要使用 git flow。

#### 初始化阶段可直接投喂的 6 条 Prompt

根据我前面的过程进行一下 Prompt Enginer，很容易得到。

下面这 6 条我会一条一条喂给模型，只做最基本初始化，把业务决策空间留给 agent。

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

本质上 `PROGRESS.md` 就是给 AI 做了一套简单的错题本 + RAG，使得模型拥有了结构化的记忆，能够自主进化。这套结构的核心目标就是两点，agent 可替换，流程不可变。

当然我也添加了一些 `instructions/rules`，只不过是全局规则。

## 最后

回头看这段时间，真正有效的不是某个万能 prompt，而是把传统软件工程工业里已经成熟的方法，重新落实到 AI 协作过程里。

很多时候看上去是模型输出问题，最后追根到底还是流程治理问题。意图没有对齐、一致性规则缺失、上下文没有沉淀，都会把结果推向屎山。反过来，只要流程能稳定运行，模型和 agent 的切换成本就会明显下降。

这段实践也让我更明确了一点：只站在 **designer** 或 **engineer** 甚至是**码农**的局部视角，很容易把问题理解成单点技术问题（工具不好用、模型不够强等等）。切换到 **manager** 视角后，问题会更像系统治理问题，重点是规则、节奏、边界和反馈闭环。

所以这篇总结最终落到一个很朴素的结论。**AI 协作不是减少工程化，而是更依赖工程化。**流程稳定以后，产出质量和迭代效率才会一起提升。
