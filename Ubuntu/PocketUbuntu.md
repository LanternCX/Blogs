# Pocket Ubuntu: Ubuntu 22.04 即插即用双系统折腾笔记

由于一些开发上的需求，经过了我一番不懈的折腾后，成功用尽量小的配置成本完成了一个美观且高可用的、安装于移动硬盘上的即插即用`Ubuntu 22.04`系统。

这篇博客就当是我的一个折腾备忘录

## Hardware

- 系统盘： 闲鱼淘来的二手`128G SSD`拆机盘

- 硬盘盒： 绿联

- 数据线：`USB 3.0 A to C `or `USB 3.0 C to C`

## System Install

主要参考这篇[知乎：Ubuntu系统安装在移动固态硬盘，实现在不同电脑即插即用](https://zhuanlan.zhihu.com/p/618018275)，做好引导盘然后 Boot 到引导盘装系统就好

比较重要的是在 DiskGenius 记得先把移动硬盘的**分区表转换为GUID模式**。

然后正常分区就好，想用 DiskGenius 或者后面进启动盘之后再装也可以，但是要**保证硬盘最开始的分区是ESP分区**不然会认不到引导

## Boot Repair

同样也是参考[知乎：Ubuntu系统安装在移动固态硬盘，实现在不同电脑即插即用](https://zhuanlan.zhihu.com/p/618018275)以及[Ubuntu Community: Boot Repair](https://help.ubuntu.com/community/Boot-Repair)

如果你的主机之前已经安装过Windows系统，Ubuntu 安装的时候有会把引导装到 Windows 的盘上（应该是索引值第一块的磁盘）。这会导致安装 Ubuntu 的盘没有引导无法做到即插即用，而且拔掉盘之后直接启动会卡 Grub 命令行。

### Install

```bash
sudo apt-add-repository ppa:yannubuntu/boot-repair
sudo apt update
sudo apt install boot-repair
```

### Repair

这一步有可能会失败，建议多跑几次

```bash
sudo boot-repair
```

### Update Grub

上面那篇知乎专栏没有提到的是，在 Boot Repair 之后有可能导致 Grub 丢失原来 Windows 的引导，需要对 Grub 进行更新

```bash
sudo update-grub
```

到此为止系统就算安装完毕，实现了如果插上移动硬盘电脑启动之后进入 Grub 选择系统，没有插上移动硬盘电脑电脑启动直接进入 Windows

## Keyboard

参考[知乎：在Ubuntu 20.04中安装中文输入法](https://zhuanlan.zhihu.com/p/529892064)

在`Settings -> Region&Language -> Manage Install Languages`安装完整语言包

然后安装 **Fcitx**

```bash
sudo apt-get update
sudo apt-get install fcitx-bin
# 查看 fcitx 版本
fcitx --version
```

## Network

### Clash Verge Rev

在 [Github Release](https://github.com/clash-verge-rev/clash-verge-rev/releases) 下载安装就好

建议在邮箱或者网盘之类的备一份，订阅也备一份，裸连 Github 太慢了

## Beautify

Ubuntu 确实有很多美化方案，但是我不太想在美化上浪费太多配置成本，可以参考[Bilibili：【演示】Ubuntu 24.04 最新稳定版美化&配置](www.bilibili.com/video/BV1br421K7ui/)的方案

### Grub

使用 [vinceliuice/grub2-themes](https://github.com/vinceliuice/grub2-themes) 的 WhiteSur 主题

下载仓库

```bash
git clone https://github.com/vinceliuice/grub2-themes.git
```

运行 `install.sh` 之后安装就好

```bash
cd grub2-themes
sudo bash install.sh
```

### System

深色主题：`Settings -> Appearance -> Style -> Dark`

Dock 自动隐藏：`Settings -> Appearance -> Dock -> Auto-hide the dock: on`

Dock 显示在屏幕下方： `Settings -> Appearance -> Dock -> Position on screen: Bottom`

Dock 行为：`Settings -> Appearance -> Dock -> Config dock behavior: All off`

关闭面板模式：`Settings -> Appearance -> Dock -> Panel mode: off`

这样就能低成本获得一个相对干净且优雅的系统环境了

## Browser

推荐`Firefox`。但是由于`Firefox`不支持垂直标签页，因此我选用`Firefox Nightly`，有垂直标签页的实验性功能

安装参考这篇文章：[Mozilla Makes Firefox Nightly Easier to Install on Ubuntu](https://www.omgubuntu.co.uk/2023/10/firefox-nightly-deb-packages-mozilla-apt-repostiory)，通过配置 Moziilla APT Repository 安装

导入 Mozilla 仓库 Key

```bash
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/packages.mozilla.org.gpg > /dev/null
```

添加仓库

```bash
echo "deb [signed-by=/etc/apt/trusted.gpg.d/packages.mozilla.org.gpg] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null
```

安装

```bash
sudo apt-get update && sudo apt-get install firefox-nightly
```

### Extensions

- [Gesturefy](https://github.com/Robbendebiene/Gesturefy) - 在浏览器使用右键手势

## Music

非常好用的网易云第三方播放器：[YesPlayMusic](https://github.com/qier222/YesPlayMusic)

## Markdown

### Typora

根据官方提供的下载

```bash
# or run:
# sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys BA300B7755AFCFAE

wget -qO - https://typora.io/linux/public-key.asc | sudo tee /etc/apt/trusted.gpg.d/typora.asc

# add Typora's repository

sudo add-apt-repository 'deb https://typora.io/linux ./'

sudo apt update

# install typora

sudo apt install typora
```

或者有时候官方仓库抽风了可以直接`wget`下载`deb`包

然后在[Typora - Find My License](https://store.typora.io/my)拿 Token

## Develop

### VSCode

```bash
sudo snap install code --classic
```

插件配置以及 Code Snippets 配置已上传：[Github](https://github.com/LanternCX/Competitive-Programing/tree/main/VS%20Code%20Config)

### PyCharm(pro)

```bash
sudo snap install pycharm-professional --classic
```

### clang

```bash
sudo apt-get install clang
```

参考官方文档：[Clangd: Getting started](https://clangd.llvm.org/installation)

```bash
sudo apt-get install clangd-12
sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-12 100
```

修复无法识别 C++ 标准库头文件的问题：[Linux 下 clang 找不到标准库头文件](http://www.man6.org/blog/Linux/Linux%E4%B8%8Bclang%E6%89%BE%E4%B8%8D%E5%88%B0%E6%A0%87%E5%87%86%E5%BA%93%E5%A4%B4%E6%96%87%E4%BB%B6.md)

```bash
sudo apt install libstdc++-12-dev
```

### Environment

```bash
sudo apt install cmake qtcreator
sudo apt install vim neovim git
```

### Git

配置认证自动存储

```bash
git config --global credential.helper store
```

然后开一个 [Github personal-access-tokens](https://github.com/settings/personal-access-tokens)，开放 `All repositories` 的 `Contents`权限，在`push`的时候填上用户名，密码填`Toekn`就好

设置 Git 用户邮箱和用户名

```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```



## Chat

微信和 QQ 都有官方 Linux 版本直接 Google 就好