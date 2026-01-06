# Debug 2025 Freshman - C Programing

## Chapter04 - Struct, Pointer and Debugger

### Struct

在上一节中，我们学习了 **数组** 和 **字符串**，它们让我们能够方便地存储和处理一组**相同类型**的数据。
 但是在生活中，我们的数据往往并不都是同一种类型。例如：

| 姓名 | 年龄 | 成绩 |
| ---- | ---- | ---- |
| 张三 | 18   | 95.5 |
| 李四 | 19   | 88.0 |
| 王五 | 17   | 90.0 |

这里的“姓名”是字符串，“年龄”是整数，“成绩”是小数。
这三种数据属于**同一个人**，显然应该被看作一个整体。

如果只用数组，我们可能会写出这样的代码：

```c++
char name[3][20] = {"ZhangSan", "LiSi", "WangWu"};
int age[3] = {18, 19, 17};
float score[3] = {95.5, 88.0, 90.0};
```

虽然能表示这些信息，但我们必须维护多个数组来表示同一类对象的不同属性，不仅麻烦，也容易出错。

此时，我们就需要一种能把“不同类型但属于同一个整体的数据”组织起来的结构：这就是 **结构体（struct）**。

**结构体（Structure）** 是一种用户自定义的数据类型，它可以将多个不同类型的变量组合成一个整体。
简单理解，它就像一个“容器”，把不同属性的数据“打包”在一起。

在 C 语言中，结构体的定义语法如下：

```c++
struct Student {
    char name[20];
    int age;
    float score;
};
```

这段代码定义了一个名为 `Student` 的结构体类型，包含三个成员：

- `name` —— 字符串，表示姓名；
- `age` —— 整数，表示年龄；
- `score` —— 浮点数，表示成绩。

结构体定义好后，我们就可以用它来声明变量：

```c++
struct Student s1;
```

此时，`s1` 就是一个结构体变量，包含 `name`、`age` 和 `score` 三个成员。
我们可以通过 **点号 `.`** 来访问结构体的每个成员：

```c++
strcpy(s1.name, "ZhangSan");
s1.age = 18;
s1.score = 95.5;

printf("Name: %s, Age: %d, Score: %.1f\n", s1.name, s1.age, s1.score);
```

输出结果为：

```bash
Name: ZhangSan, Age: 18, Score: 95.5
```

像数组一样，结构体也可以在定义时直接初始化：

```c++
struct Student s2 = {"LiSi", 19, 88.0};
```

也可以按成员名初始化：

```c++
struct Student s3 = {.name = "WangWu", .age = 17, .score = 90.0};
```

如果我们要保存多名学生的信息，可以定义一个**结构体数组**：

```c++
struct Student students[3] = {
    {"ZhangSan", 18, 95.5},
    {"LiSi", 19, 88.0},
    {"WangWu", 17, 90.0}
};
```

就像数组一样，我们可以用循环来遍历：

```c++
for (int i = 0; i < 3; i++) {
    printf("%s %d %.1f\n", students[i].name, students[i].age, students[i].score);
}
```

结构体不仅可以在主函数中使用，也可以作为**函数参数**或**返回值**。

1. 结构体作为参数传递

    ```c++
    void printStudent(struct Student s) {
        printf("Name: %s, Age: %d, Score: %.1f\n", s.name, s.age, s.score);
    }
    ```

    调用时：

    ```c++
    struct Student s1 = {"ZhangSan", 18, 95.5};
    printStudent(s1);
    ```

2. 结构体作为返回值

    ```c++
    struct Student createStudent(int age, float score) {
        struct Student s;
        s.age = age;
        s.score = score;
        return s;
    }
    ```
    
    使用：
	
    ```c++
    struct Student s2 = createStudent("LiSi", 19, 88.0);
    printStudent(s2);
    ```

每次都写 `struct Student` 比较麻烦，我们可以用 `typedef` 给它取个“别名”：

```c++
typedef struct {
    char name[20];
    int age;
    float score;
} Student;
```

这样我们以后就可以直接写：

```c++
Student s = {"LiSi", 19, 88.0};
```

而不需要再写 `struct Student`。

结构体的成员不仅可以是基本类型，也可以是另一个结构体：

```c++
struct Date {
    int year, month, day;
};

struct Student {
    char name[20];
    int age;
    float score;
    struct Date birthday;
};
```

