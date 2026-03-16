# 面向 **Agent** 编程：**Vibe Coding** 设计哲学与最佳实践

说实话之前写文章都是 **AI** 帮我润色的，也就是我跟 **AI** 聊出来的。虽然我已经尽量把控文风，但是现在读来还是一股 **Gemini** 味。

所以这篇博客开始我会对我的博客采用完全手写（或者语音输入）的形式撰写，只进行 **AI Review**，保证原汁原味。

前置知识（可能会用到但是文中不会做详细解释的名词）：

- **AI** 编程常见通用名词：**Agent**、**Vibe Coding**、**Agentic Development**
- **LLM** 相关：**Token**、**Transformer**、**上下文窗口**、**幻觉**
- **Git** / **GitHub** 以及常见工作范式：**Actions**、**PR**、**Code Review**
- 常见的 **Agent** 功能：**Skills**、**MCP**、**Commands**、**Agent**、**Subagent**

大概知道是个啥就好，不需要精通技术细节。如果你完全没接触过，可以这样简单理解：**Vibe Coding** 是一种全新的编程范式，核心是人类只负责高层架构设计和审美决策（对齐 **Vibe**），而将写代码的脏活累活全权交给 **AI Agent**。知道这些前置知识能够帮助你更好地阅读本文。

---

## 写在前面

过年期间正好有空深度改造了一下自己的 **vibe coding** 工作流，在此之前我只是一个白嫖 **GitHub** 学生包用 **Copilot Pro** 的人。

满打满算前后也有一个多月，期间根据我的实际需求 **Vibe** 了几个项目：

