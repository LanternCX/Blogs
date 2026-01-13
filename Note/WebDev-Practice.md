# Web Develop

1-20 章答案，AI 生成，不保证正确

## Chapter 1 Web 技术概述

**1. Web 使用 ( ) 在服务器和客户端之间传输数据。**

* **选项：** A. FTP B. Telnet C. E-mail D. HTTP
* **答案：D**
* **解析：** Web（万维网）的核心协议是 **HTTP** (HyperText Transfer Protocol，超文本传输协议)，它专门用于在 Web 浏览器（客户端）和 Web 服务器之间传输 HTML 页面和其他数据。
* FTP 是文件传输协议。
* Telnet 是远程登录协议。
* E-mail 相关的通常是 SMTP/POP3/IMAP。

**2. HTTP 服务默认的端口号是 ( )。**

* **选项：** A. 20 B. 21 C. 25 D. 80
* **答案：D**
* **解析：** **HTTP** 协议默认使用的端口号是 **80**。如果是 HTTPS，默认端口通常是 443。
* 20 和 21 是 FTP 协议的默认端口。
* 25 是 SMTP（简单邮件传输协议）的默认端口。

**3. HTML 是一种标记语言，由 ( ) 解释执行。**

* **选项：** A. Web 服务器 B. 操作系统 C. Web 浏览器 D. 不需要解释
* **答案：C**
* **解析：** HTML 代码是发送到客户端的，由客户端的 **Web 浏览器**（如 Chrome、Firefox、Edge 等）负责解析标签并渲染成可视化的网页。服务器只负责存储和发送，操作系统只负责底层支持。

**4. 目前的 Web 标准不包括 ( )。**

* **选项：** A. 结构标准 B. 表现标准 C. 行为标准 D. 动态网页
* **答案：D**
* **解析：** W3C 制定的 Web 标准主要由三部分组成：
1. **结构 (Structure)**：主要指 HTML/XHTML，用于整理数据。
2. **表现 (Presentation)**：主要指 CSS，用于设置样式。
3. **行为 (Behavior)**：主要指 DOM 和 ECMAScript (JavaScript)，用于交互。


* “动态网页”是指网页的形态或技术类型，不属于“标准”分类。

**5. 下面正确的 URL 地址是 ( )。**

* **选项：**
A. Get://www.solt.com/about.html
B. ftp:/ftp.tsinghua.edu.cn
C. http://www.tsinghua.edu.cn
D. http:www.bhu.edu.cn
* **答案：C**
* **解析：** 统一资源定位符（URL）的标准格式通常为 `协议类型://服务器地址/路径`。
* A 错误：Get 是 HTTP 的请求方法，不是协议名称。
* B 错误：`ftp:` 后面应跟双斜杠 `//`，此处只有一个。
* C 正确：`http://` 格式正确且域名格式合法。
* D 错误：`http:` 后面缺少双斜杠 `//`。

## Chapter 02 初识 HTML5

**1. 关于 HTML5 的基本语法，下列说法错误的是 ( )。**

- **选项：**

  A. 在文档开始要定义文档的类型

  B. 元素允许交叉嵌套

  C. 空标签最好加 “/” 来关闭

  D. 属性值建议用""括起来

- **答案：B**

- **解析：**

  - HTML 元素**不允许**交叉嵌套（例如 `<b><i>...</b></i>` 是错误的），必须正确地闭合（如 `<b><i>...</i></b>`）。
  - A 正确，HTML5 文档开头必须使用 `<!DOCTYPE html>` 声明文档类型。
  - C 正确，虽然 HTML5 对空标签（如 `<br>`）不强制要求关闭，但为了兼容性和代码规范，建议写成 `<br/>`。
  - D 正确，HTML5 允许属性值不加引号，但为了防止解析错误和保持代码整洁，建议始终使用双引号。

**2. `<!DOCTYPE>`的作用是 ( )。**

- **选项：**

  A. 用来定义文档类型

  B. 用来声明命名空间

  C. 用来向搜索引擎声明网站关键字

  D. 用来向搜索引擎声明网站作者

- **答案：A**

- **解析：** `<!DOCTYPE>`（Document Type Declaration）声明位于文档的最前面，用于告诉浏览器当前文档使用的是哪种 HTML 或 XML 规范（即文档类型），以便浏览器能正确渲染页面。

**3. ( ) 标签是文件头的开始。**

- **选项：**

  A. `<html>` B. `<head>` C. `<font> `D. `<frameset>`

- **答案：B**

- **解析：**

  - `<head>` 标签定义了 HTML 文档的“头部”部分，包含了文档的元数据（如标题、字符集、样式表链接等），是文件头的开始。
  - `<html>` 是整个文档的根元素。

**4. 以下代码片段完全符合 HTML5 语法标准的是 ( )。**

- **选项：**

  A. `<input type=text>`

  B. `<input TYPE="text">`

  C. `<input type="text" disabled>`

  D. `<input type="text" disabled="disabled">`

- **答案：D** （注：C 也是有效的 HTML5 写法，但在考试中通常考查严谨性）

- **解析：**

  - 虽然 HTML5 语法非常宽松，允许属性值不加引号（A）、标签大写（B）以及布尔属性简写（C），但在标准的教学和考试规范中，通常推荐遵循 **XHTML 风格的严格语法**：标签小写、属性值加引号、属性不仅有键还有值。
  - 因此，D 选项 `<input type="text" disabled="disabled">` 是格式最严谨、最符合“标准规范”的写法。
  - *注：在实际开发中，C 选项 `<input type="text" disabled>` 是非常普遍且推荐的 HTML5 写法。*

**5. 以下代码片段完全符合 HTML5 语法标准的是 ( )。**

- **选项：**

  A. `<br>` B. `<p>这是一个段落` C. `<div></div>` D. `<hr>`

- **答案：C**

- **解析：**

  - 同样基于“严格语法”的考量：
  - A 和 D 是空标签（Void Elements）。在严格标准（如 XHTML）中，建议自我闭合，写作 `<br/>` 和 `<hr/>`。
  - B 缺少闭合标签 `</p>`，虽然浏览器能容错，但这不符合语法标准。
  - C `<div></div>` 有完整的开始和结束标签，语法完全正确且无可争议。

## Chapter 03 HTML5 内容结构与文本

**1. 在下面的标签中，( ) 是 HTML5 新增的标签。**

- **选项：** A. `<br>` B. `<break>` C. `<header>` D. `<head>`
- **答案：C**
- **解析：** `<header>` 是 HTML5 引入的语义化标签，用于定义文档或节的头部区域。A、D 是旧有标签，B 不是标准标签。

**2. 在 HTML5 中，注释标签是 ( )。**

- **选项：** A.  `<!-- -->` B. `/*...*/` C. `//` D. `'`
- **答案：A**
- **解析：** HTML 文档中的注释格式为 `<!-- -->`。B 和 C 是 CSS 或 JavaScript 的注释格式。

**3. 在 HTML5 中，列表不包括 ( )。**

- **选项：** A. 无序列表 B. 有序列表 C. 定义列表 D. 公用列表
- **答案：D**
- **解析：** HTML 中标准的列表类型只有三种：
  - 无序列表 (`<ul>`)
  - 有序列表 (`<ol>`)
  - 定义列表 (`<dl>`)
  - “公用列表”是不存在的概念。

**4. 在 HTML5 文档中，使用 ( ) 标签标记定义列表。**

- **选项：** A. `<ol>` B. `<ul>` C. `<dl>` D. `<list>`
- **答案：C**
- **解析：**
  - `<dl>` (Definition List) 用于定义列表。
  - `<ol>` (Ordered List) 用于有序列表。
  - `<ul>` (Unordered List) 用于无序列表。

**5. 在下面的标签中，( ) 是通用标签。**

- **选项：** A. `<span>` B. `<p>` C. `<ol>` D. `<pre>`
- **答案：A**
- **解析：**
  - `<span>` 是行内通用容器，没有特定的语义，通常用于配合 CSS 设置样式。
  - 类似的还有 `<div>`（块级通用容器）。
  - `<p>`（段落）、`<ol>`（有序列表）、`<pre>`（预格式化文本）都具有具体的语义。

