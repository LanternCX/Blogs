# Caoxin Blog

基于 Hexo 的个人博客站点，用于整理技术文章、项目记录与个人内容。

## 快速开始

1. 运行前提：本地已安装 Node.js 与 npm
2. 安装依赖：`npm install`
3. 运行测试：`npm test`
4. 刷新 Git 时间元数据：`node scripts/migration/collect-git-meta.cjs`
5. 执行全量迁移：`npm run migrate:all`
6. 样本回归验证：`npm run migrate:samples`（只刷新 `docs/migration/hexo-sample-mapping.md`）
7. 清理旧的 Hexo 产物：`npm run hexo:clean`
8. 生成静态文件：`npm run hexo:generate`
9. 本地预览站点：`npm run hexo:serve`

推荐的首次验收顺序如下：

```bash
npm install
npm test
node scripts/migration/collect-git-meta.cjs
npm run migrate:all
npm run migrate:samples
npm run hexo:generate
npm run hexo:serve
```

## 迁移目录职责

- `content/`：迁移后的博客内容源目录，只保留迁移流程需要扫描的 Markdown 与其相邻资源
- `source/`：Hexo 直接消费的最终输出目录，`migrate:all` 每次会重建自己托管的文章与页面结果
- `.migration/`：迁移流程的中间状态目录，保存 README 白名单、Git 时间元数据、页面托管清单等可重复执行所需状态
- `docs/migration/`：迁移过程生成的报告与样本映射文档目录，`migrate:samples` 只刷新样本回归说明，不参与全量站点输出

## `migrate:all` 使用顺序

1. 先确认 `content/` 已准备完成，且 `node scripts/migration/collect-git-meta.cjs` 已刷新 `.migration/git-meta.json`
2. 运行 `npm run migrate:all` 生成 `source/`、`.migration/pages-manifest.json` 与 `docs/migration/hexo-full-migration-report.md`
3. 如需做样本回归，再运行 `npm run migrate:samples`，该命令只抽样验证映射规则与人工复核信号，不写入正式 `source/` 产物
4. 最后执行 `npm run hexo:clean && npm run hexo:generate` 验证 Hexo 输出

## 文档入口

- 基础设计：[`docs/superpowers/specs/2026-03-20-hexo-foundation-design.md`](docs/superpowers/specs/2026-03-20-hexo-foundation-design.md)
- 全量迁移设计：[`docs/superpowers/specs/2026-03-21-hexo-full-migration-design.md`](docs/superpowers/specs/2026-03-21-hexo-full-migration-design.md)
- 实施计划：[`docs/superpowers/plans/2026-03-21-hexo-full-migration.md`](docs/superpowers/plans/2026-03-21-hexo-full-migration.md)
- 部署文档：[`README.md#部署文档待补充`](#部署文档待补充)

## 部署文档待补充

部署流程将在后续任务中补齐。
