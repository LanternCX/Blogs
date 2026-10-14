---
permalink: debug-2026-cp-practice-3
title: "[Debug 2026 Freshman] CP Practice 03"
pubDate: 2026-10-13
---

## [A - HDU 2003 求绝对值](https://vjudge.net/problem/HDU-2003)

读入一个实数，输出它的绝对值，保留两位小数。输入可能有小数，所以使用 `double`。

这份代码按 C++ 编译，`abs(x)` 可以调用浮点数版本。如果按 C 语言写，实数的绝对值应使用 `<math.h>` 中的 `fabs(x)`，整数才用 `abs(x)`。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

int main() {
    double x;
    while (scanf("%lf", &x) != EOF) {
        printf("%.2lf\n", abs(x));
    }
    return 0;
}
```

---

## [B - HDU 2008 数值统计](https://vjudge.net/problem/HDU-2008)

统计负数、零和正数的个数。输入的是实数，不能用 `int` 保存，否则像 `0.5` 这样的数就无法正确处理。

代码用 `cnt[0]` 统计零，`cnt[1]` 统计负数，`cnt[2]` 统计正数。计算 `idx` 的表达式可以分三种情况看：

| `a[i]` | `(a[i] > 0 ? 2 : 1)` | `(a[i] == 0 ? 0 : 1)` | `idx` |
| --- | --- | --- | --- |
| 负数 | 1 | 1 | 1 |
| 零 | 1 | 0 | 0 |
| 正数 | 2 | 1 | 2 |

得到下标后执行 `cnt[idx]++`。输出顺序是负数、零、正数，所以依次输出 `cnt[1]`、`cnt[0]`、`cnt[2]`。这个表达式只是把分类写在了一行里，用 `if-else` 分三种情况判断也一样。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

int main() {
    int n;
    while (scanf("%d", &n)) {
        if (n == 0) {
            break;
        } 
        double a[100];
        for (int i = 0; i < n; i++) {
            scanf("%lf", &a[i]);
        }
        int cnt[3] = {0, 0, 0};
        for (int i = 0; i < n; i++) {
            int idx = (a[i] > 0 ? 2 : 1) * (a[i] == 0 ? 0 : 1);
            cnt[idx]++; 
        }
        printf("%d %d %d\n", cnt[1], cnt[0], cnt[2]);
    }
    return 0;
}
```

题单建议用指针练习遍历。可以把统计循环中的下标 `i` 换成指针 `p`：从 `p = a` 开始，每次 `p++`，在 `p < a + n` 时继续，原来的 `a[i]` 就写成 `*p`。

---

## [C - HDU 2011 多项式求和](https://vjudge.net/problem/HDU-2011)

计算前 `n` 项的和：

**1 − 1/2 + 1/3 − 1/4 + …**

第 `i` 项的绝对值是 `1.0 / i`，奇数项为正，偶数项为负，因此乘上 `i % 2 == 0 ? -1 : 1` 后累加即可。

这里必须写 `1.0 / i`。如果写成 `1 / i`，就会进行整数除法，除了第一项，后面的结果都会变成 `0`。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

using namespace std;

// caoxin

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double ans = 0;
        int n;
        scanf("%d", &n);
        for (int i = 1; i <= n; i++) {
            ans += 1.0 / i * (i % 2 == 0 ? -1 : 1);
        }
        printf("%.2lf\n", ans);
    }
    return 0;
}
```

---

## [D - HDU 2015 偶数求和](https://vjudge.net/problem/HDU-2015)

数列是从 `2` 开始的前 `n` 个正偶数，每 `m` 个数分为一组，输出各组的平均值。最后一组不够 `m` 个时，按实际个数计算。

例如 `n = 5`、`m = 2`，数列为 `2 4 6 8 10`，分成 `2 4`、`6 8`、`10` 三组，平均值分别是 `3 7 10`。

代码从 `a[1]` 开始存数，每项比前一项多 `2`。遍历时累加到 `sum`，遇到 `i % m == 0` 就说明当前组已经凑满，输出 `sum / m`，再把 `sum` 清零。

循环结束后，如果 `n % m != 0`，`sum` 中还剩最后一组的和。这一组只有 `n % m` 个数，不能继续除以 `m`。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

using namespace std;

// caoxin

int main() {
    int n, m;
    while (scanf("%d %d", &n, &m) != EOF) {
        int a[100 + 10] = {0};
        for (int i = 1; i <= n; i++) {
            a[i] = a[i - 1] + 2;
        }
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += a[i];
            if (i % m == 0) {
                printf("%d ", sum / m);
                sum = 0;
            }
        }
        if (n % m != 0) {
            printf("%d ", sum / (n % m));
        }
        printf("\n");
    } 
    return 0;
}
```