使用时：

```c++
struct Student s = {"ZhangSan", 18, 95.5, {2006, 5, 20}};
printf("%s was born in %d-%d-%d\n", s.name, s.birthday.year, s.birthday.month, s.birthday.day);
```

定义结构体并使用结构体编程的时候，实际上我们正在将问题拆解一个个不同的“对象”，将操作基本数据的问题转换为操作对象的问题，从而减少代码的复杂度。这种将大问题简化为一个个对象，再进行处理的思维，我们叫做**抽象（abstract）**也就是**抽离对象**

### Pointer

#### Basic

如果你有逛过图书馆，你就会知道图书馆中的书都有一个唯一的编号，叫做 ISBN 码。通过这个编码，我们就可以在庞大的书库中找到这本书所在的分区，书架，位置。这种唯一的编号，我们叫这本书的地址。

在前面的学习中，我们用变量来存储数据，用数组来保存一组数据，用结构体来打包不同类型的数据。但这一切的数据，最终都存放在**内存（Memory）**中，简单来说，内存就是变量的图书馆。

就像图书馆一样，每一个变量都有一个自己的地址。每一个**指针（Pointer）**就是帮助我们**直接操作内存**的一种特殊变量。更进一步地说，在使用指针之前，我们访问变量、修改变量的操作都由 C 语言帮我们完成，而指针能够直接让我们通过地址找到这个变量，直接对变量进行修改。

简单来说：普通变量存的是数据本身，指针变量存的是数据所在的位置。

在 C 语言中，定义一个指针的语法是：

```c++
类型* 指针名;
```

比如：

```c++
int a = 10;
// 定义一个指向 int 类型的指针
int* p;
// 将变量 a 的地址赋给指针 p
p = &a;
```

这里使用了两个新的符号：

- `&` ：**取地址符**，用于获取变量的内存地址
- `*` ： **解引用符**，用于访问指针所指向的变量和定义一个新的指针

定义完了指针变量之后，我们该如何使用呢？

我们可以直接通过 `%p` 打印指针变量，进而打印出这几个变量的值

```c++
printf("a 的值是 %d\n", a);
printf("a 的地址是 %p\n", &a);
printf("p 指向的地址是 %p\n", p);
printf("p 指向的变量的值是 %d\n", *p);
```

我们可能会得到：
```c++
a 的值是 10
a 的地址是 0x7ffeeaae08d8
p 指向的地址是 0x7ffeeaae08d8
p 指向的变量的值是 10
```

![4-1](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-10-20/4-1.webp)

我们在此辨析一下符号`*`的使用：

在定义指针变量的时候，`int* a` 此处的 `*` 靠近变量名，用于标识这个变量为指针变量。

在使用指针变量的时候，`printf("%d", *p)` 此处的 `*` 表示将 `p` **解引用（dereference）**为 `p` 指向的变量的值。

另外这个 `*` 和乘法运算符 `*` 使用的是同一个符号，也需要注意辨析。

我们可以用一个简单的图来理解：

| 名称 | 内容 | 说明                  |
| ---- | ---- | --------------------- |
| `a`  | `10` | 存储的实际数据        |
| `p`  | `&a` | 指向变量 `a` 的地址   |
| `*p` | `10` | 通过指针访问 `a` 的值 |

即：

```
p → a → 10
```

既然可以通过指针访问变量，我们当然也能修改它的值：

```c++
int a = 10;
int *p = &a;

// 修改 p 指向的变量的值
*p = 20;
printf("a = %d\n", a);
```

输出：

```bash
a = 20
```

这说明通过 `*p` 修改的其实就是 `a` 自身。

#### Array and Pointer

数组名在 C 语言中其实也是一个**指针常量**，它指向数组的第一个元素。
 也就是说，`a` 与 `&a[0]` 是等价的。

```c++
int a[5] = {1, 2, 3, 4, 5};
// 等价于 p = &a[0];
int *p = a;

// 输出第一个元素 1
printf("%d\n", *p);
// 输出第二个元素 2
printf("%d\n", *(p + 1));
```

这里的 `p+1` 不是简单地让地址加 1，而是跳到**下一个 int 元素的地址**，也就是指针 `p` 的下一个地址。因为数组中的元素在内存中是连续存储的，因此跳到的下一个 `int` 元素的位置实际上就是数组中下一个元素的位置。这就是指针的“步长”概念。

