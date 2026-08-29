---
permalink: debug-sleflearning-2026
title: 2026 年 Debug 实验室软件组自学指南
pubDate: 2026-08-29
---

# 2026 年 Debug 实验室软件组自学指南

[‌​​​⁠﻿⁠​‍‬‬​‍‍‌‬‍﻿​​‍​‬​‬​﻿​​​﻿​‍​⁠​​​​‍⁠﻿​⁠飞书云文档](https://hzcu-debug.feishu.cn/wiki/Fk3swHkQaipHiXkgtlCcjkF0ndc)

直接看课程视频可能更适合刚从高中毕业的同学的学习习惯，也就是“听课学习”。

但是我更推荐的是直接借助 AI 以及在线文档，直接通过阅读学习。这更接近于高中常说的“看课本自学”。

Anyway，每个人都有适合自己的学习方法。在这里推荐一些资料，方便大家自行选择学习。

下面的学习资料很多也很杂，在有限的时间内肯定无法全部学完，即使是我们也无法做到全都烂熟于心。

如你所见，我们希望你能培养“搜索、判断、筛选和处理信息的能力”，因此选择合适的信息源以及选择合适的学习方式也是自学中很重要的一环。

## 通用的学习资料

计算机自学指南：https://csdiy.wiki/

菜鸟教程：https://www.runoob.com/

Deepseek：https://www.deepseek.com/

ChatGPT（国外）：https://chatgpt.com/

Codex（国外）：https://chatgpt.com/codex/

## C 语言

浙江大学 程序设计入门——C语言

- MOOC https://www.icourse163.org/course/ZJU-199001
    
- B 站 https://www.bilibili.com/video/BV1dr4y1n7vA/
    

菜鸟教程 https://www.runoob.com/cprogramming/c-tutorial.html

洛谷：https://www.luogu.com.cn/

推荐使用洛谷官方入门题单，按知识点顺序练习：

- [【入门1】顺序结构](https://www.luogu.com.cn/training/100?utm_source=chatgpt.com)
    
- [【入门2】分支结构](https://www.luogu.com.cn/training/101?utm_source=chatgpt.com)
    
- [【入门3】循环结构](https://www.luogu.com.cn/training/102?utm_source=chatgpt.com)
    
- [【入门4】数组](https://www.luogu.com.cn/training/103?utm_source=chatgpt.com)
    
- [【入门5】字符串](https://www.luogu.com.cn/training/104?utm_source=chatgpt.com)
    
- [【入门6】函数与结构体](https://www.luogu.com.cn/training/105?utm_source=chatgpt.com)
    

但是这一份重心其实偏算法竞赛多一点，不过作为语法入门还是比较合适的，刷点算法题也能锻炼大家思维能力，以后工作面试其实也有可能考算法题。

C语言至少要学到指针。

## Git & GitHub

**AI 编程的时代，Git 是非常重要的。我们后面考核提交代码也要求有详细的 Git Commit 记录。**

Git 下载：https://git-scm.com/

GitHub：https://github.com/

GitHub 国内访问较慢，需要使用 Steam++ 工具访问，或者通过一些 GitHub 镜像站：https://steampp.net/

上面提到的计算机自学指南中的教程：

- Git：https://csdiy.wiki/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/Git/
    
- Github：https://csdiy.wiki/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/GitHub/
    

Git 官方教程，我认为写的非常不错：https://git-scm.com/book/zh/v2

GitHub 官方教程，我也认为写的非常不错：https://docs.github.com/zh/get-started/using-github/hello-world

B 站教程有很多，我只看过下面这两个，实际上随便找一个看完用一用就会了：

- 【研1基本功 别人不教的，那就我来】SSH+Git+Gitee+Vscode 学会了就是代码管理大师https://www.bilibili.com/video/BV1Fw4m1C7Tq
    
- 【狂神说Java】Git最新教程通俗易懂 https://www.bilibili.com/video/BV1FE411P7B3
    

这一部分重点学习 Git 基本概念（commit、push、pull、clone）、分支管理、Commit 规范、Git Stash、Github PR / Issue 等等即可

如果你实在访问不了 Github，你可以使用 Gitee，简单理解为国内版的 Github。

代码编辑器建议使用 VS Code：https://code.visualstudio.com/

当然我也推荐 Zed：https://zed.dev/

## AI 辅助编程

**一定要学会使用 AI 工具！**

Deepseek：https://www.deepseek.com/

Deepseek Harness：https://www.deepseek.com/harness/

Opencode：https://opencode.ai/

ChatGPT（国外）：https://chatgpt.com/

Codex（国外）：https://chatgpt.com/codex/

我比较推荐使用 Codex，但是由于众所周知的原因，我们上课会基于字节的 Trae 授课：https://www.trae.ai/

AI 工具上手是很简单的。但是我们希望你不只是一个只会写提示词的小白。对于这一部分，我们还希望你能掌握：

1. 学习 LLM（大语言模型）的工作原理，可以看 B 站 3b1b 的视频 【官方双语】GPT是什么？直观解释Transformer：https://www.bilibili.com/video/BV13z421U7cs
    
2. 明白 Skill / Harness / 上下文窗口 / Tool Calling 等等基本概念，学习 Agent 的工作原理，推荐阅读 Tw93 的博客《你不知道的 Agent：原理、架构与工程实践》：https://tw93.fun/2026-03-21/agent.html
    

学习了这些，AI 编程工具对你而言就不会再是一个“说一句话许愿，然后等待结果”的黑盒。

## 嵌入式

> 嵌入式板块我们在课上讲的是STM32，而STM32有三种开发方式，分别为寄存器开发、标准库开发和hal开发。标准库更接近底层硬件，配置过程会复杂一些，而hal库则更加抽象一些，通常配合STM32CubeMX自动生成初始化代码，开发更简单，可读性更好。
> 
> **培训和考核以 STM32** **HAL** **库****开发为主**。但是，下面的介绍是按照部分嵌入式学习路线来的，包括51单片机，STM32单片机的标准库和Hal库。如果大家要应对考核提前学习只需要看Hal库的视频就行。

### 51单片机

【51单片机入门教程-2020版 程序全程纯手打 从零开始入门】 https://www.bilibili.com/video/BV1Mb411e7re

（51 单片机开发时通常更偏向底层操作，现在也有很多人选择跳过 51，直接从 STM32 开始学习。信电学院的大二课程里也会有一门专门的课程教51单片机。而且从比赛角度我们基本不会使用51单片机。51单片机优先级更低）

### STM32标准库

【STM32入门教程-2023版 细致讲解 中文字幕】 https://www.bilibili.com/video/BV1th411z7sn

（江科大的这个视频讲的很细，非常适合小白入门学习，但是时长比较长。）

【铁头山羊stm32 入门教程【新版】】 https://www.bilibili.com/video/BV11X4y1j7si

【｛宇｝0基础最快速学会STM32单片机编程与硬件知识 宇的课#6】 https://www.bilibili.com/video/BV11C411h79W

（比较小众，但很好理解，时长也短）

### STM32hal库

【[STM32 HAL库]课程介绍，最佳教程，没有之一~】 https://www.bilibili.com/video/BV16J4m1w7HB

（铁头山羊的hal库视频给到夯）

【【全53集教程】STM32U575单片机从入门到项目实战（1）基于HAL库的STM32U5开发。嵌入式系统中级认证/嵌入式大赛推荐课程】 https://www.bilibili.com/video/BV1z34y1T77J

（比较全面,可拓展性也强，适合长期学习，还不会像正点原子那样修改Hal库）

### 推荐的UP主

_（以下三个：适合入门学习，比较容易理解，有一定基础可以跳着看）_

【江协科技的个人空间-哔哩哔哩】 https://b23.tv/qWC3nVR

【铁头山羊的个人空间-哔哩哔哩】 https://b23.tv/b7NCQ7m

【小轩的电子世界的个人空间-哔哩哔哩】 https://b23.tv/UxtXAVI

  

_（以下三个：讲的比较综合，每个视频比较独立）_

【洋桃电子的个人空间-哔哩哔哩】 https://b23.tv/NdpuLsZ

【keysking的个人空间-哔哩哔哩】 https://b23.tv/5PhjObM

【尚硅谷的个人空间-哔哩哔哩】 https://b23.tv/PJkoNXZ

【嵌入式开发小美老师的个人空间-哔哩哔哩】 https://b23.tv/DB7BDvc

  

_（以下三个：非常官方，适合系统性学习，但要有一定基础不然有点吃力，最好要配套相应的__开发板__）_

【野火电子官方的个人空间-哔哩哔哩】 https://b23.tv/rMu99ry

【正点原子官方的个人空间-哔哩哔哩】 https://b23.tv/QNZ5cyp

【韦东山的个人空间-哔哩哔哩】 https://b23.tv/yF3P25a

【华清远见研发中心的个人空间-哔哩哔哩】 https://b23.tv/S7kHcSM

## 拓展知识

### 计算机基础

这些知识对我们考核可能没啥用，但是是实际工程中很重要也很实用的知识。对于你理解手里的电脑是如何运行的，以及理解现代世界是如何构建，是很有帮助的。

MIT《计算机教育中缺失的一课》：https://missing-semester-cn.github.io/

计算机网络基础：https://findladders.com/

还有一些计算机专业有关的专业课，例如计算机网络、操作系统、数据结构与算法等，学习这些内容也有助于我们写出更好的代码。

### 软件工程

由于现在有 AI，因此学习软件工程处理复杂项目是一个很重要的事情。

推荐阅读软件工程圣经《人月神话》学习：https://book.douban.com/subject/1102259/

### 竞赛

推荐关注逐飞科技的 Gitee：https://gitee.com/seekfree

以及卓晴老师的 B 站：https://space.bilibili.com/213206285

也推荐关注上面两位的微信公众号

龙邱科技：https://space.bilibili.com/95313236

轮趣科技：https://space.bilibili.com/556393812

我们实验室的开源：https://github.com/HZCU-Debug

智能车开源搜集：https://github.com/ittuann/Awesome-IntelligentCarRace

QQ群 例如TWU 例如逐飞官方组织的不同组别的交流群

B 站上也有很多大佬备赛的时候会发视频，可以 B 站私信和他们交流。

也推荐自学一些自动控制、计算机视觉有关的内容，但是由于内容比较庞杂，看到这里你也应该掌握了一些自主学习的能力，因此不一一列举。