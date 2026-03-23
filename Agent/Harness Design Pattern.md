# Harness 设计模式

两篇文章的省流版。

## SKILL 设计模式

来自 Goolgle 文章：[5 Agent Skill design patterns every ADK developer should know](https://x.com/GoogleCloudTech/status/2033953579824758855)

核心入口都是 `SKILL.md`

区别在于如何利用 `references/`（存放规则、检查清单等参考资料）和 `assets/`（存放模板等资产）目录来拆分逻辑

### **Tool Wrapper 工具包装器**

只需引入包含具体库或框架规范的参考文件。

通常结合 CLI 形成 SKILL + CLI 的模式。

```
skills/
└── tool-wrapper-skill/
    ├── SKILL.md
    └── references/
        └── conventions.md (存放最佳实践、框架规范)
```

### **Generator 生成器**

需要同时定义“长什么样”（模板）和“怎么写”（风格）。

```
skills/
└── generator-skill/
    ├── SKILL.md
    ├── references/
        └── style-guide.md (存放语气、格式等风格指南)
    └── assets/
        └── template.md (存放结构化的输出模板)
```

### **Reviewer 审查者**

核心在于将具体的评分标准解耦到独立的清单文件中。

```
skills/
└── reviewer-skill/
    ├── SKILL.md
    └── references/
        └── review-checklist.md (存放按严重程度划分的检查清单)
```

### **Inversion 反转**

核心在于**反转对话的控制权**。

简单来说：

- **常规模式（用户主导）**：你给出一个模糊的需求 → Agent 立即开始生成结果（通常缺乏上下文，靠瞎猜，导致输出不符合预期）。
- **Inversion 模式（Agent 主导）**：Agent 变成“面试官” → 它根据预设的框架一步步向你提问 → 你回答 → 只有当所有关键信息收集完毕后，它才开始生成最终方案。

通常在收集完所有信息后的综合阶段（Synthesis）才会用到输出模板。

```
skills/
└── inversion-skill/
    ├── SKILL.md (内含多阶段提问的硬性门控逻辑)
    └── assets/
        └── plan-template.md (存放最终交付物模板)
```

### **5. Pipeline 流水线**

最复杂的结构，根据不同步骤按需加载各种参考文件和模板。

```
skills/
└── pipeline-skill/
    ├── SKILL.md (定义包含确认节点的多步工作流)
    ├── references/
        ├── step-specific-rules.md (特定步骤需要的规则，如 docstring-style)
        └── quality-checklist.md (质量自检清单)
    └── assets/
        └── assembly-template.md (最终组装阶段使用的模板)
```

### Skill 设计模式决策流程

在开发 Agent 技能时，可以通过以下问题决策树来选择最合适的设计模式：

1. **你的首要目标是给 Agent 补充特定技术的领域知识吗？**
   - **是** $\rightarrow$ 使用 **Tool Wrapper**。避免在 Prompt 中硬编码，按需加载知识。
   - **否** $\rightarrow$ 进入下一步。
2. **你需要 Agent 根据预设结构输出高度一致的文档或代码骨架吗？**
   - **是** $\rightarrow$ 使用 **Generator**。用模板填空的方式规范输出。
   - **否** $\rightarrow$ 进入下一步。
3. **任务的核心是检查、评分或审核已有的代码/文本吗？**
   - **是** $\rightarrow$ 使用 **Reviewer**。加载检查清单进行结构化审计。
   - **否** $\rightarrow$ 进入下一步。
4. **Agent 在给出方案前，是否必须向用户澄清模糊需求或收集前置条件？**
   - **是** $\rightarrow$ 使用 **Inversion**。强制 Agent 在生成结果前先进行结构化提问。
   - **否** $\rightarrow$ 进入下一步。
5. **这是一个包含多个独立阶段，且某阶段必须经人工确认（或系统校验）才能继续的复杂任务吗？**
   - **是** $\rightarrow$ 使用 **Pipeline**。设计带有严格阻断条件（Checkpoints）的工作流。

如果单一模式无法满足复杂需求，可以将它们组合使用。例如，主流程是 Pipeline，第一步使用 Inversion 收集需求，中间步骤使用 Generator 生成代码，最后一步使用 Reviewer 进行代码审计。

## Agent 设计模式

来自 Tw93 文章：[你不知道的 Agent：原理、架构与工程实践](https://x.com/HiTw93/status/2034627967926825175)

### **基础控制流模式**

1. **提示链 (Prompt Chaining)**：将任务拆解为顺序执行的步骤，每一步的 LLM 处理上一步的输出，中间可加入代码检查点。适合线性的生成流程，例如先生成大纲再编写正文。

2. **路由 (Routing)**：对用户的输入进行分类，定向到对应的专用处理流程。例如简单咨询走轻量模型，复杂技术问题走强模型。

3. **并行 (Parallelization)**：

   - **分段法**：将任务拆分为独立的子任务并发运行

   - **投票法**：将同一任务多次运行并取共识。适用于高风险决策或需要多视角的场景

4. **编排器-工作者 (Orchestrator-Workers)**：由一个中央 LLM 动态分解任务，委派给多个工作者 LLM 分别执行，最后由中央 LLM 综合处理结果。

5. **评估器-优化器 (Evaluator-Optimizer)**：生成器负责产出内容，评估器负责提供反馈，系统在此之间不断循环直到结果达标。适合翻译、创意写作这类质量标准难以用代码精确定义的任务。

### **多 Agent 组织与协作模式**

1. **指挥者模式 (同步协作)**：人与单个 Agent 紧密互动，每一轮都需要人工介入调整决策。缺点是会话结束后上下文随之清空，产出物相对短暂。
2. **统筹者模式 (异步委派)**：人在任务开始时设定目标，中间由主 Agent 统筹并下挂多个子 Agent 独立并行工作，最后人仅负责审查产出工件。子 Agent 探索和调试的细节留在独立的上下文中，执行完毕只向主 Agent 回传结论摘要。
3. **长任务拆分协作模式 (Initializer 与 Coding Agent)**：针对单个 Session 无法做完的长任务，将其拆分为两个角色。Initializer Agent 负责首轮运行，将任务转化为可持久化的外部状态（如进度清单文件）；Coding Agent 负责后续循环执行，每次从外部文件恢复现场、执行验证并更新状态，确保任务中断也能恢复。