更简单地说：

```c++
a[i] == *(a + i)
```

这条语句概括了数组和指针的关系。

更进一步的：

```c++
a[i] == *(a + i) == *(i + a) == i[a]
```

因此这样使用数组也是合法的，只不过非常不建议使用。

我们可以用指针遍历数组：

```c++
int a[5] = {1, 2, 3, 4, 5};
int *p = a;

for (int i = 0; i < 5; i++) {
    printf("%d ", *(p + i));
}
```

输出：

```c++
1 2 3 4 5
```

#### Pointer and Struct

在上一节中我们讲到，可以通过 `.` 访问结构体成员。如果我们有一个指向结构体的指针，那么要访问成员时，可以使用 `->` 运算符。

```c++
struct Student {
    char name[20];
    int age;
    float score;
};

struct Student s = {"ZhangSan", 18, 95.5};
struct Student* p = &s;

printf("%s %d %.1f\n", p->name, p->age, p->score);
```

这比写 `(*p).name` 更简洁。

### Pointer and Function

在函数调用中，参数一般是**值传递**的，也就是函数得到的是变量的一份“副本”。例如：

```c++
void addOne(int x) {
    x = x + 1;
}

int a = 10;
addOne(a);
// 仍然是 10
printf("%d\n", a);
```

要想在函数中**修改原变量的值**，就需要传入指针（地址）：

```c++
void addOne(int *p) {
    *p = *p + 1;
}

int a = 10;
addOne(&a);
// 输出 11
printf("%d\n", a);
```

这就是所谓的“传址调用”，常用于修改变量内容或提高性能。

学到这里，这样的语法是不是有种似曾相识的感觉？没错，我们的 `scanf()` 函数就使用到了这样的传址方法：

```c++
int n;
scanf("%d", &n)
```

向函数传入一个地址，函数就可以对这个地址所指向的值进行修改，这样的操作完美地解决了变量的作用域带来的一些写法上的不便。

#### Call by address

如果一个函数需要“返回多个结果”，或者需要修改主函数中的变量，我们常常使用 **指针传址** 的方式实现。例如：

```c++
void get_sum_and_diff(int a, int b, int *sum, int *diff) {
    *sum = a + b;
    *diff = a - b;
}

int main() {
    int x = 10, y = 3;
    int s, d;
    get_sum_and_diff(x, y, &s, &d);
    printf("sum=%d, diff=%d\n", s, d);
    return 0;
}
```

这里的 `get_sum_and_diff` 函数没有返回值（`void`），但通过指针参数 `*sum` 和 `*diff`，将计算结果**直接写入主函数的变量地址**中，实现了“返回多个值”的效果。这种方式称为 **传址调用（call by address）**。

虽然传址输出很常见，但也容易出错，尤其是以下几种情况：

1. 传入了未初始化的指针

  如果函数中尝试通过指针写入数据，而指针没有指向合法的内存，就会引发**段错误（Segmentation Fault）**。

  ```c++
  void wrong_func(int* p){
      *p = 10; // 如果 p 未指向有效内存，这里就会崩溃
  }

  int main(){
      int *ptr;
      wrong_func(ptr); // ptr 未初始化
  }
  ```

2. 传入了局部变量的地址被函数返回使用

  有些人可能写出类似这样危险的代码：

  ```c++
  int* bad_return(){
      int x = 10;
      return &x; // 局部变量地址会失效
  }
  ```

这在访问返回的指针时，会造成**未定义行为**。

3. 影响可读性与可维护性

  函数没有返回值但会修改外部变量，这种“隐式修改”让人不容易理解：

  ```c++
  void calc(int a, int b, int* result){
      *result = a + b;
  }
  ```

  从函数名和返回值上看不出它会修改外部变量，阅读代码的人很难发现 `result` 被改变。

实际上，如果需要返回多个结果，更推荐的做法是使用结构体返回。

因为数组名实际上也是指针，因此我们可以将数组作为函数的参数传入：

```c++
/**
 * @brief 将数组中每个数平方
 * @param arr 数组的首指针
 * @param n 数组长度
 */
void square_array(int arr[], int n){ 
    for(int i  = 0; i < n; i++) {
        arr[i] *= arr[i]; // 直接修改原数组
    }
}

int main() {
    int nums[] = {1, 2, 3, 4, 5};
    int len = 5;
    square_array(nums, len);
    for(int i=0; i < len; i++) {
        printf("%d ", nums[i]);
    }
    return 0;
}

```