## Chapter 04 HTML5 超链接

**1. 已知 services.html 和 text.html 页面在同一个服务器（站点）里，但在不在同一个文件夹中。假如 services.html 在根目录下的 information 文件夹中，现要求在 text.html 中编写一个超链接，连接到 services.html 的 proposals 书签，下面语句正确的是（ ）。**

- **选项：**

  A. `<a href="services.html#proposals">Link</a>` 

  B. `<a href="/information/services.html#proposals">Link</a>` 

  C. `<a href="#proposals">Link</a>` 

  D. `<a href="information#proposals">Link</a>`

- **答案：B**

- **解析：** 题目明确指出 `services.html` 位于根目录下的 `information` 文件夹中。为了确保从任何位置（无论 `text.html` 在哪里）都能正确访问到该文件，使用以 `/` 开头的绝对路径（根相对路径）是最准确的方法，即 `/information/services.html`。要链接到特定的锚点（书签），需要在文件名后加上 `#` 和锚点名。因此正确路径是 `/information/services.html#proposals`。

  - A 选项假设两文件在同一目录，不符合题意。
  - C 选项是链接到当前页面的锚点。
  - D 选项语法路径不明确。

**2. 在 HTML5 文档中，超链接的基本形式是（ ）。**

- **选项：** A. `<a link="URL"></a>` B. `<a href="URL"></a>` C. `<a URL="URL"></a>` D. `<a http="URL"></a>`
- **答案：B**
- **解析：** 在 HTML 中，`<a>` 标签用于定义超链接，必须使用 `href` (Hypertext Reference) 属性来指定链接跳转的目标地址。

**3. 在 HTML5 文档中，若有名为 “end” 的锚点，则（ ）是建立至该锚点的链接。**

- **选项：** 

  A. `<a name="end">页尾</a>` 

  B. `<a href="end">页尾</a>` 

  C. `<a href="#end">页尾</a>` 

  D. `<a href="self#end">页尾</a>`

- **答案：C**

- **解析：** 链接到页面内部的特定锚点（ID 或 Name）时，`href` 属性的值必须以 `#` 符号开头，后跟锚点名称。

  - A 选项是定义锚点的旧语法，而不是链接到锚点。
  - B 选项会被浏览器解析为寻找一个名为 "end" 的文件。

**4. （ ）是空格字符实体。**

- **选项：** A. ` &nbsp` B. `&lt` C. `&gt` D. `&copy`
- **答案：A**
- **解析：** HTML 中，` &nbsp` 代表 Non-Breaking Space（不换行空格）。
  - `&lt` 代表小于号 (<)。
  - `&gt` 代表大于号 (>)。
  - `&copy` 代表版权符号 (©)。

**5. 在下面的颜色值中，（ ）是正确的颜色值。**

- **选项：** A. `&FF0000` B. `#FFHH00` C. `#FF00GG` D. `#FFBB00`
- **答案：D**
- **解析：** 十六进制颜色代码以 `#` 开头，后面跟随 6 位字符（或 3 位缩写）。这些字符必须是十六进制数字，即范围在 `0-9` 和 `A-F` 之间。
  - A 选项使用了错误的前缀 `&`。
  - B 选项包含了 `H`，C 选项包含了 `G`，这两个字母都不在十六进制（A-F）的范围内，因此是无效的。

## Chapter 05 HTML5 多媒体

**1. 关于下列两行 HTML5 代码，描述正确的是（ ）。**

```
<img src="image.gif" alt="picture">
<a href="image.gif">picture</a>
```

- **选项：** 

  A. 两者都是将图像链接到网页 

  B. 前者是链接后在网页中显示图像，后者是在网页中直接显示图像 

  C. 两者都是在网页中直接显示图像 

  D. 前者是在网页中直接显示图像，后者是链接后在网页中显示图像

- **答案：D**

- **解析：**

  - 第一行代码 `<img src="image.gif" ...>` 使用了 `<img>` 标签，它的作用是在网页中直接嵌入并显示图像。
  - 第二行代码 `<a href="image.gif">...</a>` 使用了 `<a>` 标签，它的作用是创建一个超链接。这里的链接指向了一个图像文件，用户点击文字 "picture" 后，浏览器通常会跳转并打开该图像文件，而不是直接在当前文档流中显示它。

**2. 下列有关网页中图像的说法不正确的是（ ）。**

- **选项：** 

  A. 网页中的图像并不与网页保存在同一个文件中，每个图像单独保存 

  B. HTML5 图像标签可以描述图像的位置、大小等属性 

  C. HTML5 图像标签可以直接描述图像上的像素 

  D. 图像可以作为超链接的起始对象

- **答案：C**

- **解析：**

  - HTML 是一种标记语言，`<img>` 标签只是引用外部的图像文件（如 .jpg, .png, .gif），并告知浏览器去哪里下载以及如何显示（宽、高、位置等）。
  - HTML 标签本身并不包含图像的原始位图数据（即“描述图像上的像素”），像素数据存储在独立的图像文件中。虽然 HTML5 的 `<canvas>` 可以通过脚本绘制像素，但普通的图像标签不能直接描述像素。

**3. 若要在页面中创建一个图像超链接，要显示的图像为 logo.gif，链接地址 "http://www.sohu.com/"，以下用法中正确的是（ ）。**

- **选项：**

  A. `<a href="http://www.sohu.com/">logo.gif</a>` 

  B. `<a href="http://www.sohu.com/"><img src="logo.gif"></a>` 

  C. `<img src="logo.gif"><a href="http://www.sohu.com/"></a>` 

  D. `<a href="http://www.sohu.com/"><img src="logo.gif">`

- **答案：B**

- **解析：**

  - 创建图像超链接的标准做法是将 `<img>` 标签嵌套在 `<a>` 标签内部。
  - 结构为：`<a href="目标网址"><img src="图片路径"></a>`。
  - A 选项显示的是文字。
  - C 选项图片和链接是分离的。
  - D 选项缺少了超链接的结束标签 `</a>`。

**4. 在以下标签中，主要用来创建视频和 Flash 的是（ ）。**

- **选项：** A. `<object>` B. `<embed>` C. `<form>` D. `<marquee>`
- **答案：B**
- **解析：**
  - `<embed>` 标签定义了一个容器，用来嵌入外部应用或互动程序（如插件）。在 HTML5 之前以及 Flash 流行的时代，`<embed>` 是最常用于嵌入 Flash 动画 (`.swf`) 和视频的标签。
  - `<object>` 标签也可以用于此目的，但 `<embed>` 在处理 Flash 等插件时更为典型和常用。
  - `<form>` 用于表单，`<marquee>` 用于滚动字幕。

**5. 为了解决浏览器对视频格式的兼容情况，可以使用（ ）标签为同一个媒体数据指定多个播放格式与编码方式。**

- **选项：** A. `<source>` B. `<audio>` C. `<video>` D. `<track>`
- **答案：A**
- **解析：**
  - 在 HTML5 的 `<video>` 或 `<audio>` 元素中，可以使用多个 `<source>` 标签来指定不同的媒体文件（例如一个 `.mp4` 和一个 `.ogg`）。
  - 浏览器会从上到下扫描 `<source>` 列表，并使用第一个它支持的格式进行播放，从而解决兼容性问题。
  - `<track>` 用于指定字幕文件。

## Chapter 06 HTML5 表格

**1. 表格的主要作用是（ ）。**

- **选项：** A. 网页排版布局 B. 显示数据 C. 处理图像 D. 优化网站
- **答案：B**
- **解析：** 在现代 Web 标准中，HTML 表格（Table）的语义和主要用途是用来展示结构化的数据（行和列）。虽然早期 Web 开发常用表格进行页面布局（A），但这已被 CSS 布局所取代且不被推荐。

**2. 如果表格的边框不显示，应设置 border 的值为（ ）。**

