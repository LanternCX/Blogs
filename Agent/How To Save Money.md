# 怎么省钱：上下文、缓存命中与 Harness

发现一直无脑烧 Token 是无止境的，于是决定拿 OpenCode 为例研究一下上下文结构，以及学习一下缓存命中的有关知识，从 B 端和 C 端两个方面降低成本。

观察 LLM 计费的成本结构，我们注意到成本由三部分构成（以 **deepseek-reasoner** 为例）：

- 输入（2r/1M tokens）
- 输出（3r/1M tokens）
- 缓存读取（0.2r/1M tokens）

做成本优化就是从这三个方面进行优化。

但是由于现在的 LLM 都是通过加强 Reason 强度来换取更高质量的输出，输出 Token 的可优化点不多。

所以本文主要探讨的输入部分：如何构建一个废话很少的上下文以及如何增加缓存命中率。

另：由于之前打一段时间的算法竞赛留下的一些毛病，然后我不喜欢用 AI 写文章，导致文章中的一些表述其实有略微的“题解风”，看起来可能会有点奇怪。

## 上下文结构

尝试了很多办法可视化上下文结构，最后发现其实直接看最终发送的请求内容是最直观的。

### 请求 JSON 的结构

以 opencode 为例，整个结构分为三块：`system`、`messages`、`tools`：

```json
{
  "model": "claude-sonnet-4-6",
  // system 块，属于系统提示词
  "system": [
    "基础 prompt（anthropic.txt 等）\n\n环境信息（工作目录、日期等）\n\n## Available Skills\n- brainstorming: ...\n- debugging: ...\n\nInstructions from: /project/AGENTS.md\n（AGENTS.md 内容）",
    "（Plugin 注入的 System system"
  ],
  // 对话信息
  "messages": [
    // 第一轮：用户消息
    {"role": "user", "content": "历史第 1 轮用户消息"},
    // 第一轮：LLM 回复（较为完整的结构）
    {
      "role": "assistant",
      "content": [
        { "type": "thinking", "thinking": "模型的思考过程文字" },
        { "type": "text", "text": "模型回复的文字" },
        // 一个示例的 tool use
        { "type": "tool_use", "id": "call_1", "name": "skill", "input": { "name": "brainstorming" }},
        // 通过 tool use 得到的返回信息
        { 
          "type": "tool_result", 
          "tool_use_id": "call_1", 
          "content": "<skill_content name=\"brainstorming\">skill 完整内容...</skill_content>"
        }
      ]
    },
    // 第二轮
    {"role": "user", "content": "历史第 2 轮用户消息"},
    {"role": "assistant", "content": [{ "type": "text", "text": "模型回复的文字" }]},
    // 本轮（用户刚发送的，llm 接下来就是需要回复这条消息）
    {"role": "user", "content": "本轮用户消息"}
  ],
  // tools 块
  "tools": [
    // 示例系统工具：read，用来读文件
    { "name": "read", "description": "...", "input_schema": {} },
    // 系统工具：skill，用来读 skill，注意这里的 description 是携带了所有 skill 的 name + description 信息的
    { "name": "skill", "description": "...", "input_schema": {} },
    // 通过安装 MCP Server 得到的额外工具
    { "name": "mcp_tool_xxx", "description": "...", "input_schema": {} }
  ],
  "stream": true
}
```

### System Prompt 的结构

 `system` 块由于是直接拼接的一整个长 `markdown` 的字符串，我们来细看一下：

```markdown
<!-- 第一部分：基础 Prompt，来源 anthropic.txt，根据模型不同替换为对应文件 -->
# Tone and style
# Professional objectivity
# Task Management
# Doing tasks
# Tool usage policy
# Code References

<!-- 第二部分：环境信息，每次动态生成 -->
You are powered by the model named {model_id}. The exact model ID is {provider}/{model_id}
Here is some useful information about the environment you are running in:
<env>
  Working directory: {cwd}
  Workspace root folder: {worktree}
  Is directory a git repo: yes/no
  Platform: darwin/linux/win32
  Today's date: {date}
</env>
<directories>
<!-- 目录树，但是现在已经被 ls 取代了，所以没放 -->
</directories>

<!-- 第三部分：Skills 描述列表，也就是 name + description 的部分 -->
Skills provide specialized instructions and workflows for specific tasks.
Use the skill tool to load a skill when a task matches its description.
<available_skills>
  <skill>
    <name>{skill_name}</name>
    <description>{skill_description}</description>
    <location>file://{skill_path}</location>
  </skill>
</available_skills>

<!-- 第四部分：AGENTS.md，按项目级 -> 全局级逐层顺序加载 -->
<!-- 注意项目子目录的 AGENTS.md 并不包含在内，这一部分的 AGENTS.md 会被拼接到 read 工具的调用结果 -->
Instructions from: {project}/AGENTS.md
{AGENTS.md 完整内容}

Instructions from: ~/.config/opencode/AGENTS.md
{全局 AGENTS.md 完整内容}
```