1. 轻量级的 **Telegram** 邮件中转/翻译/总结机器人：[LanternCX/MailBot](https://github.com/LanternCX/MailBot)

2. **AI** 驱动的电脑扫盘备份小工具：[LanternCX/Ark](https://github.com/LanternCX/Ark)

3. 不借助 **Thonny** 就可以开发 **micro-python** 的小工具：[LanternCX/mpy-cli](https://github.com/LanternCX/mpy-cli)

4. 将 **Codex OAuth** 订阅转发到 **OpenAI API** 格式的服务端小工具：[LanternCX/codex-gateway](https://github.com/LanternCX/codex-gateway)

这些项目有我很满意的项目（例如 **mpy-cli** 和 **codex-gateway**）当然也有完全不能用的项目（例如 **Ark**）。

除了开源的项目之外，我也尝试了将一套完整的 **Agentic Workflow** 融入到我的智能车竞赛蚂蚁搬家组的开发当中，当然这个我们之后才能详细聊聊。

这篇文章的所有章节并不完全相互独立，内部其实存在很多的相互引用关系，当然我会尽量给出超链接。

### 这篇文章是写给谁的？

最直接的受众是**我实验室的整个团队**。

因为最近快进入赛季了，如果能改造一下实验室工作流，在忙的时候我能省点心。

也就是刚接触 **Vibe Coding** 的学生、小白，能够帮你在摸索 **vibe coding** 工程化的过程中少走一些弯路。

最好是有 1-2 周或者 1-2 个项目的 **Vibe** 经验。

其次我也会将文章发到 **B 站**、**知乎**、**X**、**GitHub** 等等平台。

我希望我的文章能够为构建一个良好的社区以及友善讨论环境贡献自己的力量。

可能会做成视频发到 **B 站**。

### 这篇文章是怎么写出的？

我自己的部分：闲鱼试了各种方案，**vibe** 了几个项目，看了蛮多文章、帖子。

剩下都是我总结的。

#### 推荐阅读

我的所有思考几乎都源自于下面这些链接（按照对本文的影响程度排名）：

- [obra/superpowers - **GitHub**](https://github.com/obra/superpowers)

   开箱即用的 **Vibe Coding** **Skills** 库。项目的设计以及作者在 **Readme** / **Issue** / **PR** 提到的观点都很值得学习，作者的博客也写的很有深度：[Massively Parallel Procrastination](https://blog.fsck.com/)。

- [如何有效地给 10 个 **Claude Code** 打工 - 知乎](https://zhuanlan.zhihu.com/p/2007147036185744607)

   胡渊鸣大佬的文章，核心思想如图所示，我的项目级 **Memory** 的思路就是源于这篇博客。
   
- [你不知道的 **Claude Code**：架构、治理与工程实践 - **X**](https://x.com/hitw93/status/2032091246588518683)

   **Tw93** 大佬的文章，详细叙述了 **Vibe Coding** 过程中的有关问题以及治理范式，同时大佬也是 **X** 和 **GitHub** 上很有名的开源作者，严肃学习。这篇文章在 **Tw93** 博客的链接：[tw93.fun](https://tw93.fun/2026-03-12/claude.html)，知乎也有发，标题都是一样的可以自行寻找。

- [WhynotTV - **B 站**](https://space.bilibili.com/14145636)

   几乎所有的博客/播客值得学习。尤其是最新一期的翁家翌大佬的播客（提到了 **idea** 和 **infra** 的关系）让我确定了改造自己的工作流和学习新的知识同样重要。

- [**Prompting best practices** - **Claude API Docs**](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

   **Claude** 提示词最佳实践指南，可以用来详细了解 **Claude** 这样的 **Agent** 都设计了什么好用的功能，以及和 **AI** 对话的常见 **Trick**。
   
- [大模型进化论 - **B 站**](https://space.bilibili.com/3546981949507978/lists/7254252)

   如果你像我略懂一点大模型，但是并不做 **AI** 有关研究，可以看看这个系列。文风非常通俗并且思维流畅，能够从更宏观的视角学习近代 **AI** 的演化史，同时又不乏技术细节。不知道为啥不火，我觉得讲得非常好。
   
- [HKUDS/CLI-Anything - **GitHub**](https://github.com/HKUDS/CLI-Anything)

   港大开源项目，将任何软件转化为 **CLI** 操作，目的就是为了给软件建立一个 **Agent Friendly** 的接入层。思想非常好。
   
- ["2016 年，我做过一次 **AI** 写代码创业" - **X**](https://x.com/xleaps/status/2033027083476054377)

   超级好的文章，大佬的真情流露，对我的启发更多是视野上的而非工作流上的。
   
- [affaan-m/everything-claude-code - **GitHub**](https://github.com/affaan-m/everything-claude-code)

   大而全的 **Claude Code** 配置指南，不过个人觉得不如 **Superpowers**。
   
- [某鱼 8 元拼车和 **ChatGPT Team** 版并将 **Codex** 反代到 **OpenClaw** - 蓝点网](https://www.landiannews.com/archives/111964.html)

   一篇 **Codex** 邪修教程，不过我在看到这篇文章之前就探索出了这个路径。
   
- [明系魔法吟唱之 1 -- **Vibe Coding** 一年实践后的冷思考 - 知乎](https://zhuanlan.zhihu.com/p/2003390589538956495)

   关于问题分析的有道理，解决方案比较难评。而且 **AI** 味严重。个人还是认为要用魔法打败魔法。
   
- [提问的智慧 - **GitHub**](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md)

   属于是程序员必读文章了，原本是写给人看的，其中的一些观点对于向 **AI** 提问同样适用。

- [人月神话 - **Wiki**](https://zh.wikipedia.org/wiki/人月神话)

   软件工程著作，更是程序员必读书目之一。讲述了项目管理中存在的现象：问题都存在一个不可分割的最小单位，单纯增加人力并不能推进项目进度。可以自行寻找电子书。
   
- [**Harness Engineering** 深度解析：**AI Agent** 时代的工程范式革命 - 知乎](https://zhuanlan.zhihu.com/p/2014014859164026634)

   第一次听说 **Harness Engineering** 的文章，实际上就是在工程里面对 **AI** 加各种约束，同样也是本文探讨的核心。


人类就是这样，善于从海量模糊信息中总结经验模式，可以读这么多东西并且没有啥上下文限制，给 **AI** 读这么多东西还真不一定能提炼出最有用的核心（bushi）。

## 工作流

我现在的工作流是 **OpenCode** + **Codex** / **Copilot** + [我自己的 **Superpowers Fork**](https://github.com/LanternCX/superpowers)。

最近 **Copilot** 把学生包的手动选模型给关了，现在用模型只能靠 **Copilot** 家自己的 **Router**。不过似乎只有插件端被禁用了，我 **OpenCode** 的 **OAuth API** 以及浏览器端都还可以手动选模型。不知道是不是还没改干净。

**Codex** 是闲鱼收的，买了三份，质保一个月每份才 10r 不到，爽之爽之。

基本上小任务，类似用 **Superpowers** 的 **Brainstorming** 我都是用我自己的订阅，因为是按 **Token** 计费。

如果是跑好几个甚至十几个 **Task** 的大任务，我直接换 **Copilot**，因为 **Copilot** 是按次数计费的。

模型订阅就这么些，没啥好说的，思路类似之前看到的一篇文章：[[教程\] 某鱼 8 元拼车和 **ChatGPT Team** 版并将 **Codex** 反代到 **OpenClaw** (四) - 蓝点网](https://www.landiannews.com/archives/111964.html)

另外由于 **Codex** 在非 **Mac** 平台老是登录不上 **OpenCode** 于是我直接 **Vibe** 了一个服务专门把我的 **OAuth** 转发到通用的 **OpenAI API**：[LanternCX/codex-gateway](https://github.com/LanternCX/codex-gateway)。这个项目我们后面展开聊。

## **Superpowers**

开始我还是把 **Agent** 当成一个有手有脚的 **Chat Bot** 在用的。但是很快工程实践就证明了我的这种观念是错误的。

之前在网页端和 **Gemini** 这样的 **Chat Bot** 对话进行 **Vibe** 的时候，例如我的机械臂项目 [LanternCX/ZhiGrip](https://github.com/LanternCX/ZhiGrip)，整个项目的架构实际上都是由我维护的，大部分可能出史山的地方我都能够通过及时的 **Review** 进行调整。

但是 **Agent** 有两个不同：

1. **有手有脚**，导致很多更改很容易逃过我的 **Review**，最后项目就变成了史山。
2. **LLM** 代码能力比我强很多，导致我很多时候 **Review** 不明白他到底写了什么。

就像贡献 **GitHub** 项目，需要经过 **Issue** (feat or bug) -> **Develop** -> **CI** -> **Debug** -> **PR** -> **Review** -> **Merge** 这样一个完整的流程规范 **Contributor** 的行为，同样的，**AI** 也需要类似的工作流规范代码。

因此 **Vibe Coding** 的重心逐渐转移到了 **Prompt Engineering**：如何设计合理的边界条件规范 **LLM** 行为，防止 **AI** 写史山、写 **Bug**。

**Superpowers** 就是这样一个开箱即用的 **Skills** 库，通过引入一套完整的工作流，规范 **Agent** 写代码时会遇到的各种问题。

主要内容包括：

- **TDD**：**Test Driven Development** 测试驱动开发
- **Brainstorming**：通过和用户聊天进行意图对齐
- **Review**：主动对 **LLM** 生成的代码进行 **Code Review**。
- **Subagent-Driven**：子 **Agent** 通过将大任务拆分为小任务

除了这些非常具有思考的开发哲学以外，还有 **Debug**、**Git** 等等常见的工作流技能。

涵盖了作者深厚开发经验所积累成的工程哲学，非常值得学习和使用。

当然我知道你肯定想说：为什么不用 [**Everything Claude Code**](https://ecc.tools/)？

我的答案是：我认为这两个仓库的设计哲学不是很一致。

主要体现在三点：

1. 我更喜欢在我的项目中使用设计语言更为一致、跨平台更为友好的仓库。
2. 我认可作者认为的 **Everything is Skills** 思想，也就是 **Agent** 支持的 **Commands** / **Agents** 这样的层其实并不必要，甚至多余。
3. 简洁、优雅、美观的设计，能够实现“最小改动”式的引入。

更确切地说：**Superpowers** 的作者 **Obra** 对这个仓库的维护几乎是一言堂的模式，类似 **Linus** 对 **Linux** 的话语权。

用这个仓库的感觉就是：你多了一个可靠的同事，而不是一堆性格互不相同而且水平参差不齐的同事。

还有就是一种再也不裸奔的美感。

而 **Everything Claude Code** 这个项目不满足这些条件。

下面我们就来聊聊 **Vibe Coding** 时代下的设计哲学（当前并不限于 **Vibe Coding**，更具体的来说是我最近学习的设计哲学）

## **ReAct** 机制

**ReAct** (**Reasoning and Acting**) 机制的核心思想是通过强制让模型不断获取外部信息，使其能够在解决复杂问题的过程中通过 **Tool Calling** 等方式的帮助下不断收集外部信息，减少模型幻觉。

他底层逻辑是一个动态反馈的状态机，由三个核心环节构成闭环：

1. **Thought**（思考）：**LLM** 对当前的用户目标、已有的上下文以及刚获取的反馈进行内化分析，推理出下一步需要采取什么策略。
2. **Action**（行动）：基于推理结果，从预先注册的工具集 (**Tools**) 中选择一个合适的工具，并生成对应的参数发起调用。
3. **Observation**（观察）：外部环境或工具执行完毕后返回的真实数据，将作为新的输入反馈给 **LLM**。

也就是说，这个 `Thought -> Action -> Observation` 的循环会持续进行，直到模型判断已经获得了充足的信息，并输出 **Final Answer** 结束任务。

为什么要知道这个呢？通过熟悉 **Agent**运行的底层原理，我们优化工作流的方式就非常清晰了：帮助模型更好地在 **ReAct** 循环中搜集信息。

也就是：过滤无效信息，留下有用信息，而不仅仅是增加信息。（可以认为是一层人工知识蒸馏）

## 上下文管理

众所周知由于 **Transformer** 架构的限制，**LLM** 在运行时是存在一个固定的上下文窗口的，如果对话的内容长度超过了这个上下文窗口，模型的性能就会下降（出现幻觉等等）。

所以你会看到现在 **Codex** 和 **Claude** 不断加大上下文长度，最近直接从 **272k tokens** 加到了 **1M**。

那么模型在运行一个任务的时候的上下文都包括哪些呢？由于 **OpenCode** 是开源的，我们可以直接对源码做个简单总结：

按**进入模型上下文的时机**来分，**OpenCode** 的对话上下文大致分为这几类：

| 时机 | 包含的上下文内容 |
| :--- | :--- |
| **每次发消息** | **基础系统提示词**、**元数据**<br>**AGENTS.md**、**instruction/rules**<br>**Skills** 列表以及简介<br>**Session** 的历史消息<br>**所有 Tools 定义**<br>**用户消息** |
| **每次 Session 创建时** | **Session** 元数据 |
| **运行过程中按需懒加载** | **Skill** 正文<br>**Read** 文件时发现的 **AGENTS.md**<br>**Tools** 需要的上下文 |

这些上下文的长度直接决定了模型性能，以及成本。

我们能够控制的：**Tools** (**MCP Tools**) 定义、**skills** 简介、**AGENTS.md**、**instruction/rules**。

因此为了最小化上下文占用，我们可以：

1. 不要在 **AGENTS.md** 写各种答辩，而是要动态地引导 **Agent** 在需要的时候按需到 **Skills** 中加载
2. 不要引入过多的 **MCP Server**，而是通过 **Skill** + **CLI** 的形式动态引入
3. **Skill** 正文只写必要的内容，其他 **Skill** 中用不到的系统基础信息，直接引导 **LLM** 按需加载

也就是让所有的上下文都具有弹性。

具体可以再多看看 **Tw93** 大佬的文章，在此不再过多赘述：[**Tw93**: 你不知道的 **Claude Code**：架构、治理与工程实践](https://x.com/hitw93/article/2032091246588518683)

## 意图对齐

在现在看来其实是老生常谈的话题。不过在 **Plan** 模式出现之前这个问题是广泛存在的。

简而言之就是：自然语言的描述是模糊的、高度概括的，因此通过一两句话生成代码的过程会发生从少到多的语义的扩展。

如果不把话说清楚，很容易让 **AI** 在自然语言没有描述的地方产生幻觉。

现在使用 **Superpowers** 的 **Brainstorming Skill** 就可以很好地解决这个问题。

这个 **Skill** 会让 **Agent** 在每次尝试写新功能的时候都跟你进行意图对齐，这是 **Skill Description** 原文：

```markdown
---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---
```

另外，这个 **Skill** 会在过程中通过若干个询问主动和你对齐意图，并且给出设计方案以供 **Review**。

也就是说：我们原来的 `需求 - Coding - Code Review` 这一个链路被压缩到了写代码之前。

变成了 `需求 - Plan - Plan Review - Coding`。

这个过程的好处是显然的：**Review** 方案显然比 **Review** 代码容易，而且解耦了 **Code Review** 和 **Plan Review**。

做 **Code Review** 的时候我能够更加关注代码规范而不是方案本身。

那么 **Plan** 模式的意义就变成了一层硬约束，也就是 **Read Only** 模式，此时进行 **Brainstorming** 能够更好地约束 **Agent** 行为。

在这之后，**Brainstorming** 还会将你已经确认过的 **Plan** 按照一定的颗粒度划分为若干个 **Todo Task** 撰写为最终的 **Plan**，命名为 `Date-{Description}.md` 的形式，写入到 `doc/plans` 下面进行持久化，并且 `commit` 到 **Git**。

这样做的好处就是能够防止实施的过程中丢失上下文。

同时也能形成整个项目的发展历程，方便追溯，实现了一定程度的项目级 **Memory**。

关于这一点的设计，**Vue** 作者尤雨溪在自己的中文 **X** 上也有提及：[尤雨溪 on **X**](https://x.com/yuxiyou/status/2023892606317703654)，不知道算不算是大佬的殊途同归。

关于项目级 **Memory** 我们后面再谈。

## **TDD**

测试驱动开发（**TDD**，**Test-Driven Development**）是一种软件开发方法论，其核心思想是**在编写业务逻辑代码之前，先编写测试代码**。

**TDD** 依赖于一个极短的、不断重复的开发周期，业内通常称之为**红-绿-重构**（**Red-Green-Refactor**）循环：

1. **红**（**Red**） - **编写失败的测试**：在实现一个功能之前，先对功能编写测试。由于此时功能并未实现，因此测试必然失败。
2. **绿**（**Green**） - **让测试通过**：编写**刚好**能让该测试通过的最少业务代码。在这个阶段，不要去考虑代码的优雅性、性能或设计模式，唯一的目的就是让测试运行成功（显示为绿色），哪怕是硬编码返回值也可以。
3. **重构**（**Refactor**） - **优化代码**：在测试用例的“保护套”下，回顾并重构刚才写的代码。消除重复逻辑、优化命名、改善结构和可读性。只要重构后测试依然保持通过，就说明你的修改没有破坏原有的业务逻辑。

这套流程在我们日常的开发过程当中（尤其是个人小项目的开发过程当中）很难实现，因为并没有那么大量的人力成本帮我们编写测试。

但是 **Agent** 用起来就十分合适：通过测试和业务代码对抗的思路，可以强化最终代码的实现效果，并且有效防止 **AI** 写 **Bug**。

## **Subagent**

回到每次对话中的上下文结构，除了我们自定义的原信息，以及不可压缩的代码信息以外，就剩下模型自己的输出了。

那么模型自己的输出如何优化呢？我们同样先观察模型输出的上下文结构。

不难发现不同的 **Task** 之间的模型输出文本之间的上下文联系是稀疏的：也就是实际上对于不同的 **Task** 我可以直接开一个新的 **Session** 来跑。

这就是 **Subagent**：将任务分发给子 **Agent** 来完成，以减少主 **Agent** 的无用上下文占用。

在这个基础上，我还能给 **Subagent** 注入不同的角色设定提示词，激发更为专业的操作。

一般来说更为常见的方法是通过设计不同的 **Subagent** 角色来适应不同的工作，但是 **Superpowers** 的实现更为简单而暴力。

**Superpowers** 框架自带 [subagent-driven-development](https://github.com/obra/superpowers/tree/main/skills/subagent-driven-development) 这样的 **Skill**，通过直接对一个完全白板的 **Subagent**（在 **OpenCode** 中是 @general 或者 @explore）注入提示词实现。

这样的设计也符合仓库的 **Everything in Skills** 设计理念。

## Code Review

**Code Review**（代码审查）是软件开发生命周期中的一个关键质量保证环节。它指的是在代码合并到主代码库或部署到生产环境之前，由代码原作者以外的开发者对其源代码进行**系统性的阅读和检查**。

作为**软件工程**和多人合作工作流当中的经典一环，**Code Review** 对于工程健康程度的好处已经在业内经历长期而广泛的验证。

如果尝试给 **GitHub** 上的一些项目提交过 **PR**，例如我的 [Pull Request #555 · obra/superpowers](https://github.com/obra/superpowers/pull/555)，在开发过程中就经历了开发者以及 **AI** 的 **Review**。

通过 **Code Review**，新代码能够深度和当前团队的设计语言进行对齐，以确保代码质量。

迁移到 **Agentic Workflow**，通过 **Code Review Agent** 对 **Coding Agent** 写的代码进行 **Code Review** 就是一个很自然的思想了。

在 **Superpowers** 中，一个完整的开发周期会自动使用 `requesting-code-review` 在开发结束之后进行 **Code Review**，并且在 **Review** 之后使用 `receiving-code-review` 对收到的 **Review** 结果进行必要的修改。

## 项目级 Memory

**AI Memory**（**AI** 记忆）是指 **LLM** 在交互过程中存储、检索和利用历史信息、上下文或外部知识的机制。它的核心作用是让 **AI** **突破单次对话信息被 Session 分割的限制**，具备跨 **Session** 连续性以及自我进化等性质。

简单来说，**Memory** 机制就是为了让 **AI** 得到的内容不仅仅限于当前对话，还能做到跨对话搜索，以及让 **Agent** 对项目的熟悉程度能够随着 **Agent** 的使用增加，而不是每次对话都从零开始。

关于 **Memory** 这一块的内容，目前社区的解决方案还趋于多元化，各种级别的解决方案层出不穷。

最近看 Tw93 大佬的 X 似乎也有提到这玩意 [Tw93 on X](https://x.com/HiTw93/status/2033332424134795568)，不过我还是觉得有点麻烦。

我的解决方案已经交到了[我的 **Superpowers** Fork](https://github.com/LanternCX/superpowers)，并且给 **Superpowers** 提交了 [PR](https://github.com/obra/superpowers/pull/555) 和 [Feature Request](https://github.com/obra/superpowers/issues/551)。思路来自于胡渊鸣大佬的文章[如何有效地给 10 个 Claude Code 打工 - 知乎](https://zhuanlan.zhihu.com/p/2007147036185744607)。

详细的设计方案可以看我提交的 **PR**。简单来说，我在这个 **Fork** 中引入了一个基于轻量级 **RAG** 机制的项目级别 **RAG** 机制，使用下面的目录：

```markdown
./.progress
├── entries
│   └── 2026
│       ├── 2026-03-16-5.md
│       └── 2026-03-16-6.md
└── PROGRESS.md
```

并且在 `PROGRESS.md` 中引入了索引（**Global TOC**）：

| Page ID | Date   | Title  | Path     | Keywords   |
| ------- | ------ | ------ | -------- | ---------- |
| {id}    | {date} | {desc} | `{path}` | {keywords} |

让 **Agent** 在每次项目进行深度 **Debug**、关键功能开发、关键重构之后都记录一篇日志。

不过这个方法没有经过广泛验证，实际效果我也没上过 **Benchmark**，不知道实际的使用效果怎么样。

具体说明可以看看我的 [Feature Request](https://github.com/obra/superpowers/issues/551) 中的叙述。**如果你对这个方案感兴趣，欢迎去我的 **Fork** 仓库里拉下来在你的项目中跑跑看，也欢迎 **Issue** / **PR**。**

## Everything in CLI

**Everything in CLI**（万物皆可命令行）是一种计算与开发哲学，主张**尽可能在命令行界面中完成所有的工作任务**，而尽量避免使用图形用户界面和鼠标操作。

这个观点在前文提到过：在上下文管理中，使用动态引入的 **Skill** 远比引入定义完整的 **MCP** Server 要好。

这个思想对 **Agent** 适用程度极高的原因是：相比人类使用视觉进行输入，**Agent** 更适合采用纯文本的输入与输出。

**CLI** 操作完美贴合了这一点。相信用过没有 **UI** 页面面的纯 **SSH** 连接 **Linux** 服务器的朋友们都深有体会：一个好的 **CLI** 程序不比 **GUI** 差。

实际上，**GUI** 对于一个程序来说不是必须的，只要有合适的用户接口能够接入程序即可。

因此，将所有接口操作封装为 **Agent Friendly** 的 **CLI** 命令，只需要用一个 **Skill** 教会 **Agent** 如何调用，这样的思想就成为了面向 **Agent** 开发过程中的经典范式。

其实在看到港大开源的项目 [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)，将任意一个程序转换为 **CLI** 的形式之前，我就有类似的想法。

基于这个思想，我写了 [LanternCX/mpy-cli](https://github.com/LanternCX/mpy-cli)，尝试用 **CLI** 操作替换掉 **mpy** 开发过程当中的各种的 **Thonny** 操作，事实证明效果非常之好。

这几天各种平台的 **CLI** 版本层出不穷，似乎也印证了这个思想的合理性。

以前是将底层操作封装为 **GUI** 方便人类使用，现在是将底层操作封装为 **CLI** 方便 **Agent** 使用。

当然这并不是说 **MCP** 不好。**MCP** 和 **Skill** 解决的不是一类问题。简单来说，**MCP** 的核心是让不同模型标准化地访问本地资源与外部工具，相当于通用的外设接口；而 **Skill** 提供的是针对特定任务的工作流规范和认知引导，相当于操作手册。

在上下文寸土寸金的地方，**Skill** 显然更好。而 **MCP** 更倾向于解决和服务端通信的稳定与格式化。

## Everything in Skills

如果阅读过 **OpenCode** 的[配置文档](https://opencode.ai/docs/zh-cn/config/)，你会发现 **Superpowers** 只是设计了一套 **Skills**，并没有实现 `commands` 和 `agent` 层。

关于这一点，其实可以在 **Superpowers** 的 **Issue** 和 **PR** 中找到作者的观点：

`skills` 才是 `superpowers` 的核心抽象，`commands` 更像兼容层，`agents` 更像平台补充入口。不应该再额外抽象成一套跨平台统一系统。

- 在 [Issue #669](https://github.com/obra/superpowers/issues/669) 和 [PR #727](https://github.com/obra/superpowers/pull/727) 中，作者明确说 **deprecated commands** 只是为了兼容旧用户而临时保留，未来仍会移除。

- 在 [Issue #687](https://github.com/obra/superpowers/issues/687) 中，作者表示不会普遍拦截平台原生命令，只在极少数入口做引导，说明他不想和平台原生设计语言抢语义。

- 在 [PR #687](https://github.com/obra/superpowers/pull/687) 中，作者关闭 **Gemini CLI** 的安装器方案，理由是 **dev** 分支已经在做更原生、更简单的接入，说明他偏好平台原生机制而非额外包装层。

- 在 [PR #618](https://github.com/obra/superpowers/pull/618) 中，作者又明确表示希望避免 **duplicate boilerplate**，并且一直在努力避免把 **Skill** 一个个复制或 **symlink** 到平台目录，因为这会成为维护噩梦。

这些信号放在一起看，作者的方向非常一致：跨平台支持是欢迎的，但应尽量保持 `skills` 作为唯一核心，用每个平台自己的原生能力去承载它，而不是再造一层统一的 `agents + commands`。

也就是说，实际上 **Agent** 和 **Command** 的功能其实和 **Skills** 是重复的。在 **Superpowers** 的设计语言中，`agent` 和 `command` 只是作为跨平台的一个兼容层，一套核心 **Skill** + 最小兼容层的设计才是设计主线。

这就是 **Everything in Skills** 思想：**只学会写 Skills 就足够覆盖所有场景**。

这也是为什么我不推崇使用 [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) 的原因。

## 软件工程

**AI** 很容易写史山，我们要做的就是对 **AI** 用**软件工程**（曾经用来避免人类写史山的方法）。

知道一些**软件工程**中的重要概念或者思想，能够更好地 **Review Agent** 写的代码，并且教 **AI** 怎么写出优雅的代码。

### 设计范式

**YAGNI**（**You Aren't Gonna Need It**，你通常不需要它）是**软件工程**中的一项核心设计原则，其核心思想是：**只在真正需要时才编写代码，永远不要为了未来可能的需求而提前添加功能或进行过度设计**。

**DRY**（**Don't Repeat Yourself**，不要重复自己）同样是**软件工程**中极其基础且重要的一项设计原则，其核心思想是：**系统中的每一项知识或逻辑，都必须拥有单一的、无歧义的、权威的表述**。

也就是说，在工程实践当中：

- **DRY** 负责把你现有的代码整理干净、高内聚。

- **YAGNI** 负责把控入口，阻止你往干净的代码库里塞入不需要的废料。

也就是每一个针对新功能的修改都是当前状态下允许的最小修改。

### 架构治理

**高内聚（High Cohesion）** 指一个模块内部的代码和职责应该高度相关，共同完成一个明确的、单一的任务。

**低耦合（Low Coupling）** 指不同的系统模块之间应该尽量减少相互依赖，保持相对的独立性。

高内聚与低耦合是衡量软件架构和模块划分质量的最核心标准。它们通常成对出现，目标是构建易于维护、测试 and 扩展的系统。

简单来说，就是如果两个功能能分文件写，就不要写到一起。一个文件（或者一个模块）应该职责清晰，负责单一的功能。减少各类不合理的依赖（子模块依赖父模块等）。

### Git 工作流

**Git** 主要分为两个方面：**Commit Message** 以及 **Branch**。

对于 **Commit Message** 格式，我推荐使用 [Angular 提交信息规范](https://zj-git-guide.readthedocs.io/zh-cn/latest/message/Angular%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF%E8%A7%84%E8%8C%83/)：

例如这是我的项目的一个 **Commit**：[LanternCX/codex-gateway@bc072e6](https://github.com/LanternCX/codex-gateway/commit/bc072e600b2564c4134c501c8f03f05b48d1b7ad)

```markdown
fix(server): normalize codex responses request payload
Ensure codex_oauth responses requests include default instructions and strip compatibility-only token limit fields before proxying, so OpenCode-compatible payloads don't get rejected upstream.

Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>
```

**Git Branch** 的话，推荐参考 [Git Flow | 菜鸟教程](https://www.runoob.com/git/git-flow.html)。

不过对于个人项目，我一般都只分 **dev** 分支和 **main** 分支，最多再分一个 **feat/fix** 分支。

**Superpowers** 对于 **Git Worktree** 的 **Skill** 使用太重，我一般写个人项目都会把这个 **Skill** 重定向覆盖掉。

### OOP

**面向对象编程**（**OOP**，**Object-Oriented Programming**）是一种软件编程范式，其核心思想是**将现实世界中的事物抽象为各类对象，并围绕这些对象的数据和行为来组织代码结构**，而不是围绕纯粹的函数 and 逻辑执行步骤。

看起来是一个很基础的概念，但是在嵌入式系统中使用 **C 语言** 这种面向过程的语言或者 **C++** 这种面向对象设计的一坨的语言中进行面向对象设计还是很具有挑战的。

### 最佳实践

**最佳实践**（**Best Practice**）是指在特定行业或领域内，经过大量实际项目检验、被业界广泛认可为**目前最有效、最可靠且能产生最优结果的方法、技术或流程标准**。

在**软件工程**中，之前我们讨论过的 **TDD**、**DRY**、**YAGNI**、**Code Review** 等等原则，本质上都属于业界沉淀下来的最佳实践。

如果不知道这个地方怎么设计，可以尝试和 **Agent** 讨论这个地方业内进行过的最佳实践是怎么做的，进行参考。

当然，这篇文章的本质，也是在寻找一个面向 **Agent** 开发过程当中的最佳实践。

## 苦涩的教训与 Scaling Law

这两个概念其实都是在大模型设计上的一些科研类共识，不过对于我们认识 **LLM**，了解 **AI** 十分有帮助。

### 苦涩的教训

**《苦涩的教训》**（**The Bitter Lesson**）是**理查德·萨顿**（**Rich Sutton**）在 2019 年发表的著名文章，**核心观点**是：在人工智能的发展史中，**利用通用计算能力（算力）的方法，最终总是会胜过依赖人类先验知识 and 领域专长的方法**。

这篇文章认为，**AI** 研究不应该致力于弄清楚“人类思维是如何运作的”并将其编码，而应该专注于发现那些能够利用海量算力自己去学习、去发现世界规律的算法。也就是我们应该寻找“元方法”。

纵观大模型发展历史，我们可以发现：

- **Transformer** 的贡献不仅仅是注意力机制，更是给了 **NLP** 任务一个能够通过 **GPU** 进行大量并行计算的方法。
- **ResNet** 的贡献在于提供了一个将模型做大做深的方法。
- **ViT** 这样的模型更是直接通过苦涩的教训这一思想暴力解决了计算机视觉的困扰。

应用到工程上，我认为就是 **Superpowers** 作者支持的观点：**Everything in Skills**。

在工程中寻找最适合 **AI** 理解的简单范式，即可。

### Scaling Law

**Scaling Law**（缩放定律）的核心观点是：大语言模型（**LLM**）的最终性能与模型的**计算量**、**参数量**和训练**数据量**之间存在着精确的、可预测的幂律关系（**Power-law Relationship**），而与具体的模型架构细节（如**层数**、**深度**、**宽度**）关系不大。

这一定律能够很好地指导我们选择模型：

- 字节和 **GitHub** 的视频模型为什么这么强？因为字节有**抖音**、**Google** 有 **YouTube**。

- 为什么 **Codex** 和 **Opus** 的编码能力这么强？因为 **Codex** 背后是**微软**和 **GitHub**，**Opus** 背后是 **Claude** 大量用户的交互数据。

## 杂谈

### 关于思考

思考、产出 **Idea** 很重要，多跟 **AI** 聊天整理思路。

人类擅长从更宏大更模糊的问题中找到解。

因此如果不想被 **AI** 代替，要多思考，多输入输出。

### 如何学习

**Vibe Coding** 是一个全球程序员空前的超大共同话题。各大平台有各种大佬分享过自己的见解，尤其是在 **X**、**知乎**、**小红书**、**Telegram** 这种纯文字平台，以及 **GitHub Issues**、**Discussion**、**PR**，也就是创作成本极低的论坛式平台，有更多的大佬一手资料。

### 定制工具

人类和动物的最大区别就是会制造和使用工具，尤其是制造工具。

**AI** 写代码发达的今天，定制工具的成本变得极低，对于社区不成熟或者没有很好的解决方案的领域，自己造一个更好或者更适合自己的工具未尝不可。

### 技术选型

这是一个很深刻的教训。

我是高中的时候是做过古法编程的，以前熟悉的后端模式是经典的 **Java SpringBoot** + **MySQL**，因为开发起来方便。

但是这套模式在现在的问题很明显：对于轻量应用来说太重了。

在我不熟悉新技术的情况下，以前要是让我写一个前后端的站，我一定会用 **Java** 做后端。

但在今天看来选择自己熟悉的技术似乎是错误的。

我的项目 [LanternCX/Ark](https://github.com/LanternCX/Ark) 就犯了这个错误。

项目的思路其实很好：不考虑隐私的前提下，让 **AI** 扫全盘帮我整理要备份的文件，并且我能给出一些规则结合传统方法剪枝。

但我写的差不多之后，发现 **Python** 效率太低了。导致我纯粹扫全盘都要花上几个小时，更别提还要通过 **AI** 构建规则。

后来我长记性了，我的项目 [LanternCX/codex-gateway](https://github.com/LanternCX/codex-gateway) 直接使用了我不熟悉的 **Go** 作为后端。

后来发现就算我不熟悉 **Go**，但是因为有 **Vibe Coding**，设计思路是相通的，后面我就获得了一个简洁优雅高效的服务端。

同样在 [LanternCX/mpy-cli](https://github.com/LanternCX/mpy-cli) 也是这个思路，选了一个轻量级数据库 **SQLite** 作为数据库，非常小巧好用。

### 成本控制

1. **国内模型**

   中国 **LLM** 由于极低的电费成本导致 **Token** 成本极低，在算力跟上之后有了不错的性能。

   不过 **Codex** 邪修实在是太香了，导致我根本不想用国内的模型。

2. **选模型指北**

   之前提到过 **Scaling Law** 所谓的模型能力其实就是看**算力**、**数据**、**规模**三个维度。

   **算力**和**规模**其实大差不差，因此实际上谁掌握了**数据**谁就有话语权。

   当然多逛逛论坛看看别人的测评意见是更好的。

3. **Cache Hit**

   有些时候，切换模型其实比不切换模型更贵。

   因为如果你熟悉 **Transformer**，**LLM** 计算几段不同的字符串中的相同前缀，前缀重叠的部分的运算其实是重复的，通过一些持久化的缓存机制就可以有效降低重复计算，降低成本。

   例如你查看 **DeepSeek** 的定价 [DeepSeek API Docs](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)，就会发现缓存命中的价格是缓存未命中的价格的十分之一。

   但是这个缓存机制对于每个模型是独立的。

   因此如果此时切换模型，缓存会被重建，这时候所有的输入都会变成缓存未命中的状态。

   这样就会导致：明明切换到了一个更便宜的模型，成本却不降反升。

### 工程能力

什么是工程能力？

我曾经说，我们学院的同学缺乏工程训练。

但是不同意的声音说：很多同学其实都接受过科研训练，实际上就是工程训练。

因此我给出定义：工程能力好的同学在解决一个问题或者实现一个 **Idea** 需要 3 个月，而工程能力不好的同学则需要半年甚至一年。

这并不是我的观点，而是我从 [WhynotTV - 翁家翌](https://www.bilibili.com/video/BV1darmBcE4A/) 这期播客中提炼的：好的 **Infra** 十分重要。教一个 **Researcher** 成为一个 **Engineer** 比教一个 **Engineer** 成为 **Researcher** 要难。

工程能力好的同学不仅仅会解决问题。

还会从失败中学习、改进自己的工作流、设计代码复用效率更高的脚手架等等。

也就是说：**解决问题的能力 and 想出解决方案的能力并不等同**。

### 以前写过的文章

我对 **Vibe Coding** 的初期探索：[关于 Vibe Coding 的思考与探索](https://www.caoxin.xyz/index.php/archives/82/)

现在我新建一个新工具类项目会用的 **Prompt**：[项目初始化 prompt](https://www.caoxin.xyz/index.php/archives/83/)

## 写在最后

写了这么多，其实核心可以归纳为两个部分：

1. 对于工程
   - 对 **AI** 用**软件工程**
   - 积极 **Review**
   - 寻找并学习**最佳实践**
2. 对于个人
   - 多 **IO**（**阅读**、**思考**、**实践**）
   - 保持学习
   - 跳出舒适区（积极改进自己的工作流）

**AI** 时代发展的很快，很有可能我今天的观点在明天看来就是过时甚至完全错误的。

我们能做的就是保持学习与保持 **IO**，**技术可能会过时**，但是**学习与思考的能力总是硬通货**。