- **选项：** A. 1 B. 0 C. 2 D. 3
- **答案：B**
- **解析：** `border` 属性控制表格边框的宽度。如果希望边框不显示（宽度为 0），应将 `border` 属性值设置为 `0`。

**3. 定义单元格的是（ ）。**

- **选项：** A. `<td></td>` B. `<tr></tr>` C. `<table></table>` D. `<caption></caption>`
- **答案：A**
- **解析：**
  - `<td>` (Table Data) 用于定义表格中的标准数据单元格。
  - `<tr>` (Table Row) 定义行。
  - `<table>` 定义整个表格。
  - `<caption>` 定义表格标题。

**4. 跨行的单元格是（ ）。**

- **选项：** A. `<th colspan="2">` B. `<th rowspan="2">` C. `<td colspan="2">` D. `<td rowspan="2">`
- **答案：D**
- **解析：**
  - “跨行”指的是单元格在垂直方向上合并，即占据多行，对应属性是 `rowspan`。
  - “跨列”对应属性 `colspan`。
  - 因此排除 A 和 C。在 B 和 D 中，`<td>` 是标准单元格，`<th>` 是表头单元格。题目问“跨行的单元格”，D 选项 `<td rowspan="2">` 是最标准的表示“跨越两行的普通单元格”的代码。

**5. 表格的脚部是（ ）。**

- **选项：** A. `<tbody></tbody>` B. `<tfoot></tfoot>` C. `<thead></thead>` D. `<caption></caption>`
- **答案：B**
- **解析：**
  - `<tfoot>` (Table Footer) 标签定义表格的页脚/底部内容。
  - `<tbody>` 定义表格主体。
  - `<thead>` 定义表格头部。
  - `<caption>` 定义表格标题。

## Chapter 07 HTML5 表单

**1. 在 HTML5 中，`<form action=?>` 中的 action 表示（ ）。**

- **选项：** A. 提交的方式 B. 表单所用的脚本语言 C. 提交的 URL 地址 D. 表单的形式
- **答案：C**
- **解析：** `action` 属性规定当提交表单时，向何处发送表单数据（即服务器处理程序的 URL 地址）。提交的方式由 `method` 属性（GET 或 POST）定义。

**2. 下列选项能实现列表项多选的是（ ）。**

- **选项：** A. `<select multiple="multiple">` B. `<samp></samp>` C. `<select disabled="disabled">` D. `<textarea wrap="off"></textarea>`
- **答案：A**
- **解析：** `<select>` 标签用于创建下拉列表，添加 `multiple` 属性后，用户可以按住 Ctrl 或 Shift 键选择多个选项。

**3. 在 HTML5 中，（ ）属性用于规定输入字段是必填的。**

- **选项：** A. required B. formvalidate C. validate D. placeholder
- **答案：A**
- **解析：** HTML5 引入了 `required` 属性，当该属性存在时，浏览器会在提交表单前检查该字段是否为空，若为空则阻止提交并提示用户。`placeholder` 是占位符提示文本。

**4. 下列输入类型中（ ）定义滑块控件。**

- **选项：** A. search B. controls C. slider D. range
- **答案：D**
- **解析：** `<input type="range">` 用于创建一个包含滑块的输入控件，允许用户在一定范围内选择数值。
  - `search` 是搜索框。
  - `controls` 是媒体播放器的属性。
  - HTML 标准中没有 `type="slider"`。

**5. 若要产生一个 4 行 30 列的多行文本域，以下方法中正确的是（ ）。**

- **选项：**

  A. `<input type="text" rows="4" cols="30" name="txtintrol">` 

  B. `<textarea rows="4" cols="30" name="txtintro">` 

  C. `<textarea rows="4" cols="30" name="txtintro"></textarea>` 

  D. `<textarea rows="30" cols="4" name="txtintro"></textarea>`

- **答案：C**

- **解析：**

  - 多行文本域使用 `<textarea>` 标签，它是一个双标签，必须有闭合标签 `</textarea>`。
  - `rows` 属性定义行数（高度），`cols` 属性定义列数（宽度/字符数）。
  - A 选项使用的是单行输入框 `<input>`。
  - B 选项缺少闭合标签。
  - D 选项将行列数值颠倒了（30 行 4 列）。
  - C 选项正确设置了 4 行 30 列且标签完整。

## Chapter 09 CSS 基础

**1. CSS 的全称是 ( )。**

- **选项：** A. Computer Style Sheets B. Cascading Style Sheets C. Creative Style Sheets D. Colorful Style Sheets
- **答案：B**
- **解析：** CSS 的全称是 **Cascading Style Sheets**，中文译为“层叠样式表”。

**2. 以下 HTML 属性用来定义内联样式的是 ( )。**

- **选项：** A. Style B. class C. font D. styles
- **答案：A**
- **解析：** 在 HTML 标签中定义内联样式（行内样式）使用的是 **style** 属性，例如 `<div style="color:red;">`。

**3. 以下正确引用外部样式表的是 ( )。**

- **选项：** 

  A. `<stylesheet>mystyle.css</stylesheet>` 

  B. `<style src="mystyle.css">` 

  C. `<link rel="stylesheet" href="1.css">` 

  D. `<link rel="stylesheet" type="text/HTML" href="1.css">`

- **答案：C**

- **解析：** 引用外部 CSS 文件的标准标签是 `<link>`，必须包含 `rel="stylesheet"` 和 `href` 指向文件路径。选项 D 中的 type 应该是 `text/css` 而不是 `text/HTML`。

**4. 在以下选项中，可以正确定义所有 p 的字体为 bold 的是 ( )。**

- **选项：** A. `<p style="text-size:bold">` B. `<p style="font-size:bold">` C. `p{text-size:bold}` D. `p{font-weight:bold}`
- **答案：D**
- **解析：** 要定义所有 `p` 标签的样式，需要使用类型选择器 `p{...}`。控制字体粗细的属性是 **font-weight**，加粗的值为 **bold**。

**5. 在 CSS 样式文件中注释正确的是 ( )。**

- **选项：** A. // this is a comment // B. // this is a comment C. /* this is a comment */ D. 'this is a comment
- **答案：C**
- **解析：** CSS 标准的注释语法是使用 `/*` 开始，并以 `*/` 结束。`//` 是 JavaScript 或其他语言的单行注释方式，不是标准 CSS 语法。

**6. 关于 CSS 以下说法错误的是 ( )。**

- **选项：** 

  A. 选择器表示要定义样式的对象，可以是元素本身，或者是一类元素 

  B. 属性是指定选择器所具有的属性 

  C. 属性值是指数值加单位，例如 25px 

  D. 每个 CSS 样式必须由两部分组成，即选择器和样式声明

- **答案：C**

- **解析：** 选项 C 说法过于片面。CSS 的属性值不仅包含数值加单位（如 25px），还包含关键字（如 red, bold, center）、字符串、URL 等，并不局限于数值。

**7. 下列选项中，( ) 是包含选择器的语法。**

- **选项：** 

  A. 选择器 1 和选择器 2 之间用空格隔开，含义是所有选择器 1 中包含的选择器 2 

  B. "#"加上自定义的 id 名称 

  C. "."加上自定义的类名称 

  D. 用英文逗号分隔

- **答案：A**

- **解析：** 题目中的“包含选择器”通常指**后代选择器**。其语法是两个选择器之间用**空格**隔开，表示选中第一个元素内部的所有第二个元素。B 是 ID 选择器，C 是类选择器，D 用于分组选择器。

**8. 下列关于样式表的优先级的说法不正确的是 ( )。**

- **选项：**

  A. 直接定义在标签上的 CSS 样式级别最高 

  B. 内部样式表次之 

  C. 外部样式表的级别最低 

  D. 当样式中的属性重复时，先设的属性起作用

- **答案：D**

- **解析：** CSS 的“层叠”特性决定了当权重相同时，**后定义**的样式会覆盖先定义的样式（即“后来居上”）。选项 D 说“先设的起作用”是错误的。

**9. 选择具有 attr 属性且属性值以 value 开头的每个元素的属性选择器是 ( )。**