> 视频中的原解开了 `a[100]`，但下标从 `1` 用到 `n`。当 `n = 100` 时会写到 `a[100]`，超过数组范围，这里改成了 `a[100 + 10]`。

---

## [E - HDU 2001 计算两点间的距离](https://vjudge.net/problem/HDU-2001)

两点间的距离公式为：

**d = √((x₁ − x₂)² + (y₁ − y₂)²)**

用结构体 `Point` 把一个点的横、纵坐标放在一起。`get_dist(Point a, Point b)` 接收两个点，通过 `a.x`、`a.y` 等成员代入公式，返回距离。

坐标可能是小数，使用 `double`；`pow(..., 2)` 计算平方，`sqrt(...)` 开平方，最后保留两位小数输出。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

// caoxin

typedef struct {
    double x, y;
} Point;

double get_dist(Point a, Point b) {
    return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}

int main() {
    Point a, b;
    while (scanf("%lf %lf %lf %lf", &a.x, &a.y, &b.x, &b.y) != EOF) {
        printf("%.2lf\n", get_dist(a, b));
    }
    return 0;
}
```

---

## [F - HDU 2033 人见人爱A+B](https://vjudge.net/problem/HDU-2033)

把两个时间相加，关键是从秒开始处理进位：

1. 秒数相加，`s / 60` 进到分钟，`s % 60` 留作秒数。
2. 分钟相加时带上秒的进位，再用 `m / 60` 进到小时，`m % 60` 留作分钟。
3. 小时相加时带上分钟的进位。

例如 `1:59:40 + 2:00:30`，秒数为 `70`，向分钟进 `1`；分钟变成 `60`，再向小时进 `1`，结果是 `4:00:10`。题目没有要求小时对 `24` 取余，直接输出相加后的小时数。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

// caoxin

typedef struct {
    int h, m, s;
} Time;

Time add(Time a, Time b) {
    int s = a.s + b.s;
    int m = s / 60 + a.m + b.m;
    int h = m / 60 + a.h + b.h;
    Time ans = {h, m % 60, s % 60};
    return ans;
}

int main() {
    int n;
    scanf("%d", &n);
    while (n--) {
        Time a, b;
        scanf("%d %d %d %d %d %d", &a.h, &a.m, &a.s, &b.h, &b.m, &b.s);
        Time ans = add(a, b);
        printf("%d %d %d\n", ans.h, ans.m, ans.s);
    }
    return 0;
}
```

> 视频中的原解用 `{s % 60, m % 60, h}` 初始化，但结构体的成员顺序是 `h, m, s`，所以小时和秒存反了。输出时又用了 `ans.s, ans.m, ans.h`，两处反过来，结果恰好是对的。这里把存储和输出都改为时、分、秒，成员名和内容就一致了。

---

## [G - HDU 2026 首字母变大写](https://vjudge.net/problem/HDU-2026)

这题第二周做过，这次用指针遍历。`p` 指向当前字符，`*p` 取出这个字符，`p++` 移到下一个字符，遇到 `\0` 就结束。

单词开头有两种情况：`p == str`，也就是整行的第一个字符；或者 `*(p - 1) == ' '`，前一个字符是空格。当前位置是小写字母时，加上 `'A' - 'a'` 就能转成大写。

`p == str` 放在 `||` 左边还有一个作用：它成立时，右边不会再计算，所以不会在开头访问 `str` 前面的内存。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

// caoxin