值得注意的是，Skill 的 `name` 以及 `description` 在上下文中是带了两份的，在 `system` 块以及 `tools` 块中都存在。

```markdown 
<!-- System 块中，详细版 -->
<available_skills>
  <skill>
    <name>{skill_name}</name>
    <description>{skill_description}</description>
    <location>file://{skill_path}</location>
  </skill>
</available_skills>

<!-- Tools 块中，简短版 -->
 ## Available Skills 
 	- **name1**: description1
 	- **name2**: description2
```

关于这一点，opencode 的代码注释中也有提到：`"the agents seem to ingest the information about skills a bit better if we present a more verbose version of them here and a less verbose version in tool description"`

### Subagent 的通信

Subagent 和主 Agent 没有直接通信，它们之间完全通过 tool-call / tool-result 交换信息，就像普通工具调用一样。

主 Agent 调用 `task` 工具传入：

- `prompt`：给 Subagent 的任务描述
- `subagent_type`：用哪个类型的 Agent
- `task_id`：可选，用于恢复之前的 Subagent Session

Subagent 跑完之后，把最后一条 `text` 回复作为 `tool-result` 返回给主 Agent：

```markdown
task_id: xxx
<task_result>
subagent 的最后一条 text
</task_result>
```

也就是说：Subagent 中间的过程（所有工具调用、思考过程等）主 Agent 完全看不到，主 Agent 只收到这个最终结果。

### 自带了什么 Tool

| 工具          | 作用                                     |
| ------------- | ---------------------------------------- |
| `bash`        | 执行 shell 命令                          |
| `read`        | 读取文件内容                             |
| `glob`        | 按文件名模式匹配文件                     |
| `grep`        | 按内容搜索文件                           |
| `edit`        | 替换文件中的指定文本                     |
| `write`       | 整体写入/覆盖文件                        |
| `webfetch`    | 抓取网页内容                             |
| `websearch`   | 搜索网络（仅 opencode 用户或开启 Exa）   |
| `codesearch`  | 代码语义搜索（同上）                     |
| `task`        | 派发 subagent                            |
| `skill`       | 加载 skill 完整内容                      |
| `todowrite`   | 写入/更新 todo 列表                      |
| `question`    | 向用户提问（仅 app/cli/desktop 客户端）  |
| `apply_patch` | 用 patch 格式修改文件（仅部分 GPT 模型） |
| `lsp`         | LSP 查询（实验性，需开启 flag）          |
| `batch`       | 批量并行执行多个工具（实验性）           |
| `invalid`     | 处理模型调用了不存在的工具的情况         |

注意 `edit` 和 `apply_patch` 是互斥的：GPT 系列部分模型用 `apply_patch`，其他模型用 `edit` 和 `write`。

另外 `todoread` Tool 在代码里被注释掉了，目前不可用。

### 发生 Skill 调用时的上下文

以 `superpowers` 的 `brainstorming` 为例

```markdown
<skill_content name="brainstorming">
# Skill: brainstorming
（SKILL.md 的完整内容）
Base directory for this skill: file:///Users/caoxin/.config/opencode/skills/brainstorming/
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.
Note: file list is sampled.
<skill_files>
<file>/.config/opencode/skills/brainstorming/references/foo.md</file>
<file>/.config/opencode/skills/brainstorming/scripts/bar.ts</file>
... （最多 10 个文件，SKILL.md 本身除外）
</skill_files>
</skill_content>
```

也就是说，通过 `skill` 这个 Tool 发生 Skill 调用的时候，会向上下文拼接：

1. SKILL.md 的所有内容
2. Skill 原数据
3. Skill 目录下的所有文件，最多 10 个，SKILL.md 本身跳过不算在内

### 怎么省钱

到此为止上下文里面有啥就整理的差不多了。接下来就可以着手看看怎么省 Token。

