# MacOS 下 git 全局 ignore .DS_Store

`.DS_Strore` 文件是 **MacOS** 自动生成的 **Desktop Services Store** 文件，用于存储文件夹的显示设置

但是 `git` 不会自动忽略这个文件，导致我们很多时候 `git add .` 不太方便，每个项目单独 `ignore` 又太麻烦

于是我们使用全局 `ignore` 一劳永逸：

```bash
# 配置全局 gitignore
git config --global core.excludesfile ~/.gitignore_global
# 写入忽略项
vim ~/.gitignore_global
```

在 `.gitignore_global` 写入：

```bash
.DS_Store
```

就好了。

也可以使用脚本自动配置

```bash
#!/bin/bash

# 全局 gitignore 文件路径
GLOBAL_GITIGNORE="$HOME/.gitignore_global"

# 如果文件不存在就创建
if [ ! -f "$GLOBAL_GITIGNORE" ]; then
    touch "$GLOBAL_GITIGNORE"
    echo "Created $GLOBAL_GITIGNORE"
fi

# 检查是否已有 .DS_Store 规则
if ! grep -qx ".DS_Store" "$GLOBAL_GITIGNORE"; then
    echo ".DS_Store" >> "$GLOBAL_GITIGNORE"
    echo "Added .DS_Store to $GLOBAL_GITIGNORE"
else
    echo ".DS_Store already in $GLOBAL_GITIGNORE"
fi

# 配置 git 使用全局 gitignore
git config --global core.excludesfile "$GLOBAL_GITIGNORE"

echo "Git global ignore configured!"

```

保存为 `setup_gitignore.sh` 之后

```bash
chmod +x setup_gitignore.sh
```

然后执行就好了

```bash
./setup_gitignore.sh
```