- **选项：** A. E1[attr^=value] B. E1[attr=value] C. E1[attr~=value] D. E1[attr|=value]
- **答案：A**
- **解析：** CSS 属性选择器中，`^=` 表示“以...开头”。
  - `^=` : 以指定值开头。
  - `=` : 完全等于。
  - `~=` : 包含指定词汇（空格分隔）。
  - `|=` : 以指定值开头并紧接连字符（常用于语言代码）。

**10. 下列 CSS 语法规则中正确的是 ( )。**

- **选项：** A. body:color=black B. {body;color:black} C. body{color:black} D. {body:color=black}
- **答案：C**
- **解析：** 标准的 CSS 规则集语法结构为：`选择器 { 属性: 值; }`。只有 C 符合该结构。

## Chapter 09 页面布局定位

**1. HTML 中的元素可分为块状元素和行内元素，其中 ( ) 是块状元素。**

- **选项：** A. `<p>` B. `<b>` C. `<a>` D. `<span>`
- **答案：A**
- **解析：** 
  - **块状元素 (Block-level)**：独占一行，默认宽度填满父容器。常见如 `<div>`, `<p>`, `<h1>`~`<h6>`, `<ul>`, `<li>` 等。
  - **行内元素 (Inline)**：不独占一行，宽度随内容而定。常见如 `<span>`, `<a>`, `<b>`, `<img>` 等。
  - 因此，只有 `<p>` 是块状元素。

**2. 在下列标签中不属于块状元素的是 ( )。**

- **选项：** A. `<br>` B. `<p>` C. `<div>` D. `<hr>`
- **答案：A**
- **解析：** 
  - `<p>` (段落)、`<div>` (区块)、`<hr>` (水平线) 都是典型的块状元素。
  - `<br>` 是换行标签，属于空元素，通常被归类在行内上下文中或者是特殊的换行符，它不是一个容器型的块状元素。

**3. 关于浮动，下列样式规则中不正确的是 ( )。**

- **选项：** 

  A. `img{float:left;margin:20px;}` 

  B. `img{float:right;right:30px;}` 

  C. `img{float:right;width:120px;height:80px;}` 

  D. `img{float:left;margin-bottom:2cm;}`

- **答案：B**

- **解析：** 

  - `float` 用于让元素浮动（脱离文档流但保留占位关系）。
  - `right`、`left`、`top`、`bottom` 是**定位属性**，通常配合 `position` (如 `relative`, `absolute`) 使用。
  - 对于一个仅设置了 `float` 的元素，设置 `right:30px` 是无效的（浏览器会忽略它），不符合浮动的常规搭配逻辑。其他选项搭配 `margin` 或宽高都是合法的。

**4. 在以下代码片段中，属于绝对定位的是 ( )。**

- **选项：** 

  A. `#box{width:100px;height:50px;}` 

  B. `#box{width:100px;height:50px;position:absolute;}` 

  C. `#box{width:100px;height:50px;position:static;}` 

  D. `#box{width:100px;height:50px;position:relative;}`

- **答案：B**

- **解析：** 

  - `position: absolute;` 表示绝对定位。
  - `static` 是默认值（静态定位）。
  - `relative` 是相对定位。

**5. 一个盒模型由 4 个部分组成，其中不包括 ( )。**

- **选项：** A. padding B. width C. border D. margin
- **答案：B**
- **解析：** CSS 标准盒模型由四个同心矩形区域组成：**内容 (Content)**、**内边距 (Padding)**、**边框 (Border)**、**外边距 (Margin)**。
  - **Width** 是内容区域的一个属性，不是盒模型结构的层级名称。

**6. 下面关于盒模型定位的说法中错误的是 ( )。**

- **选项：** A. 静态定位表示块状元素保持在标准文档流中原来的位置，不做任何移动 B. 相对定位是相对于元素的固有位置进行偏移，不会脱离标准文档流，也不会对其他元素产生任何影响 C. 绝对定位以最近的一个已定位的父级元素为基准，若无父级元素或父级元素未定位，则以浏览器窗口为基准 D. 绝对定位不会脱离标准文档流，也不影响同级元素的位置
- **答案：D**
- **解析：** 绝对定位 (`position: absolute`) 会使元素**完全脱离标准文档流**，不占据空间，因此会影响后续同级元素的排版（后续元素会无视它进行排列）。选项 D 说“不会脱离”是错误的。

**7. 下面的代码中包含 ( ) 个 BOX。**

- **选项：** A. 3 B. 4 C. 1 D. 2
- **答案：A**
- **解析：** 代码片段：`<div>` ... `<span>` ... `</span>` ... `<p>` ... `</p>` `</div>`
  - 在 CSS 中，每个 HTML 元素都会生成一个盒子。这里显式出现的标签有 `<div>`、`<span>`、`<p>`，共 **3** 个标签，对应生成 3 个主要的盒子（注：文字内容会生成匿名盒子，但此类题目通常考查元素标签数量）。

**8. 阅读下列代码片段，关于元素 `<div id="b">` 定位的说法正确的是 ( )。**

- **选项：** 

  A. 相对于浏览器窗体的右上角进行位置偏移 

  B. 相对于浏览器窗体的左上角进行位置偏移 

  C. 相对于自身的位置进行位置偏移

  D. 相对于元素 a 的左上角位置进行位置偏移

- **答案：B**

- **解析：** 

  - 元素 `#b` 设置了 `position: absolute;`。
  - 它的父元素 `#a` 设置了 `float: right;`，但**没有设置 `position`**（即默认为 `static`）。
  - 绝对定位元素会寻找最近的“已定位”（position 不为 static）的祖先元素作为参考基准。由于 `#a` 未定位，`#b` 会继续向上寻找，最终相对于**初始包含块**（通常是浏览器窗口/viewport）进行定位。
  - 代码中 `left:10px; top:10px;` 表示距离左边 10px，顶部 10px，即**左上角**。

**9. ( ) 盒模型显示方式是弹性伸缩盒。**

- **选项：** A. display:flex B. display:block C. display:inline D. display:inline-block
- **答案：A**
- **解析：** `display: flex` 用于开启 Flexbox 布局，即弹性伸缩盒模型。

**10. 以下关于包含块的说法中正确的是 ( )。**

- **选项：** 

  A. 包含块的作用是为绝对定位的元素提供定位基准 

  B. 包含块指的是绝对定位的父级容器 

  C. 包含块指的是相对定位的父级容器 

  D. 包含块指设置了 float 属性的元素

- **答案：A**

- **解析：**

  - **包含块 (Containing Block)** 是一个矩形框，作为子元素尺寸和定位的参考。
  - 对于**绝对定位 (Absolute)** 元素，其包含块由最近的 `position` 值不为 `static` 的祖先元素建立。如果没有这样的祖先，则参考初始包含块。
  - 选项 A 准确描述了包含块在定位上下文中的核心作用。选项 B 和 C 定义不准确，因为父级容器不一定是包含块（取决于 position 属性）。

## Chapter 10 元素外观属性

**1. 关于背景属性，下列说法中不正确的是 ( )。**

- **选项：** 

  A. 可以通过背景相关属性改变背景图片的原始尺寸大小 

  B. 可以对一个元素设置两张背景图片 

  C. 可以对一个元素同时设置背景颜色和背景图片 

  D. 在默认情况下背景图片会平铺，左上角对齐

- **答案：A**

- **解析：**

  - CSS3 中的 `background-size` 属性可以改变背景图片在**页面显示时**的尺寸，但无法改变图片文件的**原始物理尺寸**。这句话容易产生歧义，但在考核概念时，通常强调 CSS 只是改变渲染效果，不改变原图。
  - 选项 B：在 CSS3 中，通过逗号分隔可以给一个元素设置多张背景图，说法正确。
  - 选项 C：背景颜色和背景图片可以共存，图片会覆盖在颜色之上，说法正确。
  - 选项 D：默认属性 `background-repeat: repeat`（平铺）和 `background-position: 0% 0%`（左上角），说法正确。

**2. 下列选项中不属于 CSS 文本属性的是 ( )。**

