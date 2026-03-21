# Debug 2025 Freshman - C Programing

## [Practice 01: I/O and Flow Control](https://vjudge.net/contest/751860) Editorial

### [A - P1001 A+B Problem](https://vjudge.net/problem/洛谷-P1001)

原题链接：[P1001 A+B Problem - 洛谷](https://www.luogu.com.cn/problem/P1001)

很简单的一个有关输入输出的入门练习：

```c++
#include <stdio.h>

// LanternCX
int main() {
    int a, b;
  	// 输入两个整数
    scanf("%d %d", &a, &b);
  	// 输出两个整数相加
    printf("%d\n", a + b);
    return 0;
}
```

### [B - P5704 字母转换](https://vjudge.net/problem/洛谷-P5704)

原题链接：[P5704 【深基2.例6】字母转换 - 洛谷](https://www.luogu.com.cn/problem/P5704)

主要考察字符型变量的运算，考察对 ASCILL 码表的基本运用：

```c++
#include <stdio.h>

// LanternCX
int main() {
    char ch;
    scanf("%c", &ch);
  	// 'A' - 'a' 表示两个字符 ASCILL 码之间的差值，数值上等于 32
    printf("%c\n", ch + ('A' - 'a'));
    return 0;
}
```

### [C - P5711 闰年判断](https://vjudge.net/problem/洛谷-P5711)

原题链接：[P5711 【深基3.例3】闰年判断 - 洛谷](https://www.luogu.com.cn/problem/P5711)

主要考察逻辑运算表达式的使用。

根据闰年的定义：四年一闰，百年不闰，四百年再闰，描述逻辑即可
```c++
#include <stdio.h>

// LanternCX
int main() {
    int n;
    scanf("%d", &n);
  	// 运用三元运算符，符合闰年条件下输出 1 否则输出 0
    printf("%d\n", (n % 4 == 0 && n % 100 != 0 || n % 400 == 0) ? 1 : 0);
    return 0;
}
```

这段代码中使用了三元运算符用来简化简单的 `if-else` 语法：[C 运算符 | 菜鸟教程](https://www.runoob.com/cprogramming/c-operators.html)

### [D - P5715 三位数排序](https://vjudge.net/problem/洛谷-P5715)

原题链接：[P5715 【深基3.例8】三位数排序 - 洛谷](https://www.luogu.com.cn/problem/P5715)

简单的三位数排序，主要考察逻辑思维能力与对 C 语言 `math.h` 库的运用

假设三个数的最大值是 `max`，最小值是 `min`，三个数的加和是 `sum`，那么中间值 `mid` 就是 `mid = sum - max - min`

```c++
#include <stdio.h>
#include <math.h>

// LanternCX
int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    int mx = fmax(a, fmax(b ,c));
    int mn = fmin(a, fmin(b, c));
    printf("%d %d %d", mn, a + b + c - mx - mn, mx);
    return 0;
}
```

除此之外，还有一种基于冒泡排序思想的写法，在此不具体解释，可以自行推到过程：

```c++
#include <stdio.h>

// LanternCX
int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    // a > b 就交换 a b 的值
  	if (a > b) {
        int temp = a;
        a = b;
        b = temp;
    }
    // 第一次交换后，如果 b > c，就交换 b c 的值 
    if (b > c) {
        int temp = b;
        b = c;
        c = temp;
    }
    // 前两次交换后，如果 a > b，就交换 a b 的值
    if (a > b) {
        int temp = a;
        a = b;
        b = temp;
    }
    printf("%d %d %d", a, b, c);
  	return 0;
}
```

### [E - P5722 数列求和](https://vjudge.net/problem/洛谷-P5722)

原题链接：[P5722 【深基4.例11】数列求和 - 洛谷](https://www.luogu.com.cn/problem/P5722)

主要考察对循环语句的运用，根据题意累加即可：

```c++
#include <stdio.h>

// LanternCX
int main() {
    int n;
    scanf("%d", &n);
    long long sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("%lld", sum);
    return 0;
}
```

尽管本题给定的 `n` 较小，但是对于较大的 `n` 时，`sum` 的值可能会超过 `int` 的最大表示范围，因此在这里使用 `long long` 类型规避风险。

当然直接使用等差数列求和公式也是可以通过本题的：

```c++
#include <stdio.h>

// LanternCX
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", ((n + 1) * n / 2));
    return 0;
}
```

### [F - P1035 级数求和](https://vjudge.net/problem/洛谷-P1035)

原题链接：[P1035 【NOIP 2002 普及组 级数求和】 - 洛谷](https://www.luogu.com.cn/problem/P1035)

与上一题类似，考察对循环的运用，本质上是上一题的逆向思维。

因为原通项公式下的求和公式很难求得，而原数列又存在单调性，因此我们可以选择直接从小到大枚举 `n` 以此计算目标值。

本质上就是利用单调性一个一个试出 `n` 的值。`sum` 记得开 `double` 否则可能会遇到精度不够的问题 

```c++
#include <stdio.h>

// LanternCX
int main() {
    int k;
    scanf("%d", &k);    
    double ans = 0, sum = 0;
    while (sum <= k) {
        ans++;
        sum += 1.0 / ans;
    }
    printf("%.lf", ans);
    return 0;
}
```

### [G - P5726 打分](https://vjudge.net/problem/洛谷-P5726)

原题链接：[P5726 【深基4.习9】打分 - 洛谷](https://www.luogu.com.cn/problem/P5726)

对输入的数据求和后减去最大值和最小值，然后按照题意取平均即可，和 D 题的三位数排序类似。

这里通过 `fmax(mx, x)` 这样的动态维护最大值和最小值的算法可以注意一下。

```c++
#include <stdio.h>
#include <math.h>

// LanternCX
int main(){
    int n;
    scanf("%d", &n);
    int mx = 0, mn = 10;
    double sum = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        mx = fmax(mx, x);
        mn = fmin(mn, x);
        sum += x;
    }
    sum -= mx + mn;
    printf("%.2lf", sum / (n - 2));
    return 0;
}
```

### [H - P5707 上学迟到](https://vjudge.net/problem/洛谷-P5707)

原题链接：[P5707 【深基2.例12】上学迟到 - 洛谷](https://www.luogu.com.cn/problem/P5707)

主要考察数学思维与分类讨论能力。

注意到在数据范围下，有可能会越过凌晨 `00:00` 的两天分界线，因此需要对时间` t > 8h` 和 `t <= 8h` 的情况进行分类讨论。

虽然题目没说打印的是 `24:00` 还是 `00:00` 但是很显然 24 小时制下没有 `24:00`，因此我们打印 `00:00`。

对于不足两位补 `0` 的情况，可以使用 `printf` 的格式化输出功能处理。

详细过程可以看我的代码注释：

```c++
#include <stdio.h>

// LanternCX
int main(){
    int s, v;
    scanf("%d %d", &s, &v);
  	// 总时间, 向上取整, 单位为 分钟
    int t = (s + v - 1) / v + 10;
    if (t <= 8 * 60) {
  			// 总时间小于等于 8 小时的情况
      	// 小时数，整除 60 huode
      	// 	如果整除 60 有余数, 小时数就需要再减 1, 也就是 (t % 60) > 0 这一项
        int h = 8 - t / 60 - ((t % 60) > 0);
        int m = (60 - t % 60) % 60;
      	// 	格式化输出
        printf("%02d:%02d", h, m);
    } else {
      	// 总时间大于 8 小时的情况
      	// 转换时间起点为 24 小时
        t -= 8 * 60;
      	// 同上计算时间
        int h = 24 - t / 60 - ((t % 60) > 0);
        int m = (60 - t % 60) % 60;
      	// 格式化输出
        printf("%02d:%02d", h, m);
    }
    return 0;
}
```

### [I - P5717 三角形分类](https://vjudge.net/problem/洛谷-P5717)

原题链接：[P5717 【深基3.习8】三角形分类 - 洛谷](https://www.luogu.com.cn/problem/P5717)

根据题意找出最大值和最小值分类讨论输出即可：

```c++
#include <stdio.h>
#include <math.h>

// LanternCX
int main(){
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
  	// 	不是三角形就不执行下面的判断直接退出程序
    if (a + b <= c || a + c <= b || b + c <= a) {
        printf("Not triangle\n");
        return 0;
    }
  	// 找最大值最小值中间值
    int mn = fmin(a, fmin(b, c));
    int mx = fmax(a, fmax(b, c));
    int mid = a + b + c - mn - mx;
  	// 锐角三角形
    if (mn * mn + mid * mid > mx * mx) {
        printf("Acute triangle\n");
    }
  	// 直角三角形
    if (mn * mn + mid * mid == mx * mx) {
        printf("Right triangle\n");
    }
  	// 钝角三角形
    if (mn * mn + mid * mid < mx * mx) {
        printf("Obtuse triangle\n");
    }
  	// 等腰三角形
    if (a == b || b == c || a == c) {
        printf("Isosceles triangle\n");
    }
  	// 等边三角形
    if (a == b && b == c) {
        printf("Equilateral triangle\n");
    }
    return 0;
}
```

### [J - P11242 碧树](https://vjudge.net/problem/洛谷-P11242)

原题链接：[P11242 碧树 - 洛谷](https://www.luogu.com.cn/problem/P11242)

根据定义，我们要构造出满足条件的树，首先就要使得深度最大的叶子节点满足定义。

这样的树明显是一个**链**：除了叶子节点和根节点外，每个节点都只有两条边。此时树的节点个数等于最大节点深度。

在这个链的基础上，将深度小于最大深度的 `k - 1` 个叶子节点全连接到链上，显然能使节点数最小。此时我们又向树上添加了 `k - 1` 个节点。

因此总的节点个数就是 `max + k - 1`，其中 `max` 表示节点的最大深度。

![kh6cgtyp.png (400×387)](https://cdn.luogu.com.cn/upload/image_hosting/kh6cgtyp.png?x-oss-process=image/resize,m_lfit,h_400,w_400)

```c++
#include <stdio.h>
#include <math.h>

// LanternCX
int main(){
    int n;
    scanf("%d", &n);
    int mx = 0;
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        mx = fmax(mx, x);
    }
    printf("%d", n + mx - 1);
    return 0;
}
```