二维数组传参时必须指定**列数**（即第二维大小），否则编译器无法正确计算地址。

```c++
/**
 * @brief 打印二维数组
 * @param 二维数组
 * @param row 行数
 */
void print_matrix(int a[][3], int rows) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", a[i][j]);
        }
        printf("\n");
    }
}

int main() {
    int mat[2][3] = {{1, 2, 3}, {4, 5, 6}};
    print_matrix(mat, 2);
    return 0;
}
```

#### Singleton

想象你电脑里的“系统设置”：

- 全系统只有一份配置
- 所有程序都访问这份配置
- 修改配置后，所有地方立即生效

也就是说：不管程序的哪一部分去获取它，拿到的永远都是**同一个对象**。

**单例模式（Singleton Pattern）** 是一种常见的软件设计模式，
它的核心思想是：**在整个程序运行期间，只允许某个对象存在一个唯一实例，并提供一个全局访问点。**

这就是典型的“单例思想” ：**全局唯一 + 可共享访问 + 统一管理。**

通过指针和结构体，我们不需要借助 C++ 等面向对象的高级程序设计语言就可以设计出一个高可用的单例模式

```c++
typedef struct {
    char name[20];
    int version;
    int initialized;
} Config;

Config* get_config() {
    // 静态局部变量，全局唯一
    static Config cfg;
    if (!cfg.initialized) {
        strcpy(cfg.name, "Default");
        cfg.version = 1;
        cfg.initialized = 1;
    }
    // 返回指针
    return &cfg;
}

void set_config_name(const char* new_name) {
    // 获取唯一实例
    Config* cfg = get_config();
    strcpy(cfg->name, new_name);
}

void print_config() {
    Config* cfg = get_config();
    printf("Name: %s, Version: %d\n", cfg->name, cfg->version);
}

int main() {
    // 输出默认配置
    print_config();
    // 修改全局唯一实例
    set_config_name("ZhiGrip");
    // 修改后依然是同一个实例
    print_config();
    return 0;
}
```

这段代码中，通过维护一个 `Config` 单例，实现了配置的全局统一管理。

这样的设计模式，通过函数作为统一的接口操作单例，不仅可以让我们能够完全控制对象属性值的修改，也就是我们可以排除一些非法的属性值。

统一管理，统一维护，统一接口，即是单例模式的设计思想。在我们比赛中维护大的系统的时候，往往使用类似的设计模式解决问题，是十分有效的。

设计模式的种类还有很多，尽管他们都广泛应用于面向对象的编程语言中，但是使用 C 语言同样也可以实现类似的解决问题的方法。

在使用编程解决问题的时候，我们不妨想一想如何用 C 语言实现这些设计模式并将设计模式用于工程实践，这样的思维过程也是十分有趣的。