- **选项：** A. font-size B. text-transform C. text-align D. line-height
- **答案：A**
- **解析：** CSS 属性分为不同的组别：
  - `font-size` 属于 **字体属性 (Font Properties)**，同组的还有 `font-family`, `font-weight` 等。
  - `text-transform` (文本转换)、`text-align` (文本对齐)、`line-height` (行高) 均属于 **文本属性 (Text Properties)**。

**3. 以下样式属性可以控制字体大小的是 ( )。**

- **选项：** A. text-size B. font-size C. text-style D. font-style
- **答案：B**
- **解析：** 控制字体大小的标准 CSS 属性是 **font-size**。`text-size` 不是有效的 CSS 属性。

**4. 下面不是 CSS3 增加的背景属性的是 ( )。**

- **选项：** A. background-origin B. background-clip C. background-size D. background-attachment
- **答案：D**
- **解析：**
  - `background-attachment`（定义背景是否随滚动条滚动）是 CSS1/CSS2 就有的属性。
  - `background-origin`（背景定位区域）、`background-clip`（背景绘制区域）、`background-size`（背景尺寸）都是 CSS3 新增的属性。

**5. 以下关于 CSS 样式中文本属性的说法，错误的是 ( )。**

- **选项：** A. font-size 用来设置文本的字体大小 B. font-family 用来设置文本的字体类型 C. color 用来设置文本的颜色 D. text-align 用来设置文本的字体形状
- **答案：D**
- **解析：** **text-align** 属性用于设置文本的**水平对齐方式**（如左对齐、居中、右对齐），而不是设置“字体形状”。设置字体形状（如斜体）使用的是 `font-style`。

**6. 定义外边框为双线表格，以下选项中正确的是 ( )。**

