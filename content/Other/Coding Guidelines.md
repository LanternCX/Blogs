# 浅谈关于 C++ 的码风以及编码规范

主要总结我现在正在使用的 C++ 编码风格规范

主要参考资料：

1. [Alibaba-P3C](https://github.com/alibaba/p3c): 阿里巴巴 Java 开发手册，详细结合了中文互联网开发环境的 Java 开发规范
2. [Google-C++风格指南](https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/contents.html)：Google 的开发风格指南系列
3. [Bilibili-【代码美学】系列](https://space.bilibili.com/1629390/lists/1068921)：以视频的方式讲述了开发过程中写出优雅的代码的方法

## 命名约定

这一部分可以参考[Bilibili:【熟】代码美学：在代码中取名](https://www.bilibili.com/video/BV1nP4y1v7ww/)

函数、变量、文件、结构体与类命名尽量简短，尽量不使用缩写，要清晰易懂。

名称长度控制在 5 个单词以内，对于常用类名与文件名控制在两个单词以内，以一个单词为最佳。

所有编程相关的命名严禁使用拼音与英文混合的方式，更不允许直接使用中文的方式，纯拼音的命名也应该尽量少用。

### 变量

#### snake_case and camelCase

视我项目依赖的库使用**小写下划线**（`snake_case`）命名或者**小驼峰**（`camelCase`）命名。但是全项目统一命名。

例如我的项目主要依赖 `c++ stl` 库或者逐飞库，为了与这些库统一命名风格，我会使用 `snake_case`。

如果我的项目主要依赖 `opencv` 或者 `Arduino` 之类的库，我则会选择使用 `camelCase` 命名。

但是由于 `C++` 开发过程当中很多库的命名规范本身就不统一，实际上我会在写嵌入式或者较为底层的代码的时候使用这一领域较为常见的 `snkae_case` ，而一些较为上层的代码，例如 `OpenCV` 之类的项目，则会使用 `camelCase`。

例如我的项目[DebugLab-2024-Freshman-Project/src/page/Menu.cpp](https://github.com/LanternCX/DebugLab-2024-Freshman-Project/blob/main/src/page/Menu.cpp)，就使用了 `camelCase`：

```c++
void Menu::excute() {
    // Switch function
    if (key == '*' && isShow) {
        currentIdx += 1;
        currentIdx %= size;
        currentPage = pages[currentIdx];
    }
...
```

而 2025 智能车赛的代码 [SmartCar2025-Main/project/main/control/Motor.cpp](https://github.com/LanternCX/SmartCar2025-Main/blob/master/project/main/control/Motor.cpp)，就使用了 `snake_case`

```c++
...
pid.kp = 0.00;
pid.ki = 10.00;
pid.kd = 0.00;

pid.p_max = 30.0;
pid.i_max = 30.0;
pid.d_max = 30.0;
...
```

重点就是风格的统一，尽量不要混用。

#### 特殊变量的命名

1. **布尔谓词**

   - `is_xxx` 表示一种状态：`is_valid`, `is_admin`

   - `has_xxx` 表示是否拥有：`has_children`, `has_permission`

   - `can_xxx` 表示能力：`can_execute`, `can_edit`

   - `should_xxx` / `need_xxx` 表示必要性：`should_update`, `need_restart`

   - 形容词或过去分词：`enabled`, `connected`, `completed`

   ```c++
   // 普通判断
   bool is_valid = false;
   if (is_valid) {
       std::cout << "Valid" << std::endl;
   }
   ```

2. **计数数量类**

   - 常用：数量 `count`, 数量 `num`, 大小 `size`, 长度 `length`, 总量 `total`, 求和 `sum`

   - 缩写：`count` 缩写 `cnt`，`size` 缩写 `siz`，`total` 缩写 `tot`

   ```c++
   // 统计奇数
   int n = 10, cnt = 0;
   std::vector<int> arr(n);
   for (int x : arr) {
       cnt += x % 2;
   }
   ```

3. **索引位置类**

   - 常用：索引 `index`, 位置 `position`, 偏差 `offset`, 光标 `cursor`, 前缀`prefix`, 后缀 `suffix`

   - 缩写：`index` 缩写 `idx`，`position` 缩写 `pos`，`prefix` 缩写 `pre`，`suffix` 缩写 `suf`

   ```c++
   // 暴力搜索
   int n = 10, idx = 0;
   const int target = 10;
   std::vector<int> arr(n);
   for (int i = 0; i < n; i++) {
       if (arr[i] == target) {
           idx = i;
           break;
       }
   }
   ```

4. **临时中值类**

   - 常用：临时 `temp`, 缓冲 `buffer`, 缓存 `cache`, 结果 `result`, 值 `value`, 最大值 `max`, 最小值 `min`

   - 缩写：`temp` 缩写 `tmp`, `buffer` 缩写 `buf`, `result` 缩写 `res`，`value` 缩写 `val`

   ```c++
   // 二元交换
   void swap2(int &a, int &b) {
       int temp = a;
       a = b;
       b = temp;
   }
   ```

5. **循环迭代类**

   - 常用：`i`, `j`, `k`, 列 `col`, 行 `row`,  迭代器  `iterator`, 节点 `node`

   - 缩写：`iterator` 缩写 `iter` 或 `it`, `node` 缩写 `nd`

   ```c++
   // 结构体定义与搜索
   struct Node {
       int idx, val;
   };
   int main() {
       int n = 10;
       std::vector<Node> arr(n);
       auto it = std::lower_bound(arr.begin(), arr.end());
       node nd = *it;
   }
   ```

   实际上写这样的代码比较偏向竞赛风格，在实际工程应用中，建议使用对象真正的名字命名

6. **标志状态类**

   - 常用：标志 `flag`, 状态 `status`, 状态 `state`, 模式 `mode`, 类型 `type`, 等级 `level`
   - 缩写：`flag` 缩写 `flg`, `status` 缩写 `stat`

   ```c++
   // 维护搜索状态
   int n = 10;
   bool flag = false;
   std::vector<int> arr(n);
   for (int x : arr) {
       if (x == 1) {
           flag = true;
       }
   }
   std::cout << flag ? "Yes" : "No" << std::endl;
   ```

7. **数据集合类**

   - 常用：`list`, `array`, `map`, `set`, `dictionary`, `queue`, `stack`
   - 缩写：`list` 缩写 `li`, `array` 缩写 `arr`,  `dictinary` 缩写 `dict`

   ```c++
   // 一般容器使用
   struct Dog {
       int health, strength;
   } 
   int n = 0;
   std::vector<Dog> dogArray(n);
   ```

   一般为了避免与 C++ 中的一些关键字冲突导致的迷惑，我们常常使用缩写或者**对象+容类型**的形式命名。

还有很多诸如此类的变量命名实例，通常可以从开源代码中学习得到，不一一赘述。

#### 指针变量

指针变量一般带后缀 `_ptr`，以达到和别的变量的区分

```c++
int* data_ptr;
```

但是实际开发中我一般会在非必要的时候尽量避免指针的使用，以避免一些操作值与操作址区别上带来的一些困惑。

### 类与结构体

类与结构体使用**大驼峰法（`PascalCase`）**命名

```c++
// 类
class File {
   public:
    void open(const std::string& path);
};
// 枚举
enum class LogLevel {
    INFO,
    WARN,
    ERROR
}
// 结构体
struct Point {
    double x;
    double y;
};
```

### 函数

函数与变量类似，命名风格同样遵循 `camelCase` 或者 `snake_case`的命名。

**静态函数**的命名一般直接描述算法：

```c++
static int gcd(int a, int b);
static double pow(double base, int exp);
```

属性值操作的接口函数应该以`get`、`set`、`update`等动词开头：

```c++
int getAge();
void setName(const std::string& name);
```

一般函数命名的语法结构应该是`<谓语>+<主语>`的形式：

```c++
int getOffset(int now, int target);
```

类与结构的成员函数可以省去主语：

```c++
class File {
   public:
    void open(const std::string& path);
};
```

### 常量

常量的命名使用**全大写下划线**方式命名：

```c++
#define MAX_SPEED 30
const int MAX_HEIGHT = 60;
```

并且在开发过程中要尽量杜绝**魔法值**，使用常量维护：

```c++
// 正例
const int MIN_OFFSET = 10;
if (offset < MIN_OFFSET) {
    std::cout << "exceed" << std::endl;
}
// 反例
if (offset < 10) {
    std::cout << "exceed" << std::endl;
}
```

## 格式

### 空格与缩进

#### 缩进

统一使用 **2 缩进**或者 **4 缩进**，统一就好

1. **2 缩进**，每一层代码块前空 **2 个空格**：

```c++
int main() {
  int a = 10;
  if (a > 0) {
    printf("Positive\n");
  }
  return 0;
}
```

2. **4 缩进**，每一层代码块前空 **4 个空格**：

```c++
int main() {
    int a = 10;
    if (a > 0) {
        printf("Positive\n");
    }
    return 0;
}
```

我一般采用 4 缩进格式。

值得一提的是，在 C++ 类的 `public` 和 `private` 等关键字处一般会采用 **3 + 1 缩进**

```c++
class File {
   public:
    void open(const std::string& path);
};
```

例如这段代码的 `public` 关键字采用了 3 缩进，`void` 相对 `public` 关键字采用了 1 缩进，总共还是 4缩进

#### 空格

合理的空格能够将代码结构撑开，以增加代码的美观性与可读性。

1. **操作符两边**：

   ```c++
   int a = 0;
   a += 10;
   if (a > 10 && a < 10) {
       return 0;
   }
   ```

2. **关键字与括号之间**

   ```c++
   if (a > 0) { }
   for (int i = 0; i < n; i++) { }
   while (true) { }
   ```

3. **逗号后面**

   ```c++
   int arr[3] = {1, 2, 3};
   void fun(int a, int b, int c) { }
   ```

4. **类型与变量之间**

   ```c++
   int count = 0;
   double average = 0.0;
   std::string name = "Tom";
   ```

5. **指针和引用符号**

   ```c++
   // 星号靠类型
   int* ptr1;
   // 星号靠变量
   int *ptr2;
   /// 引用靠变量
   int &ref = a;
   ```

   风格统一即可，没有强制性要求。

#### 不省略大括号

尽管 C++ 允许只存在单一语句的循环与判断语句可以不使用大括号：

```c++
if (a < 0) std::cout << "Less" << std::endl;
while (true) cnt++;
```

但是实际上大括号有助于解耦代码各个层次间的关系，增加代码可读性，因此所有支持省略大括号的语法都不建议省略。

另外，对于所有压缩行数的写法都不建议使用，不仅不好看还会降低代码可读性：

```c++
// 正例
if (a < 0) {
  	std::cout << "Less" << std::endl;
}
// 反例
if (a < 0) std::cout << "Less" << std::endl;
if (a < 0) { std::cout << "Less" << std::endl; }
```

在一些特殊情况也可以通过增加大括号的方式分离代码层次：

```c++
int cnt = 0;
{
    // add cnt to 10
    while (cnt >= 0 && cnt < 10) {
        cnt++;
    }
    if (cnt < 10) {
        return;
    }
}
```

#### Allman and K&R

1. **Allman 风格**：左大括号单独占一行

   ```c++
   int sum(int a, int b)
   {
       int result = a + b;
       return result;
   }
   ```

   优点在于层次清晰，缺点就是会导致代码的无意义行过于冗长。

2. **K&R 风格**：左大括号不单独占一行

   ```c++
   int sum(int a, int b) {
       int result = a + b;
       return result;
   }
   ```

   节省行数，代码更紧凑，层次较为清晰，相比 Allman 风格也更为常见。

实际上，相比其他语言，在 C/C++ 的开发中大括号提行的风格是极度不统一的。参考业界标杆 Linux 系统的代码[linux/kernel/cpu.c](https://github.com/torvalds/linux/blob/master/kernel/cpu.c)，这段代码中很容易发现 Linux 系统的代码在函数声明的大括号使用单独提行，而其他地方不单独提行。当然这并不说 Linux 系统的代码就是 Dirty Code，相反的 Linux 系统的代码非常值得参考。

在实际的开发过程中，我们只需要在项目内做到编码风格的统一即可，我一般统一使用大括号不提行的 K&R 风格。

#### 代码长度

代码长度不宜过长，一般认为每行代码在 **80 个字符数**内为佳，为了解决一个语句长度超过 80 行的情况，我们一般使用换行处理：

```c++
// 常见情况：条件判断语句过长
if (left_x == right_x &&
    left_y == right_y &&
   	top_x == buttom_x &&
    top_y == buttom_y
) {
		return true;
}
```

也可以将语句分离出来：

```c++
bool is_x = left_x == right_x;
bool is_y = left_y == right_y;
if (is_x && is_y) {
  	return true;
}
```

同样在多文件的项目中，代码行数也一般**不超过 300 行**，在必要的地方可以通过功能解耦到多个文件中的方式减少单个文件的行数，以增加可读性。

#### 减少嵌套

这一部分可以参考：[Bilibili:【熟】代码美学：为何要成为“不嵌套主义者”](https://www.bilibili.com/video/BV1ov4y167WE/)

减少嵌套同样可以增加代码的可读性

1. **提前返回**：

   ```c++
   // 反例
   bool isValid(int x) {
       if (x >= 0) {
           if (x % 2 == 0) {
               return true;
           } else {
               return false;
           }
       } else {
           return false;
       }
   }
   
   // 正例
   bool isValid(int x) {
       if (x < 0) {
           return false;
       }
       return x % 2 == 0;
   }
   ```

   在 `while` 循环中使用 `break` 同理。

2. **使用 `continue` 简化循环**：

   ```c++
   // 反例
   for (int i = 0; i < 10; i++) {
       if (i % 2 == 0) {
           std::cout << i << ': ';
           for (int j = 0; j < 10; j++) {
               std::cout << i + j << ' '
           }
           std::cout << '\n';
       }
   }
   
   // 正例
   for (int i = 0; i < 10; i++) {
       if (i % 2 != 0) {
           continue;
       }
       std::cout << i << ': ';
       for (int j = 0; j < 10; j++) {
           std::cout << i + j << ' '
       }
       std::cout << '\n';
   }
   ```

   原理与提前退出类似。

3. **逻辑合并**：

   ```c++
   // 反例
   if (x >= 0) {
       if (x % 2 == 0) {
           std::cout << "not even and not negative" << std::endl;
       }
   }
   
   // 正例
   if (x >= 0 && x % 2 == 0) {
       std::cout << "not even and not negative" << std::endl;
   }
   ```

4. **函数拆分**：

   ```c++
   // 反例
   int main() {
       int x = 10;
       if (x > 0) {
           if (x % 2 == 0) {
               std::cout << "even and postive" << std::endl;
           }
       }
   }
   
   // 正例
   bool isPositive(int x) {
     return x > 0;
   }
   
   bool isEven(int x) {
     return x % 2 == 0;
   }
   
   int main() {
       int x = 10;
       if (isPositive(x) && isEven(x)) {
           std::cout << "even and postive" << std::endl;
       }
   }
   ```

5. **用查表代替分支判断**：

   ```c++
   // 反例
   if (name == "Alice") {
       std::cout << "90" << std::endl;
   } else if (name == "Bob") {
       std::cout << "85" << std::endl;
   } else if (name == "Cathy") {
       std::cout << "95" << std::endl;
   } else {
       std::cout << "Not Found" << std::endl;
   }
   
   // 正例
   map<string, int> score = {
     {"Alice", 90},
     {"Bob", 85},
     {"Cathy", 95}
   };
   if (score.count(name)) {
       std::cout << score[name] << std::endl;
   } else {
       std::cout << "Not Found" << std::endl;
   }
   ```

还有很多诸如此类的 Trick 可以减少嵌套，可以多加思考综合运用，增加代码可读性

#### 空行

使用空行能够很好地分割**同一块代码之间功能不相同的部分**：

```c++
int main() {
    int a = 10;
    int b = 20;

    int sum = a + b;

    std::cout << "Sum: " << sum << std::endl;

    return 0;
}
```

也可以分割**函数与函数之间**：

```c++
int add(int x, int y) {
    return x + y;
}

int multiply(int x, int y) {
    return x * y;
}
```

还有**头文件和实现**：

```c++
#include <iostream>
#include <string>

using namespace std;

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

简单来说就是按照功能与逻辑分块，增加可读性。

### 头文件

需要防护重复引入，防护符的格式是: `<项目>_<路径>_<文件名>_H_`

```c++
#ifndef FOO_BAR_BAZ_H_
#define FOO_BAR_BAZ_H_
...
#endif  // FOO_BAR_BAZ_H_
```

也可以使用：

```c++
#pragma once
```

## 注释

我一般使用行注释解释小的功能点，块注释解释函数、文档，使用 `Doxygen` 风格注释标注而外信息，例如我智能车赛的主函数文件：[SmartCar2025-Main/project/main/Main.cpp](https://github.com/LanternCX/SmartCar2025-Main/blob/master/project/main/Main.cpp)

在一些较为通用场景也就是可能国际化的开源项目，尽量不使用中文注释

#### Inline Comments

我在使用行内注释的时候遵循几点规范：

1. 行内注释**单独提行**，不标注在代码的末尾
2. 行内注释的 `//` 后面需要**紧跟空格**：
3. 行内注释一般用于注释代码的**中间过程**，也就是代码实现部分。

具体看起来像下面这样：

```c++
// （不建议）这是一个不好的行内注释，因为这个注释用来注释主函数，而不是逻辑
int main() {
    int n;
    // (建议) 这是一个好的行内注释，因为这个注释用来注释了代码的逻辑实现
    scanf("%d", &n);
}
```

行注释一般用于方便快捷地解释一个单一功能部分，较为灵活但不够系统

#### Block Comments

一般而言，我在使用块注释的时候遵循几点规范：

1. 块注释**单独提行**：
2. **每一行**块注释的**起始位置**需要打上`*`，块注释的**第一行**需要打**两个** `*`，且一般**不写内容**，最长的那一列`*`一般对齐
3. 块注释的 `*` 号和文字之间需要**打印空格**
4. 块注释一般用于注释函数或者文档

具体而言就像下面这样：

```c++
/**
 * 这是一个块注释
 */
int main() {
    int n;
  	scanf("%d", &n);
}
```

#### Doxygen 风格的注释

Doxygen 风格的**文档注释**能够帮助你在块注释中给注释信息添加额外的内容：

```c++
/**
 * @brief 计算两个整数的最大值
 * @param a 第一个整数
 * @param b 第二个整数
 * @return 返回较大的那个整数
 * @author Cao Xin
 */
int max(int a, int b);
```

我还会在文档头注释上创建日期以及作者信息：

```c++
/**
 * @file Main.h
 * @brief 程序入口文件
 * @date 2025-09-29
 * @author Cao Xin
 */
```

这样写，再结合 `git commit` 信息，可以让别人接手你的代码的时候有疑问能快速联系上你。

详细的 Doxygen 风格的文档注释介绍：[Doxygen 注释规范（C语言版）| Doxygen_stu ](https://viys.github.io/doxygen_stu/index.html)

拓展阅读：[Doxygen - 治好了我的代码注释强迫症 | 知乎](https://zhuanlan.zhihu.com/p/314971283)

总而言之，注释风格的第一要义就是工整，然后就是标记好必要的重要信息，以提高多人合作项目的开发效率。

## Formatter

其实现代化的代码编辑器都多多少少有一些自动格式化的工具，例如 `clang-format`。

在此给出我 VS Code 的 `.clang-format` 配置，可以参考：

```yaml
# 继承 Google 风格
BasedOnStyle: Google

# 四缩进
IndentWidth: 4

# 大括号不提行的 K&R 格式
BreakBeforeBraces: Attach

# 不允许函数体写在一行
# 例如： int f() { return 1; }
# 会被格式化成：
# int f() {
# 		return 1;
# }
AllowShortFunctionsOnASingleLine: None

# 分支与循环语句不能写成单行
# 例如： if (x) doSomething();
# 会被格式化成：
# if (x) {
# 		doSomething();
# }
AllowShortIfStatementsOnASingleLine: false
AllowShortLoopsOnASingleLine: false
```

主要修改了缩进与单行语句规则。

并且我还使用 [Auto Comment Blocks](https://marketplace.visualstudio.com/items?itemName=kevinkyang.auto-comment-blocks) 这个插件帮助我写出规范的块注释。
