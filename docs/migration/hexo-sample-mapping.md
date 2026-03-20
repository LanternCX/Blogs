# Hexo Sample Mapping

| 来源路径 | 目标路径 | 内容类型 | categories |
| --- | --- | --- | --- |
| `ACM-ICPC/HZCU 2025 Freshman STL.md` | `source/_posts/HZCU 2025 Freshman STL.md` | `post` | `ACM-ICPC` |
| `Note/OOP.md` | `source/_posts/OOP.md` | `post` | `Note` |
| `Robotic/3DOF-Robotic-Arm.md` | `source/_posts/3DOF-Robotic-Arm.md` | `post` | `Robotic` |
| `Pages/about.md` | `source/about/index.md` | `page` | `-` |
| `Pages/friends.md` | `source/friends/index.md` | `page` | `-` |

## 人工复核项

- 无

## 手工附录

### 人工复核补充

- 当前 5 个抽样文件已成功生成 Hexo 目标文件，未出现阻断样本迁移的标题缺失或 Git 时间缺失问题。
- 全量迁移前仍需人工处理以下文件，否则会继续落入人工复核列表：
  - `Pages/about.md`：正文没有一级标题，需补一个稳定标题或在迁移规则中为页面提供单独标题来源。
  - `Other/xysu-live.md`：当前首个标题是二级标题 `##`，需确认是否补成一级标题。
  - `Photography/2024-10-05.md`：仅有下载链接与图片，缺少可提取的一级标题。
  - `Photography/2025-01-29.md`：仅有下载链接与图片，缺少可提取的一级标题。
  - `Robotic/3DOF-Robotic-Arm.md`：标题写成列表项 `- # ...`，需要清洗为正常 Markdown 标题。
  - `Agent/Vibecoding.md`：当前仓库中无法提取 Git author date，需要补齐时间来源或为无历史文件定义兜底策略。
  - `ACM-ICPC/README.md`：仅为目录说明，没有可提取标题，需在全量迁移前明确该类 README 是排除还是单独映射。

### 后续建议

1. 先修正标题来源不稳定的文件，再启动全量迁移，至少覆盖“无一级标题”“错误标题格式”“目录 README 是否纳入迁移”三类问题。
2. 先决定无 Git 历史文件的时间策略：补录手工时间、允许缺省发布日期，或新增独立元数据清单，避免全量迁移时产生不一致 front matter。
3. 在全量迁移前追加一轮仓库扫描，把所有 Markdown 预先按“post / page / ignore / manual review”分类，减少迁移脚本运行后的人工返工。
4. 全量迁移完成后，按页面、文章、图片外链和分类归档各抽样复核一轮，确认 Hexo 渲染结果与原内容一致。

### 最终验证证据

- 执行时间：2026-03-20
- 执行命令：`npm test && npm run migrate:samples && npm run hexo:clean && npm run hexo:generate`
- 结果摘要：`npm test` 24/24 通过；`npm run migrate:samples` 成功迁移 5 个样本并重写映射文档；`npm run hexo:clean` 成功清理数据库与 `public/`；`npm run hexo:generate` 成功生成 12 个文件。