void read_line(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

void print(char str[]) {
    for (int i = 0; i < strlen(str); i++) {
        putchar(str[i]);
    }
    putchar('\n');
}

int main() {
    char str[100 + 10];
    while (scanf("%c", &str[0]) != EOF) {
        read_line(str + 1, sizeof(str) - 1);
        char * p = str;
        while (*p != '\0') {
            if (p == str || *(p - 1) == ' ') {
                if (*p >= 'a' && *p <= 'z') {
                    *p += 'A' - 'a';
                }
            }
            p++;
        }
        print(str);
    }
    return 0;
}
```

> 视频中的原解在单词开头直接做字符加减。如果遇到大写字母或连续空格，也会被改掉，这里加上了小写字母判断。`str[100]` 也改大了：保存 100 个字符，还需要一个位置存 `\0`。

---

## [H - HDU 2027 统计元音](https://vjudge.net/problem/HDU-2027)

与第二周一样，用 `map = "aeiou"` 保存五个元音，`cnt[i]` 统计 `map[i]` 出现的次数。这次用指针 `p` 逐个访问字符。

`cnt[i] += *p == map[i]` 中，比较成立时结果是 `1`，不成立时是 `0`，所以只有遇到对应元音才会加一。例如当前字符是 `e`，只有 `cnt[1]` 会增加。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

// caoxin

void read_line(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

void print(char str[]) {
    for (int i = 0; i < strlen(str); i++) {
        putchar(str[i]);
    }
    putchar('\n');
}

char map[] = "aeiou";

int main() {
    int n;
    scanf("%d", &n);
    getchar();
    while (n--) {
        char str[100 + 10];
        read_line(str, sizeof(str));
        char * p = str;
        int cnt[] = {0, 0, 0, 0, 0};
        while (*p != '\0') {
            for (int i = 0; i < 5; i++) {
                cnt[i] += *p == map[i];
            }
            p++;
        }

        for (int i = 0; i < 5; i++) {
            printf("%c:%d\n", map[i], cnt[i]);
        }

        if (n > 0) {
            printf("\n");
        }
    }
    return 0;
}
```

> 视频中的原解用了 `str[100]`，这里也改大了，避免长度为 100 时丢掉最后一个字符。另外按题面要求，只在两组之间加空行，最后一组后不再加；这是输出格式的调整，不影响统计方法。

---

## [I - HDU 2034 人见人爱A-B](https://vjudge.net/problem/HDU-2034)

这里的 `A - B` 是集合的差集：保留在 A 中出现、但不在 B 中出现的数。例如 A 是 `{3, 1, 2}`，B 是 `{2, 4}`，剩下 `{3, 1}`，从小到大输出 `1 3`。

外层指针 `p` 遍历 A，内层指针 `q` 遍历 B。只要找到 `*p == *q`，就说明这个数不能保留，令 `flag = 1` 并退出内层循环。如果找完 B 仍然没有找到，就把 `*p` 放进 `ans`。

`idx` 初始为 `-1`，每加入一个数就先加一，因此最后答案个数是 `idx + 1`。如果它还是 `-1`，说明没有剩下的数，输出 `NULL`；否则排序后输出。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

// caoxin

int cmp(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

int main() {
    int n, m;
    while (scanf("%d %d", &n, &m)) {
        if (n == m && m == 0) {
            break;
        }
        int a[100], b[100];
        for (int i = 0; i < n; i++) {
            scanf("%d", a + i);
        }
        for (int i = 0; i < m; i++) {
            scanf("%d", b + i);
        }

        int ans[100];

        int idx = -1;

        for (int * p = a; p < a + n; p++) {
            int flag = 0;
            for (int * q = b; q < b + m; q++) {
                if (*p == *q) {
                    flag = 1;
                    break;
                }
            }
            if (!flag) {
                ans[++idx] = *p;
            }
        }

        if (idx == -1) {
            printf("NULL");
        } else {
            qsort(ans, idx + 1, sizeof(int), cmp);
            for (int i = 0; i <= idx; i++) {
                printf("%d ", ans[i]);
            }
        }
        printf("\n");
    } 
    return 0;
}
```

`scanf` 需要接收地址，`a + i` 就是 `&a[i]`，所以这里不用再加 `&`。

`qsort(ans, idx + 1, sizeof(int), cmp)` 的四个参数分别是数组起始地址、元素个数、每个元素的大小和比较函数。`cmp` 收到两个元素的地址，先转成 `const int *` 再取值；返回负数表示 `x` 排在前面，正数表示 `y` 排在前面，零表示相等。`(x > y) - (x < y)` 正好得到 `1`、`-1` 或 `0`。

---

## [J - HDU 2043 密码](https://vjudge.net/problem/HDU-2043)

按题目要求，密码长度必须在 `8` 到 `16` 之间，并且至少包含下面四类字符中的三类：大写字母、小写字母、数字、特殊符号 `~!@#$%^`。

先判断长度，不符合就输出 `NO`。长度符合时，再逐个字符分类：`cnt[1]` 记录特殊符号，`cnt[2]` 记录数字，`cnt[3]` 记录小写字母，`cnt[4]` 记录大写字母。

最后统计的是**出现了几类字符**。一类只要出现过就算一类，出现十次也还是一类。例如 `a1b2c3d4` 虽然有八个字符，但只有小写字母和数字两类，仍然输出 `NO`。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

// caoxin

void read_line(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

char map[] = "~!@#$%^";

int main() {
    int n;
    scanf("%d", &n);
    getchar();
    while (n--) {
        char str[100];
        read_line(str, sizeof(str));
        if (strlen(str) < 8 || strlen(str) > 16) {
            printf("NO\n");
            continue;
        }

        int cnt[] = {0, 0, 0, 0, 0};
        for (int i = 0; i < strlen(str); i++) {
            int flag = 0;
            for (int j = 0; j < 7; j++) {
                if (str[i] == map[j]) {
                    flag = 1;
                    break;
                }
            }
            if (str[i] >= '0' && str[i] <= '9') {
                flag = 2;
            }
            if (str[i] >= 'a' && str[i] <= 'z') {
                flag = 3;
            }
            if (str[i] >= 'A' && str[i] <= 'Z') {
                flag = 4;
            }
            cnt[flag]++;
        }

        int ans = 0;
        for (int i = 1; i <= 4; i++) {
            if (cnt[i] != 0) {
                ans++;
            }
        }
        if (cnt[0] != 0) {
            printf("NO\n");
            continue;
        }
        if (ans >= 3) {
            printf("YES\n");
        } else {
            printf("NO\n");
        }
    }
    return 0;
}
```

`cnt[0]` 记录不属于这四类的字符，代码也单独检查了这一项。题目输入只包含给出的四类字符，正常测试数据不会进入这个分支。

---

## [K - HDU 2032 杨辉三角](https://vjudge.net/problem/HDU-2032)

杨辉三角每行的两端都是 `1`，中间每个数等于上一行相邻两个数之和：

**a[i][j] = a[i − 1][j − 1] + a[i − 1][j]**

例如上一行是 `1 2 1`，下一行两端放 `1`，中间分别是 `1 + 2` 和 `2 + 1`，得到 `1 3 3 1`。

下标从 `0` 开始，第 `i` 行有 `i + 1` 个数，所以内层循环到 `j <= i`。先算好整个数组，每组输入只需要输出前 `n` 行，不必重新计算。

```cpp
#include <stdio.h>

int main() {
    int n;
    int a[30][30] = {0};

    for (int i = 0; i < 30; i++) {
        for (int j = 0; j <= i; j++) {
            if (j == 0 || j == i) {
                a[i][j] = 1;
            } else {
                a[i][j] = a[i-1][j-1] + a[i-1][j];
            }
        }
    }

    while (scanf("%d", &n) == 1) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= i; j++) {
                if (j > 0) {
                    printf(" ");
                }
                printf("%d", a[i][j]);
            }
            printf("\n");
        }
        printf("\n");
    }

    return 0;
}
```

每行从第二个数开始，在数前面输出空格，这样行末就不会多出空格。每组三角形输出完后再加一个空行。

---

## [L - HDU 2036 改革春风吹满地](https://vjudge.net/problem/HDU-2036)

给出按多边形边界顺序排列的顶点，求多边形面积。用结构体数组 `p` 保存坐标，`p[i].x`、`p[i].y` 就是第 `i` 个点的横、纵坐标。

对于相邻两点 `(xᵢ, yᵢ)`、`(xⱼ, yⱼ)`，计算：

**xᵢ × yⱼ − xⱼ × yᵢ**

这是从原点指向这两个点的向量的叉积，绝对值是它们与原点组成的三角形面积的两倍。符号表示两点绕原点的方向。

沿多边形边界把这些值加起来，三角形重叠或落在多边形外面的部分会按正负抵消，留下多边形面积的两倍。因此：

**S = |Σ(xᵢ × yᵢ₊₁ − xᵢ₊₁ × yᵢ)| / 2**

必须先求和，最后再取绝对值，不能对每一项分别取绝对值，否则该抵消的部分也会被加进去。顶点沿顺时针或逆时针排列只会改变总和的正负，取绝对值后面积相同。

```cpp
#include <stdio.h>
#include <math.h>

// caoxin

typedef struct {
    double x, y;
} Point;

int main() {
    int n;
    Point p[105];

    while (scanf("%d", &n) == 1 && n != 0) {
        for (int i = 0; i < n; i++) {
            scanf("%lf %lf", &p[i].x, &p[i].y);
        }

        double sum = 0;

        for (int i = 0; i < n; i++) {
            int j = (i + 1) % n;

            sum += p[i].x * p[j].y
                 - p[j].x * p[i].y;
        }

        printf("%.1f\n", fabs(sum) / 2.0);
    }

    return 0;
}
```

`j = (i + 1) % n` 取下一个顶点。处理最后一个点时，`i + 1 == n`，取余得到 `0`，这样就补上了最后一个点到第一个点的边。漏掉这条边，面积就可能算错。

例如三角形 `(0, 0)`、`(4, 0)`、`(0, 3)`，三项分别为 `0`、`12`、`0`，总和除以二，面积为 `6.0`。
