这是我的项目，要求如下：

### git

1. git 使用 git flow 以及 angular commit 规范，不要使用 superpowers 自带的 git-worktrees。
2. 需要新建一个 using-git-worktrees skill 复写 superpowers 的同名 skill，并在内部将项目的 git 工作流重定向到项目自身的 git-workflow skill。
3. 创建两个分支：main、dev 分支
4. 每次 commit 操作都必须向我确认。
5. commit 携带 co-author 头：下文配置

### CI

1. 如果撰写了测试代码，Github Action 的 workflow 在每次 Tag push 的时候运行项目测试
2. 每次跨平台项目打包到：mac-arm64、linux-arm64、linux-x64、windows-x64 四个平台，根据平台选用压缩包格式，注意静态文件（配置文件、运行时数据库）的打包，每次 Tag push 时执行，并且自动生成 draft release
3. 只对非 markdown 文件进行 CI

### 代码风格

1. 按照开源项目的标准撰写
2. 注释风格
    - 文档注释统一采用 Doxygen 风格, 默认使用 `@brief`, 按需补充 `@param`, `@return`, `@note`, `@warning`
    - 注释与文档字符串中的标点使用半角符号, 且标点后需跟一个空格, 例如 `你好, 世界`
    - 单行注释行尾不加句号, 逗号, 分号, 冒号等收尾标点
3. 项目设计采用高内聚低耦合架构，自行尽量根据类似的最佳实践设计
4. 静态可持久化文件一律存储到程序运行目录，不要写入系统目录，例如（日志、配置数据）等
5. 需要有工业级的日志系统：std 输出以及可持久化日志切片
6. 英文项目：注释使用英文
7. 中文项目：注释使用中文
8. markdown 博客文件不需要遵循注释的规则，遵循下文的文档风格。

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

1. 此项目语言为：中文
2. 此项目是否撰写测试（TDD）：是
3. 此项目是否进行跨平台打包：是
4. 此项目携带的 co-author 头：Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>
5. 特别要求的技术栈：无

### 项目说明

1. 核心博客框架

   - **功能点**：实现长篇文章的纯静态化管理，提升全站响应速度，同时100%保留现有的前端视觉体验。
   - **技术方向**：采用 **Hexo** 静态网站生成器。寻找或直接移植 Hexo 版的 Akina 主题，并将现有的 `typewriterjs` 脚本和自定义 CSS 嵌入新主题的模板层。

2. 短篇动态流（类似 X 的 Post 功能）

   - **功能点**：提供一个无需重新编译全站、支持轻量化碎片记录的信息流瀑布。
   - **技术方向**：在你的个人服务器上通过 Docker 独立部署 **Memos** 服务作为后端。在 Hexo 生成的静态页面中，通过 JavaScript 异步调用 Memos API 进行前端渲染。

3. 多端快捷发布入口

   - **功能点**：摆脱电脑限制，实现手机端即时发送文本和图片的动态。
   - **技术方向**：利用 **Telegram Bot** 接入 Memos API。在 Telegram 对话框发送的内容自动同步至 Memos 数据库，并实时展现在博客前端。

4. 自动化构建与部署 (CI/CD)

   - **功能点**：告别手动上传服务器，实现“本地一键推送，服务器自动更新”，并精准同步 Git 提交时间为文章更新时间。
   - **技术方向**：源码托管至 **GitHub 私有仓库**。编写 **GitHub Actions** 工作流，在触发 Push 时分配云端机器全量拉取代码（保留时间戳）、执行 Hexo 编译，最后通过 SSH/rsync 增量同步到你个人服务器的 Nginx Web 目录下。

5. 隐私控制与草稿管理

   - **功能点**：灵活控制哪些内容公开、哪些内容仅云端备份、哪些内容彻底留在本地。
   - **技术方向**：使用 `.gitignore` 彻底阻断私密文件上传；结合 Hexo 的 `_drafts` 目录或 `skip_render` 配置属性，实现文章在云端的安全存放与隐藏。

6. 静态资源与图床管理

    - **功能点**：长文与短动态的图片资源分离管理，保障加载速度和后期迁移的便利性。
    - **技术方向**：Hexo 长文继续沿用现有的 PicX 工作流（Gitee/GitHub 等外部图床）；Memos 动态配图直接交由 Memos 自带的存储机制（存在个人服务器本地或对接 S3 对象存储）管理。


根据以上要求，在 .opencode 文件夹生成三个 skills： doc-maintainer，git-workflow， code-standard。
如果有疑问，使用 superpowers 的 brainstorming skill 和我确认。
