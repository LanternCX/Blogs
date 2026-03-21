# Hexo Sample Mapping

> 样本回归入口: 仅用于验证少量样本映射规则与人工复核信号, 不写入正式 `source/` 站点产物

| 来源路径 | 目标路径 | 内容类型 | categories |
| --- | --- | --- | --- |
| `content/ACM-ICPC/HZCU 2025 Freshman STL.md` | `source/_posts/HZCU 2025 Freshman STL.md` | `post` | `ACM-ICPC` |
| `content/Note/OOP.md` | `source/_posts/OOP.md` | `post` | `Note` |
| `content/Robotic/3DOF-Robotic-Arm.md` | `source/_posts/3DOF-Robotic-Arm.md` | `post` | `Robotic` |
| `content/Pages/about.md` | `source/about/index.md` | `page` | `-` |
| `content/Pages/friends.md` | `source/friends/index.md` | `page` | `-` |

## 人工复核项

- 无

## 手工附录

### 人工复核补充

- 当前文档只记录 5 个抽样文件的映射结果与人工复核信号，不代表正式 `source/` 已被样本命令刷新。
- 样本命令的目标是尽早发现路径映射、标题提取、Git 时间读取等规则回归；正式站点输出以 `npm run migrate:all` 为准。

### 后续建议

1. 继续把 `migrate:samples` 当作低成本回归入口，优先覆盖容易退化的 post/page 映射规则。
2. 需要确认正式输出时，统一执行 `npm run migrate:all`，不要用样本命令判断站点产物是否最新。
3. 样本命令若发现异常，再回到全量报告核对对应文件是否进入 `degraded` 或 `manual_review_unwritten`。

### 最终验证证据

- 执行时间：2026-03-22
- 执行命令：`node --test --test-concurrency=1 test/migration/migrate-samples.test.cjs test/migration/migrate-all.test.cjs && npm run migrate:samples`
- 结果摘要：聚焦 Task 8 边界的 13 个测试通过；`npm run migrate:samples` 成功刷新样本映射文档，且不再写入正式 `source/` 产物。
