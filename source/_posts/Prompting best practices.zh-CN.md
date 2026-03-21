---
title: "提示词最佳实践"
date: "2026-03-19T09:17:19+08:00"
updated: "2026-03-19T09:17:19+08:00"
categories:
  - "Agent"
---

# 提示词最佳实践

翻译自 [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

由于原文提供的中文翻译有缺损，于是进行了自行翻译。

版本：2026.03.11

---

关于 Claude 最新模型提示工程技术的综合指南，涵盖清晰性、示例、XML 结构化、思考以及代理式系统。

---

这是针对 Claude 最新模型进行提示工程的唯一参考资料，包括 Claude Opus 4.6、Claude Sonnet 4.6 和 Claude Haiku 4.5。内容涵盖基础技术、输出控制、工具使用、思考以及代理式系统。跳转到与你当前场景相匹配的部分。

关于模型能力的概览，请参见 [models overview](https://platform.claude.com/docs/en/about-claude/models/overview)。关于 Claude 4.6 的更新详情，请参见 [What's new in Claude 4.6](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-6)。关于迁移指导，请参见 [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)。

## 一般原则

### 保持清晰和直接

Claude 对清晰、明确的指令响应良好。具体说明你期望的输出，有助于提升结果质量。如果你希望获得“超出预期”的表现，请明确提出，而不要依赖模型从模糊的提示中自行推断。

可以把 Claude 想象成一位非常聪明但刚入职的新员工，他不了解你的规范和工作流程背景。你越精确地说明自己的需求，结果就会越好。

**黄金法则：** 把你的提示词展示给一位几乎不了解任务背景的同事，并让他们照着执行。如果他们会感到困惑，Claude 也会。

- 明确说明期望的输出格式和约束条件。
- 当步骤的顺序或完整性很重要时，使用编号列表或项目符号，将指令写成连续的步骤。

**示例：创建分析仪表板**

**效果较差：**
```text
创建一个分析仪表板
```

**效果更好：**
```text
创建一个分析仪表板。尽可能包含更多相关功能和交互。不要停留在基础层面，而要实现一个功能完整的版本。
```


### 添加上下文以提升表现

为你的指令提供背景或动机，例如向 Claude 解释为什么这种行为很重要，可以帮助 Claude 更好地理解你的目标，并给出更有针对性的回复。

**示例：格式偏好**

**效果较差：**
```text
绝不要使用省略号
```

**效果更好：**
```text
你的回复会由文本转语音引擎朗读，因此绝不要使用省略号，因为文本转语音引擎不知道该如何发音。
```


Claude 足够聪明，能够从解释中进行泛化。

### 有效使用示例

示例是引导 Claude 输出格式、语气和结构最可靠的方法之一。少量设计良好的示例（称为 few-shot 或 multishot prompting）就能显著提高准确性和一致性。

添加示例时，应确保它们具备以下特点：
- **相关：** 尽量贴近你的实际使用场景。
- **多样：** 覆盖边界情况，并保持足够变化，避免 Claude 学到无意中的模式。
- **结构化：** 用 `<example>` 标签包裹示例（多个示例用 `<examples>` 标签），以便 Claude 将它们与指令区分开来。

> 提示：为了获得最佳效果，建议提供 3-5 个示例。你也可以让 Claude 评估你的示例是否足够相关和多样，或者基于你的初始示例生成更多示例。

### 使用 XML 标签组织提示词

XML 标签可以帮助 Claude 无歧义地解析复杂提示，尤其是在你的提示中混合了指令、上下文、示例和变量输入时。将每种类型的内容分别包裹在各自的标签中（例如 `<instructions>`、`<context>`、`<input>`），可以减少误解。

最佳实践：
- 在你的提示词中使用一致且描述性强的标签名。
- 当内容具有自然层级时使用嵌套标签（例如多个文档放在 `<documents>` 中，每个文档再放在 `<document index="n">` 中）。

### 为 Claude 设定角色

在 system prompt 中设定角色，可以让 Claude 的行为和语气更贴合你的使用场景。哪怕只有一句话，也会产生明显差异：

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system="你是一位乐于助人的编程助手，专长是 Python。",
    messages=[
        {"role": "user", "content": "如何按键对字典列表进行排序？"}
    ],
)
print(message.content)
```

### 长上下文提示

处理大型文档或富含数据的输入（20K+ tokens）时，仔细组织提示词结构，能够获得更好的结果：

- **把长篇数据放在顶部**：将长文档和输入内容放在提示词靠前的位置，高于你的问题、指令和示例。这能显著提升所有模型的表现。

> 注意：在测试中，将问题放在末尾最多可将回复质量提升 30%，尤其是在复杂的多文档输入场景下。

- **使用 XML 标签组织文档内容和元数据**：当使用多个文档时，为了提高清晰度，请将每个文档包裹在 `<document>` 标签中，并使用 `<document_content>` 和 `<source>`（以及其他元数据）子标签。

**多文档结构示例**

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    分析年度报告和竞争对手分析。识别战略优势，并推荐第三季度的重点方向。
    ```
    

- **让回复基于引用内容**：对于长文档任务，先要求 Claude 引用文档中的相关部分，再执行具体任务。这能帮助 Claude 从其余大量文档内容中筛出关键信息。

**引用提取示例**

    ```xml
    你是一名 AI 医师助理。你的任务是帮助医生诊断患者可能患有的疾病。

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    找出患者病历和就诊历史中与诊断患者所报告症状相关的引用内容。将这些内容放入 <quotes> 标签中。然后，基于这些引用，列出所有有助于医生诊断患者症状的信息。将你的诊断信息放入 <info> 标签中。
    ```
    

### 模型自我认知

如果你希望 Claude 在你的应用中正确识别自身，或使用特定的 API 字符串：

```text 模型身份示例提示词
助手是 Claude，由 Anthropic 创建。当前模型是 Claude Opus 4.6。
```

对于需要指定模型字符串的 LLM 驱动应用：

```text 模型字符串示例提示词
当需要使用 LLM 时，除非用户另有要求，否则请默认使用 Claude Opus 4.6。Claude Opus 4.6 的精确模型字符串是 claude-opus-4-6。
```

## 输出与格式

### 沟通风格与详略程度

与之前的模型相比，Claude 的最新模型采用了更简洁、更自然的沟通风格：

- **更直接、更务实：** 提供基于事实的进度汇报，而不是自我夸耀式的更新
- **更口语化：** 表达稍微更流畅、更贴近日常用语，不那么像机器
- **更少赘述：** 为了提高效率，除非另有提示，否则可能会省略详细总结

这意味着 Claude 可能会在工具调用后跳过口头总结，直接进入下一步操作。如果你希望更清楚地了解它的推理过程：

```text 示例提示词
完成涉及工具使用的任务后，快速总结一下你所做的工作。
```

### 控制响应格式

有几种特别有效的方法可以引导输出格式：

1. **告诉 Claude 要做什么，而不是不要做什么**

   - 不要这样说："Do not use markdown in your response"
   - 可以试试："Your response should be composed of smoothly flowing prose paragraphs."

2. **使用 XML 格式标识符**

   - 可以试试："Write the prose sections of your response in \<smoothly_flowing_prose_paragraphs\> tags."

3. **让你的提示词风格与期望输出保持一致**

   你在提示词中使用的格式风格，可能会影响 Claude 的响应风格。如果你仍然遇到输出格式可控性的问题，尝试让提示词风格尽可能贴近期望的输出风格。例如，从提示词中去掉 markdown，可能会减少输出中 markdown 的使用量。

4. **为特定格式偏好使用详细提示词**

   如果你希望更精细地控制 markdown 和格式的使用，可以提供明确指导：

```text 用于尽量减少 markdown 的示例提示词
[avoid_excessive_markdown_and_bullet_points]
在撰写报告、文档、技术说明、分析或任何长篇内容时，请使用清晰、流畅的完整段落和句子来写作。使用标准段落分隔来组织内容，并主要将 markdown 保留给 `inline code`、代码块（```...```）和简单标题（### 和 ###）。避免使用 **bold** 和 *italics*。

除非满足以下情况，否则不要使用有序列表（1. ...）或无序列表（*）：a）你确实是在呈现彼此独立的项目，且列表格式是最佳选择；或 b）用户明确要求使用列表或排名

不要用项目符号或编号来罗列内容，而应将它们自然地融入句子中。这条指导尤其适用于技术写作。使用散文而非过度格式化会提升用户满意度。绝不要输出一连串过于简短的项目符号。

你的目标是写出可读、流畅的文本，自然地引导读者理解思路，而不是把信息割裂成彼此孤立的要点。
[/avoid_excessive_markdown_and_bullet_points]
```

### LaTeX 输出

Claude Opus 4.6 默认会对数学表达式、公式和技术说明使用 LaTeX。如果你更偏好纯文本，请在提示词中加入以下说明：

```text 示例提示词
仅以纯文本格式作答。不要使用 LaTeX、MathJax 或任何标记符号，例如 \( \)、$ 或 \frac{}{}。所有数学表达式都使用标准文本字符书写（例如，用 "/" 表示除法，用 "*" 表示乘法，用 "^" 表示指数）。
```

### 文档创建

Claude 的最新模型在创建演示文稿、动画和视觉文档方面表现出色，具备令人印象深刻的创意表现力和很强的指令遵循能力。在大多数情况下，模型第一次尝试就能产出精致且可用的结果。

为了获得最佳的文档创建效果：

```text 示例提示词
围绕 [topic] 创建一份专业演示文稿。包含经过思考的设计元素、清晰的视觉层次，以及在适当情况下加入吸引人的动画效果。
```

### 迁移离开预填充响应

从 Claude 4.6 模型开始，最后一个 assistant 回合中的预填充响应（prefilled responses）将不再受支持。模型的智能水平和指令遵循能力已经提升到，大多数过去依赖预填充的用例如今已不再需要它。现有模型仍会继续支持预填充，而在对话其他位置添加 assistant 消息也不受影响。

以下是一些常见的预填充使用场景，以及如何迁移离开它们：

**控制输出格式**

预填充曾被用来强制特定输出格式，例如 JSON/YAML、分类结果，以及类似这种通过预填充将 Claude 限制在特定结构中的模式。

**迁移方式：** [Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) 功能就是专门为约束 Claude 按给定 schema 输出而设计的。先尝试直接要求模型遵循你的输出结构，因为较新的模型在被明确告知时，已经能够可靠地匹配复杂 schema，特别是在结合重试机制时。对于分类任务，可以使用带有 enum 字段且包含有效标签的工具，或者使用 structured outputs。


**消除前言**

像 `Here is the requested summary:\n` 这样的预填充，曾被用来跳过引言式文本。

**迁移方式：** 在 system prompt 中使用直接指令："Respond directly without preamble. Do not start with phrases like 'Here is...', 'Based on...', etc." 或者，可以引导模型在 XML 标签内输出、使用 structured outputs，或使用工具调用。如果偶尔仍然出现前言式文字，可以在后处理中将其剥离。


**避免不良拒绝**

预填充曾被用来引导模型避开不必要的拒绝。

**迁移方式：** 现在 Claude 在适当拒绝方面已经做得好得多了。在 `user` 消息中进行清晰提示、而不使用预填充，通常就已足够。


**续写**

预填充曾被用来继续未完成的补全、恢复被中断的响应，或从前一次生成停止的地方接着继续。

**迁移方式：** 把续写指令移到 user 消息中，并包含被中断响应的最后文本："Your previous response was interrupted and ended with \`[previous_response]\`. Continue from where you left off." 如果这属于错误处理或不完整响应处理的一部分，并且不会带来用户体验上的损失，那么可以直接重试该请求。


**上下文补水与角色一致性**

预填充曾被用来定期确保上下文得到刷新或注入。

**迁移方式：** 对于很长的对话，把原本作为预填充 assistant 提醒的信息注入到 user 回合中。如果上下文补水是更复杂的 agent 系统的一部分，可以考虑通过工具来补水（例如，根据回合数等启发式条件，暴露或鼓励使用包含上下文的工具），或者在上下文压缩期间完成补水。


## 工具使用

### 工具用法

Claude 的最新模型经过训练，能够精确遵循指令，并且会从“明确要求使用特定工具”的指令中受益。如果你说“can you suggest some changes”，Claude 有时会只给出建议，而不是实际去实现这些改动，即使你本意可能是希望它直接修改。

如果希望 Claude 直接采取行动，就要更明确：

**示例：明确指令**

**效果较差（Claude 只会给建议）：**
```text
Can you suggest some changes to improve this function?
```

**效果更好（Claude 会直接做出修改）：**
```text
Change this function to improve its performance.
```

或者：
```text
Make these edits to the authentication flow.
```


如果你希望 Claude 默认更主动地采取行动，可以在 system prompt 中加入以下内容：

```text 用于主动执行的示例提示词
[default_to_action]
默认情况下，直接实现更改，而不只是提出建议。如果用户意图不清晰，请推断最可能有用的操作并继续执行，使用工具去发现任何缺失的细节，而不是靠猜测。尝试推断用户是否希望进行工具调用（例如读取或编辑文件），并据此行动。
[/default_to_action]
```

另一方面，如果你希望模型默认更谨慎，不要一上来就直接开始实现，只有在被请求时才采取行动，那么可以用如下提示词来引导这种行为：

```text 用于保守执行的示例提示词
[do_not_act_before_instructions]
不要在没有明确指示的情况下直接开始实现或修改文件。当用户意图模糊时，默认提供信息、开展研究并给出建议，而不是采取行动。只有当用户明确要求时，才进行编辑、修改或实现。
[/do_not_act_before_instructions]
```

与早期模型相比，Claude Opus 4.5 和 Claude Opus 4.6 对 system prompt 的响应也更强。如果你的提示词原本是为了减少工具或技能触发不足而设计的，这些模型现在反而可能会过度触发。解决方法是弱化过于激进的措辞。比如，以前你可能会写“CRITICAL: You MUST use this tool when...”，现在可以改成更普通的提示方式，如“Use this tool when...”。

### 优化并行工具调用

Claude 的最新模型非常擅长并行执行工具。这些模型会：

- 在研究过程中同时进行多项推测性搜索
- 一次性读取多个文件，以更快建立上下文
- 并行执行 bash 命令（甚至可能会成为系统性能瓶颈）

这种行为很容易被引导。虽然模型在没有提示的情况下并行调用工具的成功率已经很高，但你仍然可以将其提升到约 100%，或者调整其激进程度：

```text 用于最大化并行效率的示例提示词
[use_parallel_tool_calls]
如果你打算调用多个工具，并且这些工具调用之间不存在依赖关系，请将所有彼此独立的工具调用并行执行。只要这些操作可以并行完成，就优先同时调用工具，而不是按顺序依次调用。比如，在读取 3 个文件时，应并行发起 3 次工具调用，把这 3 个文件同时读入上下文。只要可能，就尽量最大化并行工具调用的使用，以提高速度和效率。不过，如果某些工具调用依赖前面的调用结果来确定参数等信息，则不要并行调用这些工具，而应按顺序执行。绝不要在工具调用中使用占位符，也不要猜测缺失的参数。
[/use_parallel_tool_calls]
```

```text 用于减少并行执行的示例提示词
按顺序执行操作，并在每一步之间稍作停顿，以确保稳定性。
```

## 思考与推理

### 过度思考与过分详尽

Claude Opus 4.6 在前期探索方面明显多于先前的模型，尤其是在较高的 `effort` 设置下。这样的前期工作通常有助于优化最终结果，但模型也可能在未被提示的情况下收集大量上下文，或沿着多条研究线索展开。如果你之前的提示词鼓励模型更全面地处理问题，那么对于 Claude Opus 4.6，你应该调整这类引导：

- **用更有针对性的指令替代一刀切的默认规则。** 不要写“默认使用 \[tool\]”，而应改成类似“当 \[tool\] 能帮助你更好地理解问题时，使用它。”
- **去掉过度提示。** 在先前模型中不够容易触发的工具，现在很可能会被恰当地触发。像“如果不确定，就使用 \[tool\]”这样的指令会导致过度触发。
- **把 effort 当作兜底手段。** 如果 Claude 仍然表现得过于激进，请为 `effort` 使用更低的设置。

在某些情况下，Claude Opus 4.6 可能会进行大量思考，这会增加 thinking token 的消耗并拖慢响应速度。如果这种行为不符合你的预期，你可以添加明确的指令来约束它的推理，或者降低 `effort` 设置，以减少整体思考量和 token 使用量。

```text 示例提示词
在你决定如何处理一个问题时，选择一种方法并坚持执行。除非你遇到与当前推理直接矛盾的新信息，否则避免反复重新审视决策。如果你在权衡两种方法，选定其中一种并把它贯彻下去。如果所选方法失败了，之后你始终可以再调整方向。
```

对于 Claude Sonnet 4.6，特别是从自适应思考切换到带有 `budget_tokens` 上限的扩展思考，可以在保持质量的同时，为思考成本设置一个硬上限。

### 利用 thinking 与交错 thinking 能力

Claude 的最新模型提供了 thinking 能力，这对于在工具使用后进行反思，或执行复杂的多步推理任务尤其有帮助。你可以引导它进行初始思考或交错思考，以获得更好的结果。

Claude Opus 4.6 使用[自适应思考](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)（`thinking: {type: "adaptive"}`），Claude 会动态决定何时思考以及思考多少。Claude Sonnet 4.6 同时支持自适应思考，以及带有[交错模式](https://platform.claude.com/docs/en/build-with-claude/extended-thinking#interleaved-thinking)的手动扩展思考。Claude 会根据两个因素来校准其思考行为：`effort` 参数和查询复杂度。更高的 effort 会引发更多思考，更复杂的查询也同样如此。对于那些不需要思考的简单查询，模型会直接作答。在内部评估中，自适应思考比扩展思考更稳定地带来更好的表现。可以考虑迁移到自适应思考，以获得最智能的响应。

对于 Sonnet 4.6，可以考虑在需要智能体行为的工作负载中尝试自适应思考，例如多步工具使用、复杂编码任务和长周期代理循环。如果自适应思考不适合你的用例，仍然支持带交错模式的手动扩展思考。较旧的模型使用带 `budget_tokens` 的手动思考模式。

你可以引导 Claude 的思考行为：

```text 示例提示词
在收到工具结果后，先仔细反思其质量，并在继续之前确定最佳的下一步。利用你的思考基于这些新信息进行规划和迭代，然后采取最优的下一步行动。
```

自适应思考的触发行为可以通过提示词来引导。如果你发现模型思考的频率高于预期，这种情况可能会发生在系统提示词很长或很复杂时，可以添加引导来调整它：

```text 示例提示词
扩展思考会增加延迟，因此只应在它能显著提升答案质量时使用——通常适用于需要多步推理的问题。如有疑问，直接回答。
```

如果你正在从带 `budget_tokens` 的[扩展思考](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)迁移，请替换你的 thinking 配置，并将预算控制迁移到 `effort`：

```python Before (extended thinking, older models) nocheck
client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=64000,
    thinking={"type": "enabled", "budget_tokens": 32000},
    messages=[{"role": "user", "content": "..."}],
)
```

```python After (adaptive thinking) nocheck
client.messages.create(
    model="claude-opus-4-6",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},  # 或 max、medium、low
    messages=[{"role": "user", "content": "..."}],
)
```

如果你没有使用扩展思考，则无需做任何更改。当你省略 `thinking` 参数时，thinking 默认关闭。

- **优先使用通用指令，而不是规定死板步骤。** 像“深入思考”这样的提示，通常比人工编写的分步计划更能产生高质量推理。Claude 的推理能力往往超过人类能预先规定的步骤。
- **多示例提示可与 thinking 配合使用。** 在 few-shot 示例中使用 `<thinking>` 标签，向 Claude 展示推理模式。它会将这种风格泛化到自己的扩展思考块中。
- **把手动 CoT 作为兜底方案。** 当 thinking 关闭时，你仍然可以通过要求 Claude 逐步思考问题来鼓励链式推理。使用像 `<thinking>` 和 `<answer>` 这样的结构化标签，可以清晰地区分推理过程和最终输出。
- **要求 Claude 自我检查。** 附加类似“在结束前，根据\[测试标准\]验证你的答案。”这样的指令。这能稳定地捕捉错误，尤其适用于编码和数学任务。

> 注意：当扩展思考被禁用时，Claude Opus 4.5 对单词 “think” 及其变体尤其敏感。在这种情况下，可以考虑使用 “consider”“evaluate” 或 “reason through” 等替代表达。

> 信息：关于 thinking 能力的更多信息，请参阅[扩展思考](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)和[自适应思考](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)。

## 代理式系统

### 长周期推理与状态跟踪

Claude 的最新模型在长周期推理任务中表现出色，并具备卓越的状态跟踪能力。Claude 通过关注增量进展，在扩展会话中保持方向感：一次稳步推进少数几件事，而不是试图同时完成所有事情。这种能力在跨多个上下文窗口或多轮任务迭代中尤其明显，Claude 可以处理复杂任务、保存状态，并在新的上下文窗口中继续工作。

#### 上下文感知与多窗口工作流

Claude 4.6 和 Claude 4.5 模型具备[上下文感知](https://platform.claude.com/docs/en/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-6-sonnet-4-5-and-haiku-4-5)能力，使模型能够在整个对话过程中跟踪自己剩余的上下文窗口（即“token 预算”）。这使 Claude 能够通过理解自己还有多少可用空间，更高效地执行任务和管理上下文。

**管理上下文限制：**

如果你是在一个会压缩上下文或允许将上下文保存到外部文件的 agent harness 中使用 Claude（例如 Claude Code），可以考虑将这些信息加入提示词中，以便 Claude 据此调整行为。否则，Claude 有时可能会在接近上下文限制时自然地尝试收尾。下面是一个示例提示词：

```text 示例提示词
当你的上下文窗口接近限制时，系统会自动压缩上下文，使你能够从中断处无限期继续工作。因此，不要因为 token 预算顾虑而提前停止任务。当你接近 token 预算上限时，在上下文窗口刷新之前，将你当前的进度和状态保存到记忆中。始终尽可能保持持续性和自主性，完整完成任务，即使预算即将耗尽也是如此。无论剩余多少上下文，都不要人为提前停止任何任务。
```

[记忆工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)与上下文感知天然契合，能够实现无缝的上下文切换。

#### 多上下文窗口工作流

对于跨多个上下文窗口的任务：

1. **为第一个上下文窗口使用不同的提示词**：在第一个上下文窗口中搭建框架（编写测试、创建初始化脚本），然后在后续上下文窗口中围绕待办清单持续迭代。

2. **让模型以结构化格式编写测试**：要求 Claude 在开始工作前先创建测试，并以结构化格式（例如 `tests.json`）进行跟踪。这有助于长期持续迭代。提醒 Claude 测试的重要性：“删除或修改测试是不可接受的，因为这可能导致功能缺失或引入缺陷。”

3. **设置提升效率的工具**：鼓励 Claude 创建初始化脚本（例如 `init.sh`），以便优雅地启动服务器、运行测试套件和 linter。这样在从新的上下文窗口继续工作时，就能避免重复劳动。

4. **重新开始 vs 压缩上下文**：当上下文窗口被清空时，可以考虑直接从一个全新的上下文窗口开始，而不是使用压缩。Claude 的最新模型非常擅长从本地文件系统中重新发现状态。在某些情况下，你可能会希望利用这一点，而不是依赖压缩。应明确规定它如何开始：
   - “调用 pwd；你只能读取和写入此目录中的文件。”
   - “查看 progress.txt、tests.json 和 git 日志。”
   - “在继续实现新功能之前，手动执行一次基础集成测试。”

5. **提供验证工具**：随着自主任务时长增长，Claude 需要在没有持续人工反馈的情况下验证正确性。像 Playwright MCP server 或用于测试 UI 的 computer use 能力这类工具会很有帮助。

6. **鼓励充分使用上下文**：提示 Claude 在转向下一个部分之前，高效完成当前组件：

```text 示例提示词
这是一个非常长的任务，因此清晰地规划你的工作可能会很有帮助。建议你将整个输出上下文都用来处理该任务——只要确保不要在仍有大量未提交工作时耗尽上下文即可。持续系统化地工作，直到你完成这个任务。
```

#### 状态管理最佳实践

- **对状态数据使用结构化格式**：在跟踪结构化信息（例如测试结果或任务状态）时，使用 JSON 或其他结构化格式，以帮助 Claude 理解 schema 要求
- **对进度说明使用非结构化文本**：自由格式的进度说明非常适合用于记录总体进展和上下文
- **使用 git 进行状态跟踪**：Git 能提供已完成内容的日志和可恢复的检查点。Claude 的最新模型尤其擅长利用 git 在多次会话之间跟踪状态。
- **强调增量式进展**：明确要求 Claude 跟踪自己的进度，并专注于渐进式工作

**示例：状态跟踪**

```json
// 结构化状态文件（tests.json）
{
  "tests": [
    { "id": 1, "name": "authentication_flow", "status": "passing" },
    { "id": 2, "name": "user_management", "status": "failing" },
    { "id": 3, "name": "api_endpoints", "status": "not_started" }
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```text
// 进度说明（progress.txt）
第 3 次会话进展：
- 已修复认证 token 校验
- 已更新用户模型以处理边界情况
- 下一步：调查 user_management 测试失败（测试 #2）
- 注意：不要删除测试，因为这可能导致功能缺失
```


### 平衡自主性与安全性

如果没有额外引导，Claude Opus 4.6 可能会执行一些难以撤销或会影响共享系统的操作，例如删除文件、强制推送，或向外部服务发布内容。如果你希望 Claude Opus 4.6 在执行潜在高风险操作前先进行确认，请在提示词中加入如下引导：

```text 示例提示词
请考虑你的操作是否可逆，以及其潜在影响。鼓励你执行本地、可逆的操作，例如编辑文件或运行测试；但对于那些难以撤销、会影响共享系统或可能具有破坏性的操作，请先征求用户确认再继续。

需要确认的操作示例：
- 破坏性操作：删除文件或分支、删除数据库表、rm -rf
- 难以撤销的操作：git push --force、git reset --hard、修改已发布的提交
- 对他人可见的操作：推送代码、在 PR/issue 下评论、发送消息、修改共享基础设施

遇到障碍时，不要把破坏性操作当作捷径。例如，不要绕过安全检查（如 --no-verify），也不要丢弃那些你不熟悉、但可能是正在进行中的工作文件。
```

### 研究与信息收集

Claude 的最新模型展现出卓越的 agentic 搜索能力，能够有效地从多个来源中查找并综合信息。为了获得最佳研究结果：

1. **提供清晰的成功标准**：定义什么样的结果才算是对你的研究问题的成功回答

2. **鼓励来源验证**：要求 Claude 跨多个来源验证信息

3. **对于复杂的研究任务，使用结构化方法**：

```text 复杂研究的示例提示词
以结构化的方式搜索这些信息。在收集数据时，提出若干相互竞争的假设。在进度说明中跟踪你的置信度水平，以提升校准能力。定期自我批判你的方法和计划。更新假设树或研究笔记文件，以持续保存信息并提供透明度。系统性地拆解这项复杂研究任务。
```

这种结构化方法使 Claude 能够查找并综合几乎任何信息，并且无论语料规模多大，都能对其发现进行迭代式反思和批判。

### 子代理编排

Claude 的最新模型在原生子代理编排能力方面有了显著提升。这些模型能够识别哪些任务适合委派给专门的子代理来处理，并且会在无需明确指示的情况下主动这样做。

为了利用这一行为：

1. **确保子代理工具定义清晰**：提供可用的子代理工具，并在工具定义中说明清楚
2. **让 Claude 自然编排**：Claude 会在无需明确指示的情况下进行适当委派
3. **注意过度使用**：Claude Opus 4.6 对子代理有很强的偏好，可能会在更简单、直接的方法就足够的情况下仍然启动子代理。例如，在直接调用 grep 更快且足够的场景中，模型也可能为了代码探索而启动子代理。

如果你观察到子代理使用过多，可以明确补充说明哪些情况下适合使用子代理，哪些情况下不适合：

```text 子代理使用示例提示词
当任务可以并行执行、需要隔离上下文，或涉及彼此独立且无需共享状态的工作流时，使用子代理。对于简单任务、顺序操作、单文件编辑，或需要在多个步骤间保持上下文的任务，应直接处理而不是委派。
```

### 串联复杂提示

借助自适应思考和子代理编排，Claude 可以在内部处理大多数多步骤推理。显式的提示链（将任务拆分为顺序的 API 调用）在你需要检查中间输出或强制执行特定流水线结构时仍然很有用。

最常见的链式模式是**自我校正**：生成草稿 -> 让 Claude 按照标准审查它 -> 让 Claude 根据审查结果进行完善。每一步都是单独的 API 调用，因此你可以在任意阶段进行记录、评估或分支处理。

### 在代理式编程中减少文件创建

Claude 的最新模型有时会为了测试和迭代而创建新文件，尤其是在处理代码时。这种方式使 Claude 能够使用文件，特别是 Python 脚本，作为在保存最终输出之前的“临时草稿板”。在代理式编程场景中，使用临时文件有时会带来更好的结果。

如果你希望尽量减少实际新增的文件，可以指示 Claude 在结束时自行清理：

```text 示例提示词
如果你为了迭代创建了任何临时新文件、脚本或辅助文件，请在任务结束时删除这些文件。
```

### 过度积极

Claude Opus 4.5 和 Claude Opus 4.6 有时会倾向于过度设计，例如创建额外文件、添加不必要的抽象，或构建并未被要求的灵活性。如果你遇到这种不理想的行为，可以加入明确指示，让解决方案保持最简。

例如：

```text 用于减少过度设计的示例提示词
避免过度设计。只做被直接要求的更改，或那些明显必要的更改。保持解决方案简单且聚焦：

- Scope: 不要添加额外功能、重构代码，或进行超出要求范围的“改进”。修复 bug 不需要顺手清理周边代码。一个简单功能也不需要额外的可配置性。

- Documentation: 不要为你没有修改的代码添加文档字符串、注释或类型注解。只有在逻辑并非一目了然时才添加注释。

- Defensive coding: 不要为不可能发生的场景添加错误处理、回退逻辑或校验。信任内部代码和框架提供的保证。只在系统边界处（用户输入、外部 API）进行校验。

- Abstractions: 不要为一次性操作创建辅助函数、工具函数或抽象层。不要为假设中的未来需求做设计。合适的复杂度，就是完成当前任务所需的最低复杂度。
```

### 避免只盯着通过测试和硬编码

Claude 有时会过于关注让测试通过，而牺牲更通用的解决方案；或者在进行复杂重构时，会通过辅助脚本等变通方式来提高效率，而不是直接使用标准工具。为了避免这种行为，并确保解决方案稳健且可泛化：

```text 示例提示词
请使用现有的标准工具编写高质量、通用的解决方案。不要创建辅助脚本或其他变通方案来更高效地完成任务。请实现一个对所有合法输入都能正确工作的解决方案，而不只是对测试用例有效。不要硬编码值，也不要编写只对特定测试输入生效的方案。相反，请实现能够普遍解决问题的实际逻辑。

重点应放在理解问题需求并实现正确的算法上。测试的作用是验证正确性，而不是定义解决方案。请提供一种遵循最佳实践和软件设计原则的、基于原理的实现。

如果任务本身不合理或不可行，或者某些测试不正确，请直接告知我，而不是绕过它们。解决方案应当是稳健、可维护且可扩展的。
```

### 在代理式编程中尽量减少幻觉

Claude 的最新模型更不容易产生幻觉，并且能基于代码给出更准确、更扎实、更智能的回答。为了进一步鼓励这种行为并尽量减少幻觉：

```text 示例提示词
[investigate_before_answering]
绝不要对你尚未打开查看的代码进行猜测。如果用户提到了某个具体文件，你必须在回答前先读取该文件。在回答有关代码库的问题之前，务必先调查并读取相关文件。除非你非常确定答案正确，否则在调查之前不要对代码作出任何断言——请给出基于事实、无幻觉的回答。
[/investigate_before_answering]
```

## 按能力分类的技巧

### 改进的视觉能力

与之前的 Claude 模型相比，Claude Opus 4.5 和 Claude Opus 4.6 的视觉能力有所增强。它们在图像处理和数据提取任务上表现更好，尤其是在上下文中包含多张图片时。这些提升同样延伸到了 computer use，在该场景下，模型可以更可靠地解读截图和 UI 元素。你也可以通过将视频拆分为帧的方式，使用这些模型来分析视频。

一种被证明能够进一步提升表现的有效技术，是为 Claude 提供裁剪工具或 [skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)。测试表明，当 Claude 能够对图像相关区域进行“放大”时，在图像评估任务上的表现会稳定提升。Anthropic 已经提供了一份关于裁剪工具的 [cookbook](https://platform.claude.com/cookbook/multimodal-crop-tool)。

### 前端设计

Claude Opus 4.5 和 Claude Opus 4.6 在构建复杂、真实世界的 Web 应用以及高质量前端设计方面表现出色。不过，如果没有额外引导，模型往往会回落到通用模式，产出用户所说的“AI slop”美学。为了打造有辨识度、富有创意、让人眼前一亮的前端：

> 提示：关于如何改进前端设计的详细指南，请参阅这篇博客文章：[通过 skills 改进前端设计](https://www.claude.com/blog/improving-frontend-design-through-skills)。

下面是一段你可以使用的系统提示片段，用来鼓励更好的前端设计：

```text 前端美学示例提示词
[frontend_aesthetics]
你倾向于收敛到通用的、“分布内”的输出。在前端设计中，这会形成用户所说的“AI slop”美学。要避免这种情况：请打造富有创意、独特并能带来惊喜的前端。

重点关注：
- Typography: 选择美观、独特、有趣的字体。避免使用 Arial 和 Inter 这类通用字体；改用更有辨识度的选择，以提升前端的审美表现。
- Color & Theme: 坚持统一的美学方向。使用 CSS 变量来保持一致性。具有主导色并辅以鲜明点缀的配色，通常优于保守且平均分布的调色板。可以从 IDE 主题和文化美学中汲取灵感。
- Motion: 使用动画来实现视觉效果和微交互。对于 HTML，优先选择纯 CSS 方案。若使用 React 且条件允许，可使用 Motion 库。把重点放在高影响力的时刻：一次编排得当、带有错峰揭示（animation-delay）的页面加载动画，比零散分布的微交互更能带来愉悦感。
- Backgrounds: 营造氛围和层次感，而不是默认使用纯色背景。叠加 CSS 渐变、使用几何图案，或添加与整体审美相匹配的情境化效果。

避免通用的 AI 生成美学：
- 被过度使用的字体家族（Inter、Roboto、Arial、系统字体）
- 陈词滥调的配色方案（尤其是白底紫色渐变）
- 可预测的布局和组件模式
- 缺乏具体语境个性的模板化设计

请发挥创造性解读，做出令人意外但又真正贴合语境的设计选择。尝试在明亮和暗色主题、不同字体、不同美学风格之间变化。你仍然倾向于在多次生成中收敛到一些常见选择（例如 Space Grotesk）。请避免这样：跳出框架思考至关重要！
[/frontend_aesthetics]
```

你也可以参考[完整的 skill 定义](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)。

## 迁移注意事项

当从更早一代模型迁移到 Claude 4.6 模型时：

1. **明确说明期望行为**：可以考虑准确描述你希望在输出中看到什么。

2. **使用修饰语来组织指令**：添加一些能鼓励 Claude 提高输出质量和细节程度的修饰语，有助于更好地塑造 Claude 的表现。例如，与其说“创建一个分析仪表盘”，不如说“创建一个分析仪表盘。尽可能包含更多相关功能和交互。不要停留在基础层面，而是创建一个功能完整的实现。”

3. **显式请求特定功能**：如果希望包含动画和交互元素，应明确提出要求。

4. **更新 thinking 配置**：Claude 4.6 模型使用[自适应思考](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)（`thinking: {type: "adaptive"}`），而不是使用 `budget_tokens` 的手动 thinking。请使用 [effort 参数](https://platform.claude.com/docs/en/build-with-claude/effort) 来控制思考深度。

5. **迁移离开预填充响应**：从 Claude 4.6 模型开始，最后一个 assistant 回合的预填充响应已被弃用。替代方案的详细说明，请参见[迁移离开预填充响应](#migrating-away-from-prefilled-responses)。

6. **调整 anti-laziness 提示**：如果你之前的提示用于鼓励模型更加详尽，或更积极地使用工具，请适当减弱这类引导。Claude 4.6 模型明显更加主动，可能会对那些旧模型需要的指令触发过度反应。

关于详细迁移步骤，请参阅[迁移指南](https://platform.claude.com/docs/en/about-claude/models/migration-guide)。

### 从 Claude Sonnet 4.5 迁移到 Claude Sonnet 4.6

Claude Sonnet 4.6 默认使用 `high` 级别的 effort，而 Claude Sonnet 4.5 没有 effort 参数。在从 Claude Sonnet 4.5 迁移到 Claude Sonnet 4.6 时，请考虑相应调整 effort 参数。如果未显式设置，你可能会因为默认 effort 级别而遇到更高的延迟。

**推荐的 effort 设置：**
- **Medium**：适用于大多数应用
- **Low**：适用于高吞吐量或对延迟敏感的工作负载
- 在 medium 或 high effort 下，设置较大的最大输出 token 预算（推荐 64k tokens），以便为模型留出足够的思考和行动空间

**何时改用 Opus 4.6：** 对于最困难、时间跨度最长的问题（大规模代码迁移、深度研究、长时间自主工作），Opus 4.6 仍然是正确选择。Sonnet 4.6 则针对那些更重视快速响应和成本效率的工作负载进行了优化。

#### 如果你不使用 extended thinking

如果你在 Claude Sonnet 4.5 中没有使用 extended thinking，那么在 Claude Sonnet 4.6 中也可以继续不使用。你应当显式地将 effort 设置为适合自己使用场景的级别。在禁用 thinking 且使用 `low` effort 的情况下，你可以期待获得与未启用 extended thinking 的 Claude Sonnet 4.5 相当或更好的表现。

```python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=8192,
    thinking={"type": "disabled"},
    output_config={"effort": "low"},
    messages=[{"role": "user", "content": "..."}],
)
```

#### 如果你使用 extended thinking

如果你在 Claude Sonnet 4.5 中使用了 extended thinking，那么在 Claude Sonnet 4.6 中它仍然受支持，并且无需更改 thinking 配置。可以考虑将 thinking 预算维持在 16k tokens 左右。实际中，大多数任务不会用到这么多，但这能为更困难的问题提供余量，同时避免 token 使用失控的风险。

**对于编码类用例**（代理式编程、重工具工作流、代码生成）：

从 `medium` effort 开始。如果你发现延迟过高，可以考虑把 effort 降到 `low`。如果你需要更高智能水平，可以考虑把 effort 提升到 `high`，或者迁移到 Opus 4.6。

```python nocheck
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16384,
    thinking={"type": "enabled", "budget_tokens": 16384},
    output_config={"effort": "medium"},
    messages=[{"role": "user", "content": "..."}],
)
```

**对于聊天和非编码类用例**（聊天、内容生成、搜索、分类）：

从启用 extended thinking 的 `low` effort 开始。如果你需要更深入的推理，再将 effort 提高到 `medium`。

```python nocheck
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=8192,
    thinking={"type": "enabled", "budget_tokens": 16384},
    output_config={"effort": "low"},
    messages=[{"role": "user", "content": "..."}],
)
```

#### 何时尝试 adaptive thinking

上面的 extended thinking 路径使用 `budget_tokens` 来实现可预测的 token 使用量。如果你的工作负载符合以下某一种模式，可以考虑改为尝试[自适应思考](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)：

- **自主多步骤代理：** 能把需求转化为可运行软件的编码代理、数据分析流水线，以及模型能跨多个步骤独立运行的 bug 发现任务。自适应思考让模型能够针对每一步校准推理强度，从而在更长的任务轨迹上保持方向。对于这类工作负载，请从 `high` effort 开始。如果你担心延迟或 token 使用量，可降到 `medium`。
- **Computer use 代理：** Claude Sonnet 4.6 在 computer use 评测中使用 adaptive 模式达到了同类最佳准确率。
- **双峰型工作负载：** 同时包含简单任务和困难任务；adaptive 会在简单查询上跳过思考，而在复杂任务上进行深入推理。

在使用 adaptive thinking 时，请在你的任务上评估 `medium` 和 `high` effort。正确级别取决于你的工作负载在质量、延迟和 token 使用之间的权衡。

```python nocheck
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=64000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}],
)
```