最终三块内容通常会按顺序拼接为一个大的字符串：`system + tools + messages`，但是这个是上游做的事情，并不是 Harness 做的。这一部分的拼接顺序涉及到缓存命中，后面再聊。

观察这个结构，不难发现上下文分为两部分：固定 + 动态注入的部分。`system` 块和 `tools` 基本上每次对话都不变，但是 `message` 块变化较大。

我们的目标显然是让大部分信息都是在需要时模型主动获取，也就是拼接进入 `message` 块，这样的设计又被称作**渐进式披露**。

从这样的思想和观察出发，我们能得出一些结论：从 MCP Server 优化 `tools` 块，从 AGETS.md 优化 `system` 块，以及通过设计 Tool Call 的内容优化 `message` 块。

#### MCP

只要是装了 MCP Server，所有 MCP Server 携带的 Tools 的信息都会被全部直接灌入上下文中，而这些 Tools 中的大部分都是利用率很低的。

因此安装非必要的 MCP Server 会导致上下文腐化（Content Rot）以及成本上升。

这一点在 [OpenCode 的文档](https://opencode.ai/docs/zh-cn/mcp-servers/) 中也有提到。

使用工具更正确的做法是使用 Skill + CLI，这也是现在很多软件都开始做自己的 CLI 工具的原因。

### AGENTS.md

之前经常听说指挥 Agent 主动往 AGENTS.md/CLAUDE.md 里面沉淀经验，这根本就是不对的。

显然开发一个 Feat 不需要用到所有经验。对于沉淀经验这种事情应该做一个专门的 Memory 结构。

AGENTS.md 应该只写对模型每次对话的要求，以及不可忽略的约束。

另外需要注意的是：只有项目的根目录

这是我实现的 Memory 系统：[LanternCX/Agent/skill/using-memory](https://github.com/LanternCX/Agent/tree/main/skill/using-memory)，Claude Code 自带也有类似的设计，其实大同小异。

另外这个仓库下也有我的 AGENTS.md：[LanternCX/Agent/rules/AGENTS.md](https://github.com/LanternCX/Agent/blob/main/rules/AGENTS.md)

### Skill

Skill 本身的设计已经很有渐进式披露的思想，但是 Skill 的 `description` 还是常驻上下文的。因此在写 Skill 的 `description` 的时候应该尽量写短。

不过我的实际测试下来，为了保证 Skill 能够被正确触发，往往要向 `description` 中规定明确的边界条件（如果触发太敏感也会污染上下文），也就是设计 `skill` 的时候要做权衡吧，还是很考验能力的。

需要注意的是：发生 Skill 调用的时候，`SKILL.md` 的全文都会被放进上下文中，这个地方也要做渐进式披露。

也就是如果 Skill 有很多内容东西不是每次调用都必要的，那就直接在 `SKILL.md` 里面写路由，让模型按需读取。

具体的设计模式可以参考之前总结的 [Harness 设计模式](https://www.caoxin.xyz/index.php/archives/86/)

### 处理长文件读写

要引导模型使用 `grep` 以及带行数边界限制的 `read`，不要让模型什么都读。

引导模型使用 `edit` 而不是使用 `write` 进行代码的修改。

不过这一点 OpenCode 做的挺好的，只不过在进行 Skill 等 Harness 设计的时候需要注意。

#### Subagent Driven



## 缓存命中优化

关于缓存机制，我建议阅读：[deepseek](https://api-docs.deepseek.com/zh-cn/news/news0802) 以及 [openai](https://developers.openai.com/api/docs/guides/prompt-caching) 有关的说明。其他厂商例如 [claude](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#pricing) 以及 [gemini](https://ai.google.dev/gemini-api/docs/caching?hl=zh-cn) 也有类似的说明，但是因为说明不是很详细，可以按需查看。

对于缓存机制，一般有两种缓存方式：自动缓存和主动缓存。

主动缓存一般需要 Harness 主动在协议中显式声明，我们这边主要关注如何提高自动缓存效率。

### 缓存存了什么？

引用 deepseek 的两张图：

![deepseek_kv_cache_1](https://cdn.deepseek.com/api-docs/kv_cache_example_1.JPEG)

![deepseek_kv_cache_1](https://cdn.deepseek.com/api-docs/kv_cache_example_2.JPEG)

这两张图示意很明确了。简单来说：如果对一个字符串（Prompt）建立缓存，那么缓存池将会缓存这个字符串（Prompt）的所有前缀。

也就是长度为 $ n $ 的字符串有 $ n $  前缀，会产生 $ n $ 个缓存。

举个例子：

1. 对字符串 `abcd` 建立缓存，那么 `a`，`ab`，`abc`，`abcd` 都会进入缓存池。

2. 缓存建立之后，如果发送了 `abce`，`abcf` 等等字符串，都会命中字符串 `abc` 的缓存。

### 缓存是怎么维护的？

缓存生命周期核心在于两个部分：**建立**与**清除**

这个问题很复杂，主要跟厂商的策略有关，涉及这几个因素：最小触发长度、存活时间、物理容量、缓存建立策略、路由策略、缓存淘汰策略。

了解缓存的建立与清除策略后，我们就可以针对缓存策略构造出不同场景下的缓存失效的策略，最终指导我们优化缓存。

大部分厂商为了负载均衡以及算力优化，在缓存建立上的策略都是大差不差的。

而通过对上文提到的几个因素的取舍（物理容量、产品设计等），市面上有两种现行的缓存淘汰策略：LRU 机制以及 TTL 机制。

对于这两种策略，造成缓存失效的构造方案不尽相同，因此为了提高缓存命中率，我们需要对缓存策略进行分类讨论。

另外：当前各个大厂的 KV Cache 设计都不太相同，基本上每家都有每家的策略，在此为了减少工作量，我会尽量围绕 [vLLM](https://github.com/vllm-project/vllm) 这一较为流行的开源实现，以及 [openai](https://developers.openai.com/api/docs/guides/prompt-caching) 这一篇有关 Prompt Cache 的详细介绍，并且在这二者的基础上进行说明以及补充。

#### 缓存的建立

参考 vLLM，可以发现 vLLM 在单节点上对 KV Cache 进行了非常系统的内存布局、缓存策略优化。

而为了满足多节点集群的全局负载均衡，又会在一条 Prompt 进入节点进行实际运算之前加一个 Router，通过一些哈希或者树上的维护，将 Prompt 路由到缓存命中率尽量高的计算节点。

总而言之：一条 Prompt 从被端接收到进行计算，会经过下面的链路：`Client -> API Gateway -> Router -> Workers(vLLm)`

在 openai 的实现中，Router 会将前 256 个 token 算一个哈希，然后根据这个哈希路由到对应的节点。

路由到对应的节点后，vLLM 会通过维护一个基数树，对 Cache 和新的 Prompt 做前缀匹配，最后使用缓存。

而对于 Prompt 中没有 Hit Cache 的部分，会在新的计算之后更新到维护的基数树。

#### 基于 LRU 机制的缓存清除

LRU（Least Recently Used）是一种基于**访问热度**的缓存清除策略。

这个词对一些有计算机背景的朋友应该并不陌生，Redis 以及计组中的缓存淘汰都存在 LRU 机制。

我们注意到：如果数据最近被访问过，那么它在未来被访问的概率就更高。

因此 LRU 机制就设计了：当空间不足时，优先淘汰最久没有被访问的数据。

在 vLLM 中就实现了经典的 LRU 缓存淘汰机制，通过记录缓存的被访问时间。

知道了 LRU 机制的缓存淘汰策略，我们就可以着手构造缓存失效的情况：

在访问高峰期时，Prompt 的吞吐量较大，由于 LRU 机制的存在，新的 Prompt 就会频繁淘汰旧的 Prompt，发生缓存竞争。

这种情况下就会导致缓存命中率下降。

#### 基于 TTL 机制的缓存清除

TTL （Time To Live）是一种基于**时间**的缓存清除策略。

它的核心在于：对每个缓存维护一个租约，在缓存过期之后就丢弃这个缓存。

以 [Claude 的缓存机制](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)为例，不论是自动还是手动缓存，都有两档不同时间长度的计费标准。

在缓存租约的时间内，完全不用担心是否在高峰期发生缓存竞争而导致缓存命中率下降。

当然 TTL 机制是有缺点的。对于服务端来说，内存占用并不总是最优的，而对于用户来说，使用 TTL 往往需要支付额外的缓存租金。

#### 补充

1. 大部分厂商其实都支持两种缓存清除方式：自动的基于 LRU 机制维护和手动声明缓存保留并使用 TTL 机制维护。例如 openai 在文档中就支持手动的提示词保留：[OpenAI API | Prompt cache retention](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-retention)
2. 其实现在缓存结构大部分都不只是在显存中维护这么简单。实际上大部分厂家都维护了很多层的缓存结构。例如 Kimi 在 [Mooncake](https://github.com/kvcache-ai/Mooncake) 中就实现了一套三层缓存（显存、内存、硬盘）机制，而 Deepseek 也在 2024 年就上线了[基于硬盘的缓存机制](https://api-docs.deepseek.com/zh-cn/news/news0802)。
3. 尽管 Router + Workers 的架构是主流，但是实际上一些厂商为了保证用户的隐私，会对每个用户维护一个单独的缓存。虽然不能做到全局负载均衡，但是能够维护用户隐私。（因为实际上在共享缓存架构中可以通过构造特定的串，然后通过发送 Prompt 查询缓存命中情况把别人的 Prompt 一点点猜出来）
4. 缓存的建立与维护还涉及了很多有意思的算法和设计，比如：如何在 LRU 机制中嵌入 TTL 机制使得两套机制可以并存、如何在基数树上进行缓存的维护、vLLM 的 PageAttention、SGLang 的 RadixAttention 等等，但是由于本文主要讨论的是成本控制方面的问题，这些实现细节关系不大，因此不做深入讨论。

### 怎么省钱

一个显而易见的结论是：尽量保证每轮对话都有尽可能长的公共前缀。如何做到这一点呢？我们就要回到上文提到的上下文结构中去。

在此之前，我们需要重点看的是最终的 Prompt 最后是如何拼接的：`system + tools + messages`。

注意到 `messages` 块并不会被外部因素改变，只会从上向下生长，因此我们的目标就变成了尽量保证 `system` 块和 `tools` 块不变。

#### AGENTS.md

在这里我们要做一个明确的区分：哪些 `AGENTS.md` 会被放进 `system` 块？

回看 `system` 块的结构：

```markdown
<!-- 第四部分：AGENTS.md，按项目级 -> 全局级逐层顺序加载 -->
<!-- 注意项目子目录的 AGENTS.md 并不包含在内，这一部分的 AGENTS.md 会被拼接到 read 工具的调用结果 -->
Instructions from: {project}/AGENTS.md
{AGENTS.md 完整内容}

Instructions from: ~/.config/opencode/AGENTS.md
{全局 AGENTS.md 完整内容}
```

那么结论就显而易见了：不要在 Agent 工作的长上下文中让 Agent 自动修改（或者自行手动修改）项目级、系统级的 `AGENTS.md`。由于项目级和系统级的 `AGENTS.md` 在上下文中被放在了很前的位置，频繁修改这些位置的 `AGENTS.md` 会导致显著的缓存命中率下降。

而修改文件夹级的 `AGENTS.md` 则没有这样的顾虑：这些位置的 `AGETNS.md` 永远是动态注入的，不需要担心修改会造成缓存重建。

#### 携带 `prompt_cache_key`

在前文中我们提到了，OpenAI 会将每条 Prompt 的前 256 个 Token 算一个哈希，然后根据这个哈希路由到对应的节点进行计算。

而缓存几乎完全是以节点为单位维护的。

设想这样一个场景：你正在并行跑两个项目，他们用的是同样的 Harness，但是 session 内的内容完全不同，也就是上下文中 `system` 和 `tools` 块几乎一致，但是 `message` 块完全不同。

在 OpenAI 这样的策略下就会出现一个问题：这两个任务的前 256 个 Token 完全相同，导致基于这 256 个 Token 计算的哈希，以及最后进行的路由完全一致。

但是这两个任务除了前面 `system` 以及 `tools` 块差不多以外，正式的 `message` 内容没有任何相同的。在 OpenAI 的缓存策略下，大部分时候就只能命中前面重复的 `system` 块。而后面的 `message` 块会因为上下文内容的不断切换，无法相互命中。

于是剧烈的缓存竞争就发生了。这显然不是我们愿意看到的。

很容易想到的一个做法是：向 `system` 块的开头注入一个唯一的基于项目的 ID，但是这样在 Agent 层面上实现起来似乎是较为困难的，因为 `system` 块的开头往往是 Agent 自己的 System Prompt。

好在 OpenAI 添加了一个参数：`prompt_cache_key`。这个值就纯粹影响你的 Prompt 路由的哈希，不影响正式的 `system` 块。

在 OpenCode 中，可以很简单的配置：

```json
"options": {
    "setCacheKey": true
}
```

很多的并发任务场景下，就这样的一个配置能够带来非常巨量的缓存命中率提升，从而大大降低成本。

### 基于 TTL 机制手动配置缓存

以 Claude 的政策为例。
