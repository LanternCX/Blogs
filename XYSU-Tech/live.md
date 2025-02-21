## 技术部攻略 | 直播技术初步

### 〇、基本概念

这篇主要介绍直播过程中会提及的一些基本概念，对这些概念有一定基础的同学可以直接跳过这一部分开始OBS Studio的学习

#### 1. 帧率

在阿B网上冲浪时，你一定好奇过关于画质的这些选项：

![帧率](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/帧率.86ts5a7kc7.webp)

这里的“1080P” 和 “60帧”两个参数都指的是什么？看完这篇，你就会对它们有一些基础的了解

[视觉暂留](https://baike.baidu.com/item/视觉暂留/5125149)是人眼感知运动的一种方式

观察直升机的螺旋桨，你会发现它静止和运动时看起来完全不同

![直升机](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/直升机.1e8qithcxl.webp)

看到这样的画面，你的直觉会告诉你螺旋桨在旋转，而不是静止的。这就是**视觉暂留**

简单来说，人眼会将两个间隔极短的画面“连起来”，并把它看作是运动的

利用人眼的**视觉暂留**，在很短的时间内**连续显示**连续的图像，同样也会被人眼认为是**运动的**

于是，**视频**就诞生了

所谓**视频**，就是一堆**连续图像**的**连续显示**。

因为视觉暂留，你的眼睛看这一堆连续显示的图片，就会觉得它们是连续的、运动的，而不是单独的单张图像。

而这一张张连续显示的图片，他们的**每一张**，都被称为**帧**

在此基础上，描述视频的第一个参数出现了：**帧率**

**帧率（Frame rate）**描述的是图像显示的频率，它的一个常用单位是 **帧/秒（Frame per second）**也就是我们常常听到的缩写：**FPS**

而上面提到的**60帧**指的就是这个视频**每秒显示60张图像**

显而易见的，**帧率越高**视频显示的画面就**越流畅**，也就意味着**画面质量越好**

常见的帧率有24FPS、25FPS、29.97FPS、30FPS、60FPS、120FPS等等

#### 2. 分辨率

既然视频由图片组成，那么我们同样也可以用描述图片的方式描述视频

我们在小学信息课就学过，图片分为**位图**和**矢量图**两种

其中，位图由许多个纯色的小方块组成，这些小方块均匀排布远看之后，就成了一条连续的线

![ps中的jsbicon](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/ps中的jsbicon.13lwpo24r9.webp)

像这样一张看起来边边角角极为丝滑的图片，放大看是这样的

![ps中的jsbicon一角](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/ps中的jsbicon一角.9rjj4r4rrq.webp)

这每一个纯色的小格子就是一个**像素（Pixel，缩写为px）**

点构成线，线构成面，就有了图片

显而易见的，这些像素越小越密，图片就越容易被人眼看成是一个是一个图像，而非一堆像素

也就是说，**像素越密集，图片越清晰**

而我们都知道，计算机上的图片可以随意放大与缩小，像素只是一些纯色的正方形而没有实际的大小，那么像素的密集程度又是怎么定义的呢？这就涉及到了显示器能够显示像素数量的能力。

因此我们在此引入一个新的概念：**分辨率**

**分辨率**有**图像分辨率**和**显示分辨率**之分

##### 显示分辨率

显示分辨率的单位是**PPI（Pixels Per Inch）**，也就是像素每英寸，它描述的是显示器上的像素密度

**分辨率**便是描述图像的参数之一，它描述的是**图像的精细程度**

它的常用单位是**像素/英寸 (Pixels Per Inch)**，缩写为**PPI**

**PPI**的计算公式为：
$$
PPI=\frac{\sqrt{x^2+y^2}}{z}
$$
其中x为**屏幕长边**的像素数量，单位**像素**；y为**屏幕短边**的像素数量，单位**像素**；z为**屏幕对角线的长度**，单位为**英寸**

例如，一块长**1920px**，宽**1080px**，尺寸为1**2.5英寸的**屏幕，**PPI约为117**

![PPI的计算](https://github.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/PPI的计算.1vys7eiqhf.webp)

##### 图像分辨率

而图像分辨率则直接描述一张图片的长宽，也就是直接描述图像的大小

常见的图像分辨率有**3840*2160**、**1920*1080**、**1280*720**等等

他们分别被称为**4K**，**1080**，**720**

由此可见，对于一块PPI一定的屏幕，图像的分辨率越高，显示的图像就越大

现在，当你再看阿B下面的那些画质选项时，就不再陌生了：

![阿B画质](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/阿B画质.m7es6axc.webp)

（1080后面的**P**在后文[隔行扫描与逐行扫描](####4. 隔行扫描与逐行扫描)会做说明）

#### 3. 码率

知道了视频的分辨率、帧率以后，加上得知了视频的时长，上过信息课并且数学好的同学一定要迫不及待地开始计算了：

对于一个分辨率为**1920*1080**、帧率为**60FPS**、色彩深度为**24bit**、时长为 **1s** 的视频

每帧图像有
$$
\frac{1920\times1080\times24}{8} = 6220800(Byte)
$$
1秒60FPS的视频就有
$$
6220800\times60 = 373248000(Byte) = 364500(KByte) \approx 356(MByte)
$$
也就是说，一秒的视频要占用356MB的存储空间？这一定是哪里弄错了

我做一个六分多钟的视频导出也只有五百多兆啊

![视频大小](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/视频大小.1vys7eiqj1.webp)

为了解决这点疑惑，我们需要了解一个新的概念：**码率**

**码率**，描述的是视频的**数据密度**，它的常用单位是**MB/S**

码率也常用**kbps（千比特每秒）**作为单位，当码率**以kbps作为单位**时，称为**比特率**

看单位我们就能知道，码率越高，视频每秒的大小就越高

按照常理来说，一个**无损视频**的码率的计算，就应该像是我们上面计算的那样，上面条件下的视频，码率就应该是**356MB/s**

但是，你会发现，如果视频一秒就要占用三百多兆的空间，那么我们的硬盘很快就会被塞满

随手拍拍生活，发个30秒的抖音，我的手机居然满了？？？

然而事实不是这样的。聪明的人们利用我们眼睛对**色彩和亮度感知的差异**等等特征，发明了**视频压缩技术**

**视频压缩技术**允许我们将视频以**不改变**原视频**分辨率**、**帧率**的前提下，以**肉眼极难分辨**的画质损失，将视频的**码率大大下拉**

也就是说，通过**视频压缩技术**，我们可以**牺牲画质换来更小的文大小**

既然看不出来，那何乐而不为呢？

反之，**码率越高**，视频的**画质就越好**

#### 4. 隔行扫描与逐行扫描

现在，你知道了**1920*1080**，知道了**60FPS**，知道了**码率**，但是**1080**后面的**P**又是个啥呢？

**P**是**Progressive scanning**的缩写，中文里面叫**[逐行扫描](https://baike.baidu.com/item/%E9%80%90%E8%A1%8C%E6%89%AB%E6%8F%8F)**，简单来说就是这个画面显示图像的方式是一行一行地绘制像素

而相对应的**I**就是**Interlace Scanning**的缩写，中文叫做**[隔行扫描](https://baike.baidu.com/item/%E9%9A%94%E8%A1%8C%E6%89%AB%E6%8F%8F)**，它的显示方式就是隔一行刷新一次新像素

具体区别再次不多赘述，隔行扫描开始是为了节省带宽诞生，但是因为自身的一些缺陷和时代的进步现在已经基本被淘汰了，大家只要知道这是视频的一个参数就行了

感兴趣的话可以自己上网络查一下:)

#### 5. 色域

数字时代，一切都用数字代替，人们就会面对一个问题：如何用数字存储图像？

人们发现，将图片分割为若干个纯色的**像素**存储图像的**位图**很容易将图像数字化

那么我们解下了将要面对的问题就是：如何数字化一个像素？

也就是：如何**用数字表示颜色**？

初中物理告诉我们，光的三原色是**红（Red）**、**绿（Green）**、**蓝（Blue）**也就是**RGB**

因此我们可以用RGB三种颜色的光加上不同的权重混出许多不同颜色的光

给这些颜色分配权重来数字化地表示色彩，就称为**RGB颜色标准**

RGB也有不同的分类，例如**sRGB**和**Adobe RGB**

**sRGB**所表示的**颜色的集合**，就称为**sRGB色域**

![RGB色域](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/RGB色域.2a57y9r1cm.webp)

同时，你一定还能想到其他表示颜色的方法：

比如，通过色调（Hue）、饱和度（Saturation）、明度（Value）表示的HSV色域

![HSV颜色空间](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/HSV颜色空间.6bh7cnv4o6.webp)

除此之外，还有YUV、NTSC、CMYK、DCI-P3等等色域，他们都可以表示颜色

这时你一定会疑惑：这么多色域都表示的是同一些颜色吗？

当然不是！

在我们对人眼的所有可见光做一定的数学变换之后得到了这张**色域马蹄图**，马蹄状图型的边缘圈定的区域表示**可见光**的范围，而其中的多边形则圈出了不同色域能表示颜色的范围

![查看源图像](https://pic2.zhimg.com/50/v2-96e8cba92f1473a40edfa62546cbacbe_hd.jpg?source=1940ef5c)

在这张图上你可以看到，不同的色域表示颜色的能力不同，他们之间的用途因为自身特性的不同也存在一定的差异

你可以查看UP主硬件茶谈的这期视频[【硬件科普】显示器的色域和色准是什么东西？他会影响哪些体验](https://www.bilibili.com/video/BV1kk4y167rk/)了解有关色域的更多信息

#### 6. 音频采样率与声道

##### 采样率

与数字化图像相同，音频同样需要数字化

高中物理告诉我们，**声音是一种波**

**波是连续的**，就像图像的边缘是连续的

而点状的离散的数据更便于计算机的处理

因此类似于图像，人们选择用连续的紧挨着的点来表示连续的波

像这样一段看似连续的波

![Au中的声波](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/Au中的声波.73u2uebqee.webp)

放大后其实是由一堆离散的点组成的

![Au中放大后的声波](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/Au中放大后的声波.sz2wimwkl.webp)

而将连续的波转变为不连续的点的过程就是**采样**

顾名思义，采样就是按照**一定的时间间隔**记录下**声波当前的值**的过程

而**采样率**正是描述**采样的精细程度**的参数，它的常用单位是**千赫兹（kHz）**

常见的采样率有**48kHz**、**44.1kHz**等等，采样率越高，数字声音听起来就越像真实的声波

##### 声道

声音不只有波动，我们感知声音时还往往还能感知声音的**位置信息**

而**声道**便是解决表示声音位置信息的一个方案

高中数学告诉我们在平面中任意一个向量a，都有
$$
\vec{a} = m\vec{b} + n\vec{c}
$$
![平行四边形定则](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/平行四边形定则.8ade300n1z.webp)

因此我们可以用**两个或更多个的位置固定音箱**，每个音箱的声音加上**不同的响度**，就能表示出很多种**声音的方位**

因此便有了很多不同的表现声音方位的解决方案，如立体声、5.1、7.1等等

![立体声](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/立体声.54xw42685p.webp)

更多有关声道的信息可见百度百科：[百度百科|声道](https://baike.baidu.com/item/%E5%A3%B0%E9%81%93)

#### 7. 常见的音视频封装与编码格式

##### 封装格式与编码格式

**封装格式**与**编码格式**有什么区别？

先说说**编码格式**：

上文提到可以通过**视频压缩技术**，对原视频进行**压缩编码**，得到体积更小的压缩后视频

而不同的**压缩方式**就对应着不同的**编码格式**

常见的视频编码格式有**H.264**、**mpeg-4**等等

再来是**封装格式**：

封装格式处理了许多视频编码之外的问题，包括如何对齐音频与视频，记录视频的作者、版权等等信息

也就是说，视频封装中除了视频，还有音频等其他信息，而封装就是将这些信息组织起来的方式，不同的组织这些信息的方式，就对应着不同的封装方式

常见的视频封装有**MP4**、**AVI**、**FLV**等等

##### H.264编码格式

H.264视频编码格式是当今最为常用的视频编码格式

上面提到，视频压缩技术允许以极小的画质损失，换来极小的文件体积

这是怎么做到的呢？他们大部分都利用了人眼对于图像信息不同不同部分的不同敏感度，将人眼不敏感的信息提取并丢弃，人眼敏感的信息保留，这样就得到了压缩后的图像

其核心思想可以在JPEG和PNG的图片压缩算法上得到体现：[Reducible | JPEG不可思议的压缩率——归功于信号处理理论](https://www.bilibili.com/video/BV1iv4y1N7sq/)、[Reducible | PNG 原理——为质量牺牲速度](https://www.bilibili.com/video/BV1wY4y1P7o7)

而[极客湾 | 【科普】“视频”是怎么来的？H.264、码率这些词又是什么意思？](https://www.bilibili.com/video/BV1nt411Q7S6/)的视频则科普了h.246压缩的大致过程

H.264提供了多种比特率分配形式，这有助于我们自定义视频的比特率，在画面质量与视频体积之间找到平衡点

首先是**CBR（Constant Bit Rate）**模式，即**固定码率**模式

不难理解，固定码率意味着视频的码率在每一时刻都是固定的，这在直播中有助于画面的稳定

只要设定了固定码率的值，H.264编码器就会以固定的码率编码视频，编码后的视频的码率将会固定不变

**CBR**的**码率-时间**关系就像下面这样：

![固定码率](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/固定码率.8z6nn0o625.webp)

接下来是**VBR（Variable Bit Rate）**，即**可变码率**

可变的码率有助于在文件体积不变的情况下，为**可以高度压缩**的画面分配**低比特率**，而**压缩后画质变化较大**的画面分配**高比特率**

如此以来，既保证了**文件的小体积**，又保证了**画面的高质量**，可以说**可变码率是以较为固定的画质编码**的

可变码率的编码需要一个**目标码率**和一个**最高码率**

编码器在编码时的最高码率不会超过设定的最高码率，而视频编码后的平均码率将会达到目标码率

也就是说当VBR的目标码率和CBR的固定码率相同时，文件体积不变，而VBR编码的画质更高

**VBR**编码的**码率-时间**曲线如图：

![可变码率](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/可变码率.4n7ufh4ujx.webp)

显而易见的，**相同目标比特率下**，VBR编码所需要的**时间与算力**是**远大于**CBR编码的

因此，在**直播中**为了保证画面的流畅我们往往会选择**CBR编码**，而**VBR编码**则常用在**录像与视频制作**中，以追求更高的画质为目标

（另外VBR还有1次与2次之分，2次相对于一次复杂度更高，但画面质量也更高）

#### 8. 流与常见的流传输方式

在你了解了视频之后，直播就变得易于理解了

直播就是一种实时上传视频，实时查看视频的技术

而对于正在网络线缆中实时传输的数据，就像管道中不断流动的水流，人们给他起了个很形象的名字：**流（Stream）**

也因此，对于实时传输媒体的的技术，我们便叫他**流媒体技术**

常见的流媒体传输技术有很多，这些技术定义了发送媒体的一方该如何发送数据，接收媒体的一方该如何接收数据，双方达成共识，我们便称这种共识叫做**协议**

不同的流传输方式有不同的协议，常见的流传输协议有**RTMP**、**RTSP**、**HLS**等等，我们学校的学源平台使用的是**RTMP**

#### 一、OBS Studio

[gitee上的OBS Studio仓库](https://gitee.com/obsproject/obs-studio)介绍中写到

> OBS Studio is software designed for capturing, compositing, encoding, recording, and streaming video content, efficiently.
>
> OBS Studio 是一个专门为高效地**捕获**、**合成**、**编码**、**录制**、**推流**视频类容而设计的软件。

也就是说，OBS 是一个专门为直播、录播而生的软件，它对新人入门友好，功能强大，国际化，还免费、开源

香！

本篇使用的OBS版本为`28.1.2`，但是在你看这篇的时候它一定又迭代了很多版本了，具体你可以在[obsproject.com](https://obsproject.com/)或者他们在[gitee的release](https://gitee.com/obsproject/obs-studio/releases/)查看最新版本

这是OBS的主面板：

![OBS](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS.pfgysttuu.webp)

每块小面板上的中文相信已经对各自的功能介绍很清楚了，下面我们来一一讲解这些功能

#### 1. 添加一个输入源

有了直播软件解决了**怎么播**的问题，那么怎么解决**播什么**的问题就要看你了

OBS提供了**很多不同的输入源选项**，点击来源下方的`+`号就可以添加它们

![OBS添加输入](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS添加输入.6bh7cnv4om.webp)

点击`+`后你就会看到**可选的输入源**：

![OBS可选输入](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS可选输入.92q9kqh8pz.webp)

（你可能会发现你的可选输入源列表和我的有点不一样，这个我们晚些会提到）

接下来就**无脑下一步**就好啦！

例如我们要将我们电脑屏幕的画面作为直播的内容，那么我们可以添加一个**显示器采集**

![OBS显示器采集1](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS显示器采集1.7pfa7sgad.webp)

![OBS显示器采集2](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS显示器采集2.45hsqw3gxh.webp)

![OBS显示器采集3](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS显示器采集3.7lk4izd3zp.webp)

添加成功后你将看到：

![OBS显示器采集4](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS显示器采集4.2yyhiaekc6.webp)

恭喜你！成功添加了一个显示器采集的输入源！

同理，如果你要添加一个相机源的话，你可以选择视频采集设备然后选择要添加的相机源：

![OBS摄像头](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS摄像头.1hscgjaflg.webp

OBS还提供了很多很有意思的输入源，这里不一一列举，操作都很简单，可以自己尝试一下~

#### 2. 编辑你的场景

一个**编辑好的画面**在OBS中被称为一个**场景**

你可以点击**场景面板**下方的`+`号创建一个空场景：

![OBS新建场景](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS新建场景.3nrr2b23ck.webp)

通过编辑场景，你可以有序地组织画面元素，让你的直播合理开展

当然你也可以使用多个场景，在需要时切换不同的场景

下面将介绍不同的编辑场景的方式

##### 改变位置

当你的输入源达到一定数量的时候，你会发现你必须要**安排这些输入源的位置**

OBS提供了很简便的编辑直播画面的方式，你可以直接在频幕上按住输入源并拖动它就可以改变输入源的位置：

![OBS编辑画面1](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS编辑画面1.pfgysttvc.webp)

##### 改变上下关系

如果你接触过PS这样的图层式软件，那么你应该对图层那些叠来叠去的关系十分熟悉

下面这张图中，**图片-运动会**遮盖住了**图片-OBS**的一部分：

![OBS遮盖](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS遮盖.70agwoinpk.webp)

那么他们在**空间中**的**上下关系**就应该是这样：

![OBS遮盖-空间中的上下关系](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS遮盖-空间中的上下关系.7lk4izd40h.webp)

因此看起来像是这样：

![OBS遮盖-看起来](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS遮盖-看起来.54xw42683z.webp)

而如果我在**来源**中调整他们的**上下关系**：

![OBS遮盖-改变上下关系](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS遮盖-改变上下关系.13lwpo24qw.webp)

在空间中看起来就像这样：

![OBS遮盖-改变空间中的上下关系](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS遮盖-改变空间中的上下关系.4jo8hrbrt7.webp)

那么在OBS中的画面看起来就像是这样：

![OBS遮盖-改变上下关系后](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS遮盖-改变上下关系后.6m415tacuh.webp)

根据这点。你就可以编辑出一个元素众多但又十分和谐的直播场景了

![OBS-虚拟主播的直播场景](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS-虚拟主播的直播场景.3k854l90n1.webp)

像上面这种游戏直播画面都可以通过简单的场景编辑加上一些OBS的插件轻松搭建出来~

#### 3. 调整你的声音

无论画面如何，声音永远是直播和视频中的重要一环

相比画面，声音是更为简练的信息，画面的核心信息往往会通过声音传递

在视频制作中，声音在很多时候决定了画面的情感、内容、节奏等等关键要素

相信没有人会愿意看一场没有声音的演唱会，也不会去听一支电流麦讲述的故事

因此，**永远不要只专注于画面而忽视直播的声音**

在OBS中，提供了**方便快捷**的方式混出一个较为和谐的声音

##### 添加

首先我们可以通过**添加输入源**的方式添加**声音源**：

![OBS添加声音](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS添加声音.5xarlsmtti.webp)

**音频输入采集**可以采集外接**麦克风**的声音：

![OBS音频输入采集](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS音频输入采集.2obnp4zc7m.webp)

而**音频输出采集**则能采集输出到**音频输出设备**的声音：

![OBS音频输出采集](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS音频输出采集.54xw426842.webp)

你也可以在**设置->音频->全局音频设备**中配置：

![OBS全局音频设备](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS全局音频设备.1vys7eiqg7.webp)

这样在场景被新建时，配置的**全局音频设备**会被**自动添加到场景**中：

![OBS被添加的全局音频设备](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS被添加的全局音频设备.7w6yc4sc5a.webp)

##### 基础混音

你可以对这些音频做出一些简单的更改

例如，你可以**滑动滑块**调整这个音频你输入的声音的**音量大小**：

![OBS调整音量](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS调整音量.4g4mk1ip32.webp)

（不过只能调小不能调大就是了）

**请注意**：将每个音频输入的音量控制在-**10dB至-20dB之间**跳动，也就是图中的**黄色区域**

![OBS基础混音](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS基础混音.7axaptxvu0.webp)

在直播过程中，你可以通过这点简单地判断音量是过大还是过小，并依此做出相应调整

你也可以**锁定音量**以**防止小天才**乱改导致你被观众送葬：

![OBS锁定音量](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS锁定音量.7w6yc4sc5u.webp)

你也可以通过**滤镜**添加压缩，门限，增益等等较为专业的调音相关效果，但因为涉及的调音知识较多，这里不做更多展示

![OBS调音](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS调音.361pdq0prz.webp)

（顺带一提，增益可以让你调高音量，另外不知为什么OBS不能给音频加EQ）

（这些效果能帮助你录制出清晰干净的声音，感兴趣的同学可以自己百度一下）

##### 高级音频配置

OBS还提供了更为**高级的音频配置**，合理的配置这些选项，**后期同学会感谢你**

![OBS高级音频属性](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS高级音频属性.ic93d7ogj.webp)

进入**高级音频属性**后，你会看到如上的画面，你需要配置的是**轨道**选项

做过剪辑的同学应该对轨道非常熟悉，简单来说，配置轨道能帮助后期同学处理单个输入源的声音，而不是混音后的声音

![OBS音频轨道](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS音频轨道.6m415tacuq.webp)

在轨道选项中，每个**输出**后面**打上勾的轨道**将会**记录该输出的声音**

在上面的例子中，**轨道1将会记录麦克风和桌面音频**两个输入的声音（也就是混合后的声音）

而**轨道2将会只记录麦克风**的声音，**轨道3将会只记录桌面音频**的声音

在**设置->输出（高级）->录像->音轨**中**勾选上需要录制的轨道**后（当然这里只需要3个轨道），录制后的文件就会写入多条音轨啦！

![OBS录像分轨配置](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS录像分轨配置.m7es6aun.webp)

录制出的文件在Pr中查看就能看到多条音轨：

![Pr中的轨道](/home/caoxin/Code/hello-xysu-tech/live/.https:/gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/Pr中的轨道.13lwpo24r7.webp)

音频轨道中的音频信息和我们配置的完全一致

后期同学高兴坏了（（（

（这里OBS提示要录制分轨需要录制MKV然后转封装，但是我转完封装之后发现只有一条音轨，索性直接录了MP4发现也可以，只是会丢掉末尾一点点时长）

#### 4. 进行一次录制或者推流

##### 推流

在正确编辑了你的画面，调整你的声音之后，你终于可以开始一次直播了！

这里就以**厦一海沧团委学生会2020级部长许航同学**自主开发的学源平台的直播功能作为演示

要进行基于RTMP协议的直播推流，我们需要两个值：

![学源的串流地址与串流密钥](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/学源的串流地址与串流密钥.58hi1rzaul.webp)

在获取到**串流地址**和**串流密钥**以后，在**设置->直播**中将**服务改为自定义**，将获取到的**串流地址**和**串流密钥**分别填入**服务器**和**推流码**

![OBS配置直播](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS配置直播.969vigabgy.webp)
点击**开始直播**

![OBS开始直播](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS开始直播.1ap4l3oa5r.webp)

就可以在学源平台上看见你直播的内容了！

![学源观看直播](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/学源观看直播.1vys7eiqi9.webp)

OBS还提供了很多平台的**直播预设配置**，其中就有非常常用的**哔哩哔哩直播**：

![OBS直播预设](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS直播预设.wiou8fzau.webp)

由于我个人没有成年因此无法在阿B开通直播，因此在此不做演示

##### 录制

点击主面板的**开始录制**，就可以录制当前场景的画面

![OBS录制](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS录制.7w6yc4sc4z.webp)

在**设置->输出（高级）**中，你可以配置直播、视频、音频的编码方式和比特率：

![OBS编码配置](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS编码配置.6ikf83ha47.webp)

我一般设置的是：直播**CBR**编码、码率**6000Kbps**；录像VBR编码、目标码率**6000Kbps**、最高码率**24000Kbps**

这也是B站的码率上限要求

当然，你可以根据你的硬件设置进行编码和编码器的调整，我的电脑有独显因此选择的是硬件编码。如果你的电脑没有独显加速，可以选择其他编码器，设置的思路大同小异，具体可以参见上文[H.264编码格式](#####H.264编码格式)。

#### 5. 工作室模式与转场

直播的过程中，你定会发现，如果你直接改变场景，观众会看到你在画面上拖动元素，编辑字幕

这显然不够优雅，观众的观感也会大打折扣

于是，OBS推出了**工作室模式**：

![OBS工作室模式](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS工作室模式.6f0tado7e5.webp)

**在主面板打开工作室模式**，你会发现原来一个画面框框变成了两个

每个画面上方也标注了**预览**和**输出**字样

稍作尝试后你会发现，你只能更改预览中的画面，而输出中的画面始终是更改前的

而点击两个画面之间的**转场效果**或者**滑动滑块**，就能将**预览的场景**应用到**输出的场景**

![OBS转场](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS转场.1ap4l3oa6a.webp)

通过**工作室模式**，我们就能优雅地编辑好画面然后再放给观众看了

OBS提供了几种不同的转场效果：

![OBS转场特效](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS转场特效.4cl0mbpmdi.webp)

而更改下方的时间则可以改变转场应用到输出所需的过渡时间

当然，滑动滑块，你也可以完成一次转场：

![OBS转场滑块](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/OBS转场滑块.2vevkklhmu.webp)

不难发现，滑块越靠近输出一侧，输出画面中的预览画面占比就越多

根据这个特点，你可以将两个不同的画面叠加到一起：
![转场推子的应用](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/转场推子的应用.7pfa7sgcw.webp)

但因为本篇主要讨论直播技术相关话题，在此不深入讨论

基础的OBS使用教程在此就告一段落，相信掌握了基本的OBS使用方法后，你已经能轻松搭建较为简单的直播场景。而对于 OBS Studio 在本篇中未提及或者还未推出的功能，相信你已经有了自主学习与自主探究的能力。所以，加油！

### 二、vMix

#### 1. 一些的基础输入源

#### 2. 输入源的基础配置

#### 3. 音频设置与延迟对正

#### 4. 场景编辑

#### 5. 转场

#### 6. 进行一次推流

#### 7. 进行一次输出画面的录制

#### 8. 进行一次输入画面的录制

#### 9. 保存工程文件

#### 10. Fullscreen 的 用处

### 三、NDI技术

#### 1. 概念

#### 2. NDI技术在OBS中的应用

#### 3. NDI技术在vMix中的应用

#### 4. 部分 NDI5 套件的基础使用

##### (1) Studio Monitor

##### (2) Screen Capture

##### (3) Bridge

### 四、实践：厦一海沧的晚会直播实现

#### 机位部署

![博雅CAD白底](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-02-21/机位安排.4qrgd6xx9z.webp)
