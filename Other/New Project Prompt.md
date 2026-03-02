# 项目初始化 prompt

```markdown
这是我的项目，要求如下：

### git

1. git 使用 git flow 以及 angular commit 规范，不要使用 superpowers 自带的 git-workflow。
2. 创建两个分支：main、dev 分支
3. 每次commit 操作都必须向我确认。
4. commit 携带 co-author 头：下文配置

### CI

1. 如果撰写了测试代码，Github Action 的 workflow 在每次 Tag push 的时候运行项目测试
2. 每次跨平台项目打包到：mac-arm64、linux-arm64、linux-x64、windows-x64 四个平台，根据平台选用压缩包格式，注意静态文件（配置文件、运行时数据库）的打包，每次 Tag push 时执行，并且自动生成 draft release

### 代码风格

1. 按照开源项目的标准撰写
2. 需要有完整 Doxgen 风格注释
3. 项目设计采用高内聚低耦合架构，自行尽量根据类似的最佳实践设计
4. 静态可持久化文件一律存储到程序运行目录，不要写入系统目录，例如（日志、配置数据）等
5. 需要有工业级的日志系统：std 输出以及可持久化日志切片
6. 英文项目：注释使用英文
7. 中文项目：注释使用中文

### 文档风格

1. 按照开源项目的标准撰写
2. 文档需要区分用户文档以及开发文档
3. 用户文档根需要包含项目介绍、快速开始，跳转到开发文档以及详细部署配置文档的链接
4. 开发文档需要注明代码规范（架构说明以及代码风格）、git 工作流、agent 使用规范（项目 skill 建立在 .opencode/skill） 
5. 英文项目：文档撰写中文 + 英文两份文档，除了根文档都撰写到 docs/ 目录下，例如 docs/zh-cn，docs/en
6. 中文项目：文档使用中文

### Agent

1. 必须使用 LanternCX/superpowers 这个 fork 开发
2. 本项目采用 .opencode 作为 agent 工作目录，如果需要迁移请完整迁移

### 配置项

1. 此项目语言为：英文
2. 此项目是否撰写测试（TDD）：是
3. 此项目是否进行跨平台打包：是
4. 此项目携带的 co-author 头：Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>
5. 特别要求的技术栈：python

### 项目说明

1. 

根据以上要求，在 .opencode 文件夹生成三个 skills： doc-maintainer，git-workflow， code-standard。
如果有疑问，使用 superpowers 的 brainstorming skill 和我确认。
```