- **选项：** A. table{border: #000 3px double;} B. table{border: #000 3px solid;} C. td{border: #000 3px double;} D. td{border: #000 3px solid;}
- **答案：A**
- **解析：**
  - 题目要求设置“外边框”，因此选择器应针对 **table** 元素，而非 `td`（单元格）。
  - 题目要求“双线”，对应的边框样式值是 **double**。
  - 选项 B 是实线 (`solid`)，选项 C、D 是设置单元格边框。

**7. 以下选项中，用来设置背景图像的起始位置的样式属性是 ( )。**

- **选项：** A. background-image B. background-repeat C. background-position D. background-url
- **答案：C**
- **解析：** **background-position** 属性用于设置背景图像在元素中的起始位置（如 `top right`, `center`, 或具体的像素值）。

**8. 以下声明中，可以取消加粗样式的是 ( )。**

- **选项：** A. font-weight:bolder; B. font-weight:bold; C. font-weight:normal; D. font-weight:600;
- **答案：C**
- **解析：**
  - `font-weight` 属性控制字体粗细。
  - `bold` 和 `bolder` 以及 `600`（半粗）都表示加粗。
  - **normal**（对应的数值是 400）表示标准字体，即取消加粗。

**9. 关于 text-indent，下列描述错误的是 ( )。**

- **选项：** A. text-indent: 20px; B. text-indent: -20px; C. text-indent:left; D. text-indent:2em;
- **答案：C**
- **解析：** `text-indent`（首行缩进）的属性值必须是**长度单位**（如 `px`, `em`）或**百分比**。`left` 是对齐属性的值，不能用于缩进。

**10. 以下声明中，可以隐藏对象的是 ( )。**

- **选项：** A. display:block B. display:inline C. display:none D. display:inline-block
- **答案：C**
- **解析：** **display: none** 会将元素从文档流中完全移除，使其在页面上不可见且不占据空间。其他选项均为显示元素的布局模式。

## Chapter 11 伪类和伪元素

**1. 下面说法正确的是 ( )。**

- **选项：** A. 伪类可以直接定义并使用 B. 伪类选择元素是基于当前元素的内容 C. 伪元素可以对元素中的所有内容进行操作 D. 伪元素只应用于特定元素上
- **答案：A**
- **解析：** 
  - A 正确：伪类（如 `:hover`, `:first-child`）是 CSS 标准预定义的，可以直接在 CSS 选择器中使用，不需要修改 HTML 结构（不需要像类一样在 HTML 中添加 `class="..."`）。
  - B 错误：伪类通常是基于元素的状态（如 `:hover`）或在文档树中的位置（如 `:nth-child`），而不是基于内容（内容选择器如 `:has()` 是较新的特性且不完全普及）。
  - C 错误：伪元素通常用于样式化元素的**特定部分**（如 `::first-letter` 首字母）或插入内容，而不是操作“所有内容”。
  - D 错误：虽然某些伪元素（如 `::first-line`）有限制，但通用的伪元素如 `::before/::after` 可应用于绝大多数容器元素。

**2. 下面选择父元素的第 1 个子元素的是 ( )。**

- **选项：** A. E:nth-last-child(1) B. E:nth-child(1) C. E:last-child D. E:only-child
- **答案：B**
- **解析：** 
  - **E:nth-child(1)** 表示选择父元素下的第 1 个子元素，等同于 `E:first-child`。
  - `E:nth-last-child(1)` 和 `E:last-child` 都是选择最后一个子元素。
  - `E:only-child` 仅当父元素只有一个子元素时才匹配。

**3. 以下关于::after 伪元素的说法正确的是 ( )。**

- **选项：** A. ::after 伪元素在元素之后添加内容 B. ::after 伪元素只能应用于超链接标签 C. 使用::after 伪元素可能导致浮动元素塌陷 D. ::after 不可以在元素之后添加指定链接的文件内容
- **答案：A**
- **解析：** 
  - **A 正确**：`::after` 的作用就是在选中元素的内容（content）末尾插入由 `content` 属性指定的内容。
  - B 错误：它可以应用于任何非替换元素，不限于超链接。
  - C 错误：恰恰相反，`::after` 常被用于**清除浮动**（clearfix hack），即通过它来撑开父容器，解决高度塌陷问题。
  - D 错误：`content` 属性支持 `url()` 值，可以引入外部图片文件。

## Chapter 12 CSS3 变换、过渡和动画

**1. transform 默认坐标系统的原点位置是 ( )。**

- **选项：** A. 0% 0% B. 0% 50% C. 50% 50% D. 50% 0%
- **答案：C**
- **解析：** CSS `transform` 属性的变换原点由 `transform-origin` 属性定义。其默认值是 `50% 50%`，即元素的中心点。这意味着旋转或缩放默认是围绕元素中心进行的。

**2. transform 不能够对元素进行变换的是 ( )。**

- **选项：** A. 旋转 B. 缩放 C. 移动 D. 背景
- **答案：D**
- **解析：** CSS `transform` 属性支持的变换函数包括 `rotate()`（旋转）、`scale()`（缩放）、`translate()`（移动）和 `skew()`（倾斜）。“背景”是 `background` 属性控制的，不属于 `transform` 的变换函数。

**3. ( ) CSS 属性不能过渡。**

- **选项：** A. background-color B. border-color C. p D. text-shadow
- **答案：C**
- **解析：** 题目问的是哪个 CSS **属性**不能过渡。
  - `background-color`、`border-color` 和 `text-shadow` 都是标准的、可动画（Animatable）的 CSS 属性。
  - **p** 是一个 HTML 标签选择器，根本不是一个 CSS 属性，因此无法对其进行“过渡”设置。

**4. 要实现 transition 效果，下面说法中错误的是 ( )。**

- **选项：** A. 必须确定效果添加到哪个 CSS 样式属性上 B. 必须声明效果的持续时间 C. 必须定义什么时候触发 D. 不能同时对多个 CSS 样式属性进行效果过渡
- **答案：D**
- **解析：** `transition` 属性完全支持同时对多个属性进行过渡。语法上使用逗号分隔即可，例如：`transition: width 1s, height 2s;` 或者使用 `all` 关键字。因此 D 的说法是错误的。

**5. 关于 animation，下面说法中错误的是 ( )。**

- **选项：** A. 用@keyframes 创建动画 B. 必须在元素样式中通过 animation 属性使用@keyframes 创建动画，否则不会产生生动画效果 C. 关键帧的合法值是 0~100 D. animation 属性至少需要规定动画的名称和动画的时间
- **答案：C**
- **解析：**
  - 在 `@keyframes` 中定义关键帧时，合法的时间节点值必须是**百分比**（如 `0%`, `50%`, `100%`）或者是关键字 `from` 和 `to`。单纯的数字 `0~100`（不带 %）是不合法的语法。
  - 选项 D 是正确的，因为如果不指定动画名称（`animation-name`）动画无法引用，如果不指定持续时间（`animation-duration`），默认值为 0s，动画也不会播放。

## Chapter 13 默认样式和页面内容样式设计

基于您提供的第六张图片（`image_d23a8d.png`），以下是整理好的题目、答案及简要解析：

**1. 下面说法中正确的是 ( )。**

- **选项：** A. HTML 标签即使没有定义样式，也会呈现一定的样式 B. HTML 没有设定默认样式 C. 不同的浏览器定义的默认样式没有差别 D. li 默认以 block 显示
- **答案：A**
- **解析：** - 选项 A 正确：浏览器都有内置的“用户代理样式表”（User Agent Stylesheet），即使开发者不写任何 CSS，`<h1>` 也会显示为大号加粗，`<a>` 会显示为蓝色下划线等。
  - 选项 B 错误：浏览器有默认样式。
  - 选项 C 错误：不同浏览器（如 Chrome, Firefox, Safari）的默认样式表存在细微差异（例如 margin、padding 的默认值可能不同），这也是 CSS Reset 或 Normalize.css 存在的意义。
  - 选项 D 错误：`<li>` 元素的默认 `display` 属性值是 `list-item`，而不是 `block`（虽然它也是块级容器，但在 CSS 属性值上有所区别）。

**2. 浏览器默认的字体大小是 ( )。**

- **选项：** A. 12px B. 14px C. 16px D. 18px
- **答案：C**
- **解析：** 绝大多数现代浏览器（Chrome, Firefox, Edge 等）的默认根字体大小（font-size）都是 **16px**。

**3. 导航菜单一般来说有 ( ) 类。**

- **选项：** A. 1 B. 2 C. 3 D. 4
- **答案：B**
- **解析：** 在 Web 前端开发教材中，导航菜单通常根据布局方向分为两大类：
  1. **横向导航菜单**（Horizontal Navigation）：通常位于页面顶部。
  2. **纵向导航菜单**（Vertical Navigation）：通常位于页面左侧或右侧作为侧边栏。

## Chapter 14 网站制作流程与发布

**1. 下面说法中错误的是 ( )。**

- **选项：** A. 创建站点要确定站点文件的存放位置和目录结构，要合理安排文件的目录 B. 建立网站首先要了解客户的业务背景、目标和需求 C. 网站的所有页面保证在 IE 浏览器里能较好地呈现就可以了 D. 首页设计先要确定功能模块，然后进行页面布局
- **答案：C**
- **解析：** 现代 Web 开发必须考虑跨浏览器兼容性（如 Chrome, Firefox, Safari, Edge 等），不仅要适配 PC 端还要适配移动端。IE 浏览器技术陈旧且市场占有率极低，仅保证 IE 能显示不仅无法满足绝大多数用户需求，也是不符合 Web 标准的做法。

**2. 下列关于模板的说法错误的是 ( )。**

- **选项：** A. 模板是一种特殊类型的文档，用于设计“固定内容” B. 一个站点建立一个模板就可以了 C. 可以基于模板创建站点的页面 D. 使用模板是为了方便建立每个页面都重复的内容
- **答案：B**
- **解析：** 一个稍微复杂一点的网站通常包含多种不同结构的页面（例如：首页、文章详情页、产品列表页、联系我们页等），这些页面布局差异较大，因此通常需要建立多个不同的模板，而不是仅建立一个模板。

**3. Tomcat 默认的 HTTP 协议端口是 ( )。**

- **选项：** A. 80 B. 8080 C. 86 D. 8086
- **答案：B**
- **解析：** Apache Tomcat 服务器默认的 HTTP 服务监听端口是 **8080**。
  - 80 是标准 HTTP 服务的默认端口（如 IIS, Nginx, Apache HTTPD）。
  - 如果需要通过域名直接访问而不带端口号，通常会修改 Tomcat 配置或通过反向代理将 80 转发到 8080。

## Chapter 15 JavaScript 和 ECMAScript 基础

**1. 运行下面的 JavaScript 代码，sM 的值为 ( )。**

```javascript
iNum=11;
sStr="number";
sM=iNum+sStr;
```

- **选项：** A. 11number B. Number C. 11 D. 程序报错
- **答案：A**
- **解析：** 在 JavaScript 中，当加号 (`+`) 运算符的一侧是字符串时，它执行的是**字符串拼接**操作而不是数学加法。数字 `11` 会被转换为字符串 `"11"`，然后与 `"number"` 拼接，结果为 `"11number"`。

**2. 在 HTML 页面中使用外部 JavaScript 文件的正确语法是 ( )。**

- **选项：** 

  A. `<language="JavaScript" src="sf.js">` 

  B. `<script src="sf.js"></script>` 

  C. `<script language="JavaScript"=sf.js></script>`

  D. `<language src="sf.js">`

- **答案：B**

- **解析：** 引入外部 JavaScript 文件的标准 HTML 标签是 `<script>`，并通过 `src` 属性指定文件路径。标签必须闭合。`language` 属性已废弃（且语法也不对），应使用 `type="text/javascript"`（HTML5 中可省略）。

**3. 运行下面的 JavaScript 代码，警告框中显示 ( )。**

```javascript
x=3;
y=2;
z=(x+2)/y;
alert(z);
```

- **选项：** A. 2 B. 2.5 C. 32/2 D. 16
- **答案：B**
- **解析：** 计算表达式 `(3 + 2) / 2`，即 `5 / 2`。JavaScript 中的数字类型是浮点型，除法运算会保留小数部分，因此结果是 `2.5`，而不是整数 `2`。

**4. 分析如下的 JavaScript 代码片段，b 的值为 ( )。**

```javascript
var a=1.5,b;
b=parseInt(a);
```

- **选项：** A. 2 B. 0.5 C. 1 D. 1.5
- **答案：C**
- **解析：** `parseInt()` 函数解析一个字符串或数字，并返回一个整数。它会截断小数部分，而不是四舍五入。因此 `parseInt(1.5)` 的结果是 `1`。

**5. 若定义 var iX=10，则 ( ) 语句执行后变量 iX 的值不等于 11。**

- **选项：** A. iX++; B. iX=11; C. iX==11; D. iX+=1;
- **答案：C**
- **解析：** 
  - A (`iX++`)：自增运算，`iX` 变为 11。
  - B (`iX=11`)：赋值运算，`iX` 变为 11。
  - C (`iX==11`)：**比较运算**，判断 `iX` 是否等于 11，返回 `false`，但**不会改变** `iX` 变量本身的值，所以 `iX` 仍为 10。
  - D (`iX+=1`)：加法赋值，`iX` 变为 11。

## Chapter 16 算法和 ECMAScript 语句

**1. 作为 if 语句，下面 ( ) 是正确的。**

- **选项：** A. if(x=2) B. if(y<7){} C. else D. if(x==2&&){}
- **答案：B**
- **解析：** - A 选项 `x=2` 是赋值表达式，虽然语法上可能不报错（结果为 true），但这通常是逻辑错误，不是标准的判断语句写法。
  - C 选项 `else` 必须紧跟在 `if` 语句之后，不能单独存在。
  - D 选项 `&&` 后面缺少操作数，语法错误。
  - B 选项符合标准的 `if` 语句语法结构：`if (条件) { 代码块 }`。

**2. 下列关于循环语句的描述中，( ) 是错误的。**

- **选项：** A. 循环体内可以包含有循环语句 B. 循环体内必须同时出现 break 和 continue 语句 C. 循环体内可以出现 if 语句 D. 循环体可以是空语句
- **答案：B**
- **解析：** `break` 和 `continue` 是可选的跳转语句，用于控制循环流程，并不是循环体必须包含的成分。

**3. 下列 JavaScript 循环语句中 ( ) 是正确的。**

- **选项：** A. if(i<10;i++) B. for(i=0;i<10) C. for i=1 to 10 D. for(i=0;i<=10;i++)
- **答案：D**
- **解析：** JavaScript 中 `for` 循环的标准语法是 `for (初始化; 条件; 迭代) { ... }`。
  - A 混淆了 `if` 和 `for` 的语法。
  - B 缺少了迭代部分和分号，语法不完整。
  - C 是类似 Visual Basic 或 Pascal 的语法，不是 JS 语法。
  - D 符合标准 JS 语法。

**4. 下面语句中要使 while 循环体执行 10 次，在空白处应填写 ( )。**

```javascript
var iCv=0;
while(    ){
  iCv+=2; }
```

- **选项：** A. `iCv<10` B. `iCv<=10` C. `iCv<20` D. `iCv<=20`
- **答案：C**
- **解析：** 变量 `iCv` 初始值为 0，每次循环增加 2。
  - 第 1 次：0 (进入) -> 变为 2
  - ...
  - 第 10 次：18 (进入) -> 变为 20
  - 第 11 次：20 (应不进入)
  - 因此判断条件应允许 0 到 18 进入，而在 20 时停止。`iCv < 20` 符合此要求。

**5. 循环语句 for(var i=0;i=1;i++){} 的循环次数是 ( )。**

- **选项：** A. 0 B. 1 C. 2 D. 无限
- **答案：D**
- **解析：** 在 `for` 循环的条件判断部分写的是 `i=1`。这是一个**赋值表达式**，而非比较表达式（`i==1`）。该表达式会将 `i` 赋值为 1，并返回 1。在 JavaScript 中，数字 1 被视为真值（true）。因此，循环条件永远为真，导致**死循环（无限循环）**。

## Chapter 17 行为与对象

**1. 分析下面的 JavaScript 代码段，输出结果是 ( )。**

```javascript
var aArr=new Array(2,3,4,5,6);
var iSum=0;
for(var iCv=1;iCv<aArr.length;iCv++){
  iSum+=aArr[iCv]; }
document.write(iSum);
```

- **选项：** A. 20 B. 18 C. 14 D. 12
- **答案：B**
- **解析：**
  - 数组 `aArr` 包含 5 个元素 `[2, 3, 4, 5, 6]`，对应索引为 0 到 4。
  - `for` 循环中的变量 `iCv` 初始值为 **1**，而不是 0。这意味着循环会跳过数组的第一个元素（索引 0 的值 2）。
  - 循环累加的过程如下：
    - iCv=1: 加 `aArr[1]` (即 3)，iSum = 3
    - iCv=2: 加 `aArr[2]` (即 4)，iSum = 7
    - iCv=3: 加 `aArr[3]` (即 5)，iSum = 12
    - iCv=4: 加 `aArr[4]` (即 6)，iSum = 18
  - 最终输出结果为 18。

**2. 分析下面的 JavaScript 代码段，输出结果是 ( )。**

```javascript
var sStr="I am a student";
var sA=sStr.charAt(9);
document.write(sA);
```

- **选项：** A. I am a st B. u C. udent D. t
- **答案：B**
- **解析：**
  - `charAt(index)` 方法返回指定索引位置的字符。
  - 字符串索引从 0 开始。字符串 `"I am a student"` 的索引对应如下：
    - 0-8: "I am a st"
    - 9: "u"
  - 因此 `charAt(9)` 获取的是字符 `u`。

**3. 以下 ( ) 表达式产生一个 0~7 (含 0、7) 的随机整数。**

- **选项：** A. Math.floor(Math.random()*6) B. Math.floor(Math.random()*7) C. Math.floor(Math.random()*8) D. Math.ceil(Math.random()*8)
- **答案：C**
- **解析：**
  - `Math.random()` 生成 `[0, 1)` 之间的随机小数。
  - 要生成 `0` 到 `N` 的随机整数，公式通常为 `Math.floor(Math.random() * (N + 1))`。
  - 题目要求 0~7，即 N=7，所以需要乘以 8。
  - `Math.random() * 8` 生成 `[0, 8)` 的小数，向下取整 (`Math.floor`) 后得到 `{0, 1, 2, 3, 4, 5, 6, 7}`。

**4. 产生当前日期的方法是 ( )。**

- **选项：** A. Now() B. Date() C. new Date() D. new Now()
- **答案：C**
- **解析：**
  - 在 JavaScript 中，创建一个表示当前日期和时间的日期对象，标准做法是使用 `new` 关键字调用构造函数：`new Date()`。
  - `Date()`（不带 new）会返回当前日期的字符串形式，但在面向对象编程语境下，实例化对象通常是考点。
  - `Now()` 不是标准的 JavaScript 方法（是 VBScript 等语言的用法）。

**5. 在页面上，当按下键盘的任意一个键时都会触发 JavaScript 的 ( ) 事件。**

- **选项：** A. onFocus B. onBlur C. onSubmit D. onKeyDown
- **答案：D**
- **解析：**
  - **onKeyDown**：用户按下键盘按键时触发。
  - `onFocus`：元素获得焦点时触发。
  - `onBlur`：元素失去焦点时触发。
  - `onSubmit`：表单提交时触发。

## Chapter 18 DOM

基于您提供的最后一张图片（`image_d250d2.jpg`），以下是整理好的题目、答案及简要解析：

**1. 下列不属于访问指定节点的方法的是 ( )。**

- **选项：** A. obj.value B. getElementByTagName C. getElementByName D. getElementById
- **答案：A**
- **解析：** B、C、D 均属于 Document 对象用于获取页面元素节点的方法（虽然 B 和 C 在标准中应为复数形式 `getElementsByTagName` 和 `getElementsByName`，但在此语境下显然指代这些方法）。**obj.value** 是获取表单元素 `value` 属性值的属性访问操作，而不是查找节点的方法。

**2. 在 JavaScript 中，关于 Document 对象的方法下列说法中正确的是 ( )。**

- **选项：** A. getElementById()是通过元素 ID 获得元素对象，返回值为单个对象 B. getElementByName()是通过元素 name 获得元素对象，返回值为单个对象 C. getElementById()是通过元素 ID 获得元素对象，返回值为对象组 D. getElementByName()是通过元素 name 获得元素对象，返回值为单个对象
- **答案：A**
- **解析：** - **getElementById()**：ID 在页面中是唯一的，所以该方法返回的是匹配的**单个元素对象**。
  - **getElementsByName()**：name 属性在页面中可能重复（如单选按钮），所以该方法返回的是一个**节点列表 (NodeList/Collection)**，即对象组，而不是单个对象。
  - 因此只有 A 选项描述正确。

**3. 对于下面的标签，document.getElementById("info").innerHTML 语句返回的值是 ( )。**

HTML

```html
<div id="info" style="display.block"><p>请填写</p></div>
```

- **选项：** A. 请填写 B. `<p>请填写</p>` C. `id="info" style="display.block"` D. `<div id="info" style="display.block"><p>请填写</p>`
- **答案：B**
- **解析：** **innerHTML** 属性获取的是元素起始标签和结束标签之间的所有 HTML 内容。对于本题中的 `div`，其内部包裹的是 `<p>请填写</p>`。A 是 `innerText` 的结果，D 包含了自身的标签（这是 `outerHTML` 的特性）。

**4. CSS 样式的属性名为 background-image，对应的 Style 对象的属性名是 ( )。**

- **选项：** A. background B. backgroungImage C. Image D. background-image
- **答案：B**
- **解析：** 在 JavaScript 中访问 CSS 属性时，带有连字符 `-` 的 CSS 属性名（如 `background-image`）需要转换为**驼峰命名法 (camelCase)**。即去掉连字符，并将连字符后的第一个字母大写。因此对应的是 **backgroundImage**。（注：选项 B 中拼写为 `backgroungImage`，属于常见的印刷错误，但根据命名规则它是唯一符合逻辑的选项）。

**5. 如果在页面中包含以下图片标签，则下列选项中的 ( ) 语句能够实现隐藏该图片的功能。**

```html
<img id="pic" src="Sunset.jpg" width="400" height="300" />
```

- **选项：** 

  A. `document.getElementById("pic").style.display="visible"; `

  B. `document.getElementById("pic").style.display="enabled"; `

  C. `document.getElementById("pic").style.display="block"; `

  D. `document.getElementById("pic").style.display="none";`

- **答案：D**

- **解析：** 要通过 `display` 属性隐藏元素，应将其值设置为 **"none"**。

  - `block` 是显示为块级元素。
  - `visible` 是 `visibility` 属性的值，不是 `display` 的合法值。
  - `enabled` 不是标准的 CSS 显示属性值。

## Chapter 19 HTML DOM 对象和 RegExp 对象

**1. 网页中有一个窗体，名称是 mainForm，该窗体对象的第 1 个元素是按钮，名称是 myButton，表述该按钮对象的方法是 ( )。**

- **选项：** A. document.forms.myButton B. document.mainForm.myButton C. document.forms[0].element[0] D. 以上都可以
- **答案：B**
- **解析：** - 选项 B 使用了 DOM Level 0 的传统访问方式，即 `document.表单名.元素名`，这是访问特定命名表单下特定命名元素的标准简便方法。
  - 选项 A 试图直接从 `forms` 集合访问元素，语法错误。
  - 选项 C 拼写错误（应为 `elements`），且不如 B 直观。

**2. 不能与 onChange 事件处理相关联的表单元素有 ( )。**

- **选项：** A. 文本框 B. 复选框 C. 列表框 D. 按钮
- **答案：D**
- **解析：** - `onChange` 事件在元素的值发生改变并失去焦点时触发。
  - 文本框（值改变）、复选框（选中状态改变）、列表框（选项改变）都支持此事件。
  - **按钮 (Button)** 通常响应 `onClick`（点击）事件，不存在“值改变”的用户交互过程。

**3. 关于正则表达式声明 6 位数字邮编，以下代码正确的是 ( )。**

- **选项：** A. var reg = /\d6/; B. var reg = \d{6}; C. var reg = /\d{6}/; D. var reg = new RegExp("d{6}");
- **答案：C**
- **解析：** - JavaScript 正则表达式字面量使用 `/.../` 包裹。
  - `\d` 代表数字，`{6}` 代表重复 6 次。所以 `/\d{6}/` 是正确的。
  - A 匹配的是数字后跟一个字符 '6'。
  - B 语法错误。
  - D 使用构造函数时，字符串内的反斜杠需要转义，应写为 `new RegExp("\\d{6}")`。

**4. 在下面的 JavaScript 语句中，( ) 实现检索当前页面的表单元素中的所有文本框，并将它们全部清空。**

- **选项：** 

  A.

  ```javascript
  for(var i=0;i<form1.elements.length;i++){
      if(form1.elements[i].type=="text")
          form1.elements[i].value="";}
  ```

  B.

  ```javascript
  for(var i=0;i<document.forms.length;i++){
      if(forms[0].elements[i].type=="text")
          forms[0].elements[i].value="";}
  ```

  C.

  ```javascript
  if(document.form.elements.type=="text")
      form.elements[i].value="";
  ```

  D.

  ```javascript
  for(var i=0;i<document.forms.length; i++){
      for(var j=0;j<document.forms[i].elements.length; j++){
          if(document.forms[i].elements[j].type=="text")
              document.forms[i].elements[j].value="";  }
      }
  ```

- **答案：D**

- **解析：** - 题目要求检索“当前页面”的所有文本框，页面可能包含多个表单。

  - 选项 D 使用了双重循环：外层循环遍历页面上的每一个表单 (`document.forms`)，内层循环遍历每个表单中的每一个元素 (`elements`)，并检查其 `type` 是否为 `text`，逻辑最为完整和通用。
  - A 仅针对名为 `form1` 的表单。

**5. 在表单 (form1) 中有一个文本框元素 (fname)，用于输入电话号码，格式如 010-82668155，要求前 3 位是 010，紧接一个“-”，后面是 8 位数字。在提交表单时，根据上述条件验证该文本框中输入内容的有效性，其中 ( ) 能实现。**

- **选项：**

  A.

  ```javascript
  var str=form1.fname.value;
  if(str.substr(0,4)!="010-" || str.substr(4).length!=8 ||
  isNaN(parseFloat(str.substr(4))))
      alert("无效的电话号码！");
  ```

  B.

  ```javascript
  var str=form1.fname.value;
  if(str.substr(0,4)!="010-" && str.substr(4).length!=8 &&
  isNaN(parseFloat(str.substr(4))))
      alert("无效的电话号码！");
  ```

  C.

  ```javascript
  var str=form1.fname.value;
  if(str.substr(0,3)!="010-" || str.substr(3).length!=8 ||
  isNaN(parseFloat(str.substr(3))))
      alert("无效的电话号码！");
  ```

  D.

  ```javascript
  var str=form1.fname.value;
  if(str.substr(0,4)!="010-" && str.substr(4).length!=8 &&
  !isNaN(parseFloat(str.substr(4))))
      alert("无效的电话号码！");
  ```

- **答案：A**

- **解析：** - 验证无效（报错）的逻辑应该是满足以下任意一个错误条件：

  1. 前缀不是 "010-" (`str.substr(0,4)!="010-"`)。
  2. 或者 (`||`) 剩余部分的长度不是 8 位 (`str.substr(4).length!=8`)。
  3. 或者 (`||`) 剩余部分不是数字 (`isNaN(...)`)。

  - 选项 A 正确使用了逻辑或 (`||`) 连接这三个错误条件。
  - 选项 C 中 `substr(0,3)` 取出的是 3 个字符，永远不可能等于 4 个字符的 "010-"，逻辑错误。

## Chapter 20 HTML5 DOM

**1. 对于 Canvas 对象，下列关于路径绘制的说法错误的是 ( )。**

- **选项：** A. 开始要创建路径 B. 路径创建完成后需要关闭 C. 设定绘制样式，调用绘制方法 D. 不必使用图形上下文
- **答案：D**
- **解析：** Canvas 绘图的核心机制就是基于**上下文 (Context)**。开发者必须先通过 JavaScript 获取 `<canvas>` 元素的渲染上下文（例如 `getContext('2d')`），然后调用该上下文对象的方法（如 `moveTo`, `lineTo`, `stroke` 等）来进行绘制。脱离了上下文是无法操作 Canvas 进行绘图的，因此 D 的说法是错误的。

**2. 在绘制图形的时候要用到图形上下文，需要使用 Canvas 对象的 ( ) 方法获得。**

- **选项：** A. getContext() B. fillRect() C. strokeRect() D. drawImage()
- **答案：A**
- **解析：**
  - **getContext()** 是 DOM 中 `<canvas>` 元素的方法，用于获取画布的渲染上下文（Context）。
  - `fillRect`、`strokeRect`、`drawImage` 都是获取到的上下文对象（Context）中用于具体绘图的方法。

**3. 元素在拖放过程中触发了多个事件，( ) 事件不必进行处理。**

- **选项：** A. ondragstart B. ondragover C. ondrop D. ondragend

- **答案：D**

- **解析：** 要实现一个最基本的拖放（Drag and Drop）功能，通常必须处理以下三个事件：

  1. **ondragstart**：定义拖拽开始时的数据（`dataTransfer.setData`）。
  2. **ondragover**：默认情况下浏览器不允许在元素上放置数据，必须在此事件中阻止默认行为（`event.preventDefault()`）才能允许放置。
  3. **ondrop**：在放置发生时处理数据（`dataTransfer.getData`）。

  - **ondragend** 事件在拖拽操作结束（无论成功或取消）时触发，通常用于清理工作（如移除样式），对于完成核心的数据传输功能并非严格必须。