拓展阅读：[设计模式 | 菜鸟教程](https://www.runoob.com/design-pattern/design-pattern-tutorial.html)

#### Pointer and Function

在 C 语言中，**函数名其实就是一个函数的地址**。
这意味着我们可以定义一个**函数指针（function pointer）** 来保存一个函数的入口地址。

语法形式如下：

```
返回值类型 (*指针名)(参数类型列表);
```

比如我们有一个函数：

```c++
int add(int a, int b) {
    return a + b;
}
```

我们就可以定义一个指针来指向它：

```c++
int (*p)(int,int);
p = add;
```

此时，`p` 就是一个函数指针，它指向 `add` 函数。

调用方式也很自然：

```c++
int result = p(3,4);
// 等价于 add(3,4)
printf("%d\n", result);
```

也就是说：

| 名称  | 含义                  |
| ----- | --------------------- |
| `add` | 函数名，对应函数地址  |
| `p`   | 指向 `add` 的函数指针 |
| `p()` | 通过函数指针调用函数  |

如果我们有多个功能相似的函数，可以用函数指针数组来统一管理。

```c++
int add(int a, int b) {
    return a + b;
}
int sub(int a, int b) {
    return a - b;
}
int mul(int a, int b) {
    return a * b;
}

int main() {
    int (*ops[3])(int, int) = {add, sub, mul};
    int a = 6, b = 3;
    printf("add: %d\n", ops[0](a, b));
    printf("sub: %d\n", ops[1](a, b));
    printf("mul: %d\n", ops[2](a, b));
    return 0;
}
```

这样一来，我们可以很方便地通过下标选择要执行的函数逻辑，就像访问数组一样灵活。

#### Callback Function

“回调函数”这个词在初听时可能有些抽象，我们先来看一个生活中的例子。

假设你在外卖平台下单，你并不会自己一直刷页面看骑手到了没有，而是留了一个**联系方式**。

当骑手送达时，系统会“回拨”你的电话通知你取餐。

你写下了联系方式（函数指针）， 外卖系统存下了它（注册回调），

当事件发生时，系统“回调”你（调用函数）。

这就是**回调（callback）**的基本思想：将一个函数的“调用权”交给另一个函数，由它在合适的时机调用。

简单来说，就是函数作为函数的参数传入另一个函数。

我们先来看一个简单的例子：

```c++
#include <stdio.h>

void hello() {
    printf("Hello, Debug2025!\n");
}

void run_callback(void (*callback)()) {
    printf("Before callback\n");
    // 调用回调函数
    callback();
    printf("After callback\n");
}

int main() {
    run_callback(hello);
    return 0;
}
```

运行结果：

```bash
Before callback
Hello, Debug2025!
After callback
```

在这里：

- `run_callback()` 是一个“控制函数”，它接收一个函数指针；
- `hello()` 是“被回调”的函数；
- 当我们把 `hello` 作为参数传入后，`run_callback()` 在自己的流程中调用了它。

这样一来，我们就可以把“控制逻辑”和“具体行为”分离开，也就是**解耦**，让函数更加灵活。

回调函数当然也可以带参数或返回值。例如我们写一个计算器函数：

```c++
int add(int a, int b) {
    return a + b;
}
int sub(int a, int b) {
    return a - b;
}
int mul(int a, int b) {
    return a * b;
}

int compute(int a, int b, int (*op)(int, int)) {
    return op(a, b);
}

int main() {
    printf("3 + 4 = %d\n", compute(3, 4, add));
    printf("3 - 4 = %d\n", compute(3, 4, sub));
    printf("3 * 4 = %d\n", compute(3, 4, mul));
    return 0;
}
```

输出：

```bash
3 + 4 = 7
3 - 4 = -1
3 * 4 = 12
```

我们可以看到：

- `compute` 并不关心要“加减乘除”哪一种；
- 它只负责接收一个函数指针并执行；
- 至于执行什么逻辑，由调用者传入的回调函数决定。

这种写法使得程序结构更加**模块化**与**可扩展**。

回调函数是 C 语言中非常重要的思想基础。

利用函数指针、回调函数、函数指针数组，我们可以很方便地实现一些复杂的程序设计，利用这些特性，我们可以用 C 语言实现高可拓展的菜单、状态机控制、事件系统等等，大家在今后的嵌入式开发的学习中也可以思考如何通过设计模式和 C 语言特性优化代码结构。

类似的利用指针对程序进行解耦和模块化的应用还有很多，总而言之，我们开发过程中需要多多利用工程思维，在必要的地方解耦，实现高内聚、低耦合的程序系统设计。

#### Warning

指针在给我们带来便利的同时，也同样存在隐患。这种直接操作内存的编码方式既快速又危险。

**空指针（NULL）**：
当指针没有指向任何有效地址时，应该将其初始化为 `NULL`：

```
int *p = NULL;
```

**不能随意解引用空指针或野指针**，否则程序可能崩溃。

**指针类型必须匹配**，例如 `int*` 不能随意赋给 `float*`。

**越界访问** 同样危险，比如在数组外的指针运算。

### Debugger

在编程中，**bug（程序错误）** 是不可避免的。
 而 **调试（debug）** 就是发现并修复这些错误的过程。

GDB（GNU Debugger） 是 GNU 项目下的开源调试器，
它能让你在程序运行时：

- 暂停程序
- 观察变量
- 单步执行
- 查看函数调用栈
- 修改内存
- 找出程序崩溃的原因

简而言之：GDB 能够帮助你看清程序运行的时候程序内部到底发生了什么。

详细的在 Dev-C++ 中使用 Debugger 的方法，可以看这篇文章：[DevC++调试程序详解 - C语言中文网](https://c.biancheng.net/view/ftfzduv.html)

