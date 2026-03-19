# co-author 规则参考

## 硬规则

每次 commit message 都必须附带以下 trailer：

```text
Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>
```

## 使用要求

- 这是每次 commit 的必带项，不因提交类型不同而省略
- trailer 追加在 commit message 末尾，保持标准 Git trailer 形式
- 与 angular commit 同时满足；co-author 不是替代标题格式的补丁

## 最小结构

```text
feat(scope): subject

Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>
```
