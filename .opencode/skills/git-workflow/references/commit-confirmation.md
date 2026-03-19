# 提交确认参考

## 核心规则

每次执行 commit 前都必须先向用户确认。这里的“每次”没有例外，文档改动、小改动、补格式、补测试都一样。

## 确认前必须准备好

- 本次提交的变更范围
- 拟使用的 angular commit message
- 必带的 co-author trailer

## 确认时必须明确说出

- 将要执行的是 commit，而不是泛泛汇报状态
- 拟使用的 commit message
- 会附带 `Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>`

## 不合规示例

- “我顺手帮你提交了”
- “这是小改动，我就直接 commit 了”
- “用户已经让我做这个任务，所以默认同意 commit”

## 合规结果

- 用户明确确认：可以执行 commit
- 用户未确认或只确认了改动方向：仍不能执行 commit
