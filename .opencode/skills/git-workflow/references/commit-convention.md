# 提交规范参考

## 硬规则

- 本项目 commit message 必须遵循 angular commit
- 不能只写通用、模糊或自由发挥式 message
- 类型要反映变更意图，而不是文件类型堆砌

## 常用格式

```text
<type>(<scope>): <subject>
```

如果没有合适 scope，可省略 scope：

```text
<type>: <subject>
```

## 常用 type

- `feat`：新增功能
- `fix`：修复缺陷
- `docs`：文档调整
- `refactor`：重构但不改行为
- `test`：测试补充或调整
- `build`：构建系统或依赖调整
- `chore`：杂项维护

## 书写要求

- `subject` 使用简洁短语，直接描述本次变更意图
- 不写空泛标题，如“update files”“misc changes”“final fix”
- 文档提交也仍然属于 angular commit，通常使用 `docs:`，但必须准确描述意图

## 与本项目约束联动

- 拟定 message 后，提交前仍然必须先向用户确认
- 最终提交时必须追加 co-author trailer，见 `references/co-author-policy.md`
