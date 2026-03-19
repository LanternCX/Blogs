# 更新既有文档

更新前先判断这是用户文档还是开发文档，再按对应约束补齐缺口，而不是只改局部文字。

## 更新步骤

1. 用 `guides/choose-doc-type.md` 判断文档类型
2. 检查现有结构是否符合 `references/doc-layout.md`
3. 检查语气、标题与链接是否符合 `references/doc-style.md`
4. 检查语言是否符合 `references/language-policy.md`
5. 如果是用户文档，回到 `guides/add-user-doc.md` 核对必备入口与禁止事项
6. 如果是开发文档，回到 `guides/add-dev-doc.md` 核对必备覆盖与禁止事项
7. 用 `checklists/doc-change-checklist.md` 完成最终自检

## 补洞原则

- 优先补齐硬性缺项，再优化表述
- 优先补入口链接，再补扩展说明
- 已有规则能通过链接复用时，不重复发明一套说法

## 特别提醒

- 涉及 git 规则变更或说明时，明确导航到 `git-workflow`
- 涉及代码规范说明时，明确导航到 `code-standard`
- 本项目文档默认中文，更新时不要无故引入英文主内容
