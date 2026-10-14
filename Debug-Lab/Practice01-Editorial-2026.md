---
permalink: debug-2026-cp-practice-1
title: '[Debug 2026 Freshman] CP Practice 01 - I/O and Flow Control Editorial'
pubDate: 2026-09-22
---

## 多组输入

这组练习中的许多题目都包含数量不确定的多组数据。虽然目前还没有专门学习函数，但这里需要先了解一点：**`scanf` 执行后会产生一个返回值**。

`scanf` 的返回值表示成功读取并存入变量的数据个数。例如：

```c
scanf("%d %d", &a, &b)
```

如果两个整数都成功读入，返回值就是 `2`；如果只成功读入一个，返回值就是 `1`；如果输入内容与要求的格式不匹配，一个数据也没有成功读入，返回值就是 `0`。

`EOF` 是 **End of File** 的缩写，表示文件结束。它是 C 语言标准库中定义的一个负整数常量，在常见的编译环境中通常为 `-1`。当 `scanf` 还没有成功读入任何数据就遇到文件末尾时，它会返回 `EOF`。

因此，下面这段代码中的 `scanf("%d %d", &a, &b)` 会先执行并得到一个整数返回值，然后再与 `EOF` 进行比较：

```c
while (scanf("%d %d", &a, &b) != EOF) {
    // 处理当前一组数据
}
```

`scanf(...) != EOF` 是一个条件表达式：没有读到文件末尾时条件成立，在 C 语言中结果为 `1`，循环继续；读到文件末尾时条件不成立，结果为 `0`，循环结束。于是程序就能不断读取并处理多组数据，直到输入结束。

> 严格来说，如果题目要求每组必须成功读入两个整数，写成 `scanf("%d %d", &a, &b) == 2` 会更加准确。不过在输入格式合法的 OJ 题目中，常用 `!= EOF` 表示“一直读到文件末尾”。

如果题目给出了结束标志，例如 I 题的 `0 0` 和 L 题的 `0`，则还需要在循环内判断结束条件。

---

## [A - HDU 1000 A + B Problem](https://vjudge.net/problem/HDU-1000)

每次读入两个整数，输出它们的和。题目没有提前给出数据组数，所以使用 `while (scanf(...) != EOF)` 处理到文件结束。

注意，`scanf` 中的变量前需要加取地址符 `&`。

```c
#include <stdio.h>

int main() {
    int a, b;
    while (scanf("%d %d", &a, &b) != EOF) {
        printf("%d", a + b);
    }
    return 0;
}
```

---

## [B - HDU 2002 计算球体积](https://vjudge.net/problem/HDU-2002)

球的体积公式为：

**V = 4 / 3 × π × r³**

半径可能是小数，因此使用 `double` 存储，并用 `%lf` 读入。表达式中的 `4 / 3` 如果全部使用整数，会先进行整数除法并得到 `1`，所以需要写成 `4.0 / 3.0`。

题目要求结果保留三位小数，可以使用 `printf("%.3lf", value)` 完成格式化输出。

```c
#include <stdio.h>

#define PI 3.1415927

int main() {
    double r;
    while (scanf("%lf", &r) != EOF) {
        printf("%.3lf\n", (4.0 / 3.0) * PI * r * r * r);
    }
    return 0;
}
```

---

## [C - HDU 2004 成绩转换](https://vjudge.net/problem/HDU-2004)

根据分数所在区间输出对应等级：

| 分数范围 | 等级 |
| --- | --- |
| 90 ≤ score ≤ 100 | A |
| 80 ≤ score < 90 | B |
| 70 ≤ score < 80 | C |
| 60 ≤ score < 70 | D |
| 0 ≤ score < 60 | E |

代码使用 `if-else` 从高分到低分依次判断。每个分支同时写出分数的上界和下界，并使用逻辑与运算符 `&&` 连接两个条件；如果所有区间都不符合，则输出 `Score is error!`。

```c
#include <stdio.h>

#define PI 3.1415927

int main() {
    int t;
    while (scanf("%d", &t) != EOF) {
        if (t <= 100 && t > 90) {
            printf("A\n");
        } else if (t <= 89 && t > 80) {
            printf("B\n");
        } else if (t <= 79 && t > 70) {
            printf("C\n");
        } else if (t <= 69 && t > 60) {
            printf("D\n");
        } else if (t <= 59 && t >= 0) {
            printf("E\n");
        } else {
            printf("Score is error!\n");
        }
    }
    return 0;
}
```

---

## [D - HDU 2039 三角形](https://vjudge.net/problem/HDU-2039)

三个正数能组成三角形，当且仅当任意两边之和都大于第三边：

**a + b > c，a + c > b，b + c > a**

本题的边长是正实数，而不一定是整数，因此必须使用 `double` 和 `%lf`。这是本题最容易忽略的地方。

```c
#include <stdio.h>

#define PI 3.1415927

int main() {
    int M;
    scanf("%d", &M);
    while (M--) {
        double a, b, c;
        scanf("%lf %lf %lf", &a, &b, &c);
        if (a + b > c && a + c > b && b + c > a) {
            printf("YES\n");
        } else {
            printf("NO\n");
        }
    }
    return 0;
}
```

---

## [E - HDU 1001 Sum Problem](https://vjudge.net/problem/HDU-1001)

题目要求计算 `1 + 2 + … + n`。这里直接使用循环累加，能够练习 `for` 循环的基本写法。

需要特别注意输出格式：每组答案后要额外输出一个空行，因此格式字符串中有两个 `\n`。

```c
#include <stdio.h>

int main() {
    int n;
    while (scanf("%d", &n) != EOF) {
        int ans = 0;
        for (int i = 1; i <= n; i++) {
            ans += i;
        }
        printf("%d\n\n", ans);
    }
    return 0;
}
```

当然，也可以使用等差数列求和公式 `n × (n + 1) / 2`。不过在刚开始练习循环时，用累加的方法更直观。

---

## [F - HDU 2006 求奇数的乘积](https://vjudge.net/problem/HDU-2006)

每组数据先给出整数个数 `n`，随后给出 `n` 个整数。遍历这些数，遇到奇数就乘入答案。

乘法的单位元是 `1`，所以 `ans` 应初始化为 `1`。判断奇数可以使用 `x % 2 != 0`，这种写法对负奇数也同样成立。

```c
#include <stdio.h>

int main() {
    int n;
    while (scanf("%d", &n) != EOF) {
        int ans = 1;
        for (int i = 0; i < n; i++) {
            int x;
            scanf("%d", &x);
            ans *= x % 2 ? x : 1;
        }
        printf("%d\n", ans);
    }
    return 0;
}
```

代码使用三目运算符 `ans *= x % 2 ? x : 1;` 完成判断：如果 `x` 是奇数就乘上 `x`，否则乘上 `1`，保持答案不变。

---

## [G - HDU 2005 第几天？](https://vjudge.net/problem/HDU-2005)

输入格式为 `yyyy/mm/dd`，`scanf` 的格式字符串也可以直接包含 `/`：

```c
scanf("%d/%d/%d", &y, &m, &d);
```

答案从当前月份的日期 `day` 开始，再依次加上之前每个完整月份的天数。二月需要根据当前年份是否为闰年来决定是 28 天还是 29 天。

闰年的判断规则是“四年一闰，百年不闰，四百年再闰”：

```c
(y % 4 == 0 && y % 100 != 0) || y % 400 == 0
```

```c
#include <stdio.h>

int main() {
    int y, m, d;
    while (scanf("%d/%d/%d", &y, &m, &d) != EOF) {
        int is_run = 0;
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
            is_run = 1;
        }
        int ans = d;
        for (int i = 1; i <= m - 1; i++) {
            if (i == 2) {
                if (is_run) {
                    ans += 29;
                } else {
                    ans += 28;
                }
            } else if (i == 1
                || i == 3
                || i == 5
                || i == 7
                || i == 8
                || i == 10
                || i == 12
            ) {
                ans += 31;
            } else {
                ans += 30;
            }
        }
        printf("%d\n", ans);
    }
    return 0;
}
```

当不确定逻辑运算符优先级时，主动添加括号通常比依赖记忆更稳妥。

---

## [H - HDU 2010 水仙花数](https://vjudge.net/problem/HDU-2010)

三位水仙花数是指各位数字的立方和等于它本身的数。对于枚举到的三位数 `i`，百位、十位和个位可以分别这样取得：

```c
int x = i / 100;
int y = i / 10 - x * 10;
int z = i % 10;
```

然后判断：

**x³ + y³ + z³ = i**

使用 `is_found` 记录当前区间内是否找到水仙花数。如果遍历结束后仍未找到，就输出 `no`。

```c
#include <stdio.h>
#include <math.h>

int main() {
    int m, n;
    while (scanf("%d %d", &m, &n) != EOF) {
        int is_found = 0;
        for (int i = m; i <= n; i++) {
            int x = i / 100;
            int y = i / 10 - x * 10;
            int z = i % 10;
            int res = pow(x, 3) + pow(y, 3) + pow(z, 3);
            if (i == res) {
                printf("%d ", i);
                is_found = 1;
            }
        }
        if (!is_found) {
            printf("no\n");
        }
    }
    return 0;
}
```

代码使用 `pow(x, 3)` 计算每一位数字的三次方。由于三位水仙花数的数量很少，本题也可以预先写出所有答案后直接判断区间，但枚举更能体现完整的求解过程。

---

## [I - HDU 2012 素数判定](https://vjudge.net/problem/HDU-2012)

对于区间 `[x, y]` 中的每个整数 `n`，题目要求判断 `n² + n + 41` 是否全部为素数。只要发现其中一个数不是素数，就可以立即停止当前区间的检查。

素数是大于 1，并且除 1 和自身外没有其他正因数的整数。当前代码按照素数的定义，从 `2` 开始逐个尝试可能的因数；一旦发现某个数不是素数，就不再检查区间内后面的数。

```c
#include <stdio.h>
#include <math.h>

int main() {
    int x, y;
    while (1) {
        scanf("%d %d", &x , &y);
        if (x == 0 && y == 0) {
            break;
        }
        int ans = 1;
        for (int i = x; i <= y; i++) {
            int x = i * i + i + 41;
            int is_prime = 1;
            if (x <= 1) {
                is_prime = 0;
            } else {
                for (int j = 2; j < x; j++) {
                    if (x % j == 0) {
                        is_prime = 0;
                    }
                }
            }
            if (!is_prime) {
                ans = 0;
                break;
            }
        }
        if (ans) {
            printf("OK\n");
        } else {
            printf("Sorry\n");
        }
    }
    return 0;
}
```

学习函数后，可以把素数判断单独封装成 `is_prime` 函数，让主程序的结构更加清晰。

---

## [J - HDU 2013 蟠桃记](https://vjudge.net/problem/HDU-2013)

猴子每天吃掉当前桃子的一半再多一个，到第 `n` 天准备吃时只剩下一个桃子。

设 `a[i]` 表示第 `i` 天开始时的桃子数量。猴子在第 `i` 天吃掉一半再多一个后，剩下的桃子就是第 `i + 1` 天开始时的数量，因此：

**a[i + 1] = a[i] / 2 - 1**

移项后可以得到从后一天向前一天倒推的递推式：

**a[i] = 2 × a[i + 1] + 2**

**写法一：循环倒推**

题目已经给出 `a[n] = 1`，所以可以令 `ans = 1`，再使用上面的递推式向前计算 `n - 1` 次，最终得到 `a[1]`。

```c
#include <stdio.h>

int main() {
    int n;
    while (scanf("%d", &n) != EOF) {
        int ans = 1;
        for (int i = n; i > 1; i--) {
            ans = 2 * ans + 2;
        }
        printf("%d\n", ans);
    }
    return 0;
}
```

循环一共执行 `n - 1` 次，因此时间复杂度为 `O(n)`，只使用了常数个变量，空间复杂度为 `O(1)`。

**写法二：推导通项公式**

递推式 `a[i] = 2 × a[i + 1] + 2` 中多出了一个 `+ 2`，不方便直接观察规律。令：

**b[i] = a[i] + 2**

把递推式代入后可得：

**b[i] = a[i] + 2 = 2 × a[i + 1] + 4 = 2 × b[i + 1]**

这样，数列 `b` 就是一个公比为 `2` 的等比数列。

题目告诉我们第 `n` 天开始时只剩一个桃子，所以 `a[n] = 1`，进而得到 `b[n] = a[n] + 2 = 3`。从第 `n` 天倒推到第 `1` 天一共需要乘 `n - 1` 次 `2`，因此：

**b[1] = 3 × 2ⁿ⁻¹**

最后根据 `a[1] = b[1] - 2`，得到第一天桃子数量的通项公式：

**a[1] = 3 × 2ⁿ⁻¹ - 2**

```c
#include <stdio.h>
#include <math.h>

int main() {
    int n;
    while (scanf("%d", &n) != EOF) {
        printf("%d\n", 3 * (int) pow(2, n - 1) - 2);
    }
    return 0;
}
```

代码中的 `pow(2, n - 1)` 用来计算 `2` 的 `n - 1` 次方。`pow` 的返回值是 `double`，因此按照原代码的写法，用 `(int)` 将结果转换为整数。

按照本题固定宽度数值运算的常见复杂度记法，通项公式只需要一次计算，因此时间复杂度为 `O(1)`，空间复杂度也为 `O(1)`。

---

## [K - HDU 2014 青年歌手大奖赛_评委会打分](https://vjudge.net/problem/HDU-2014)

去掉一个最高分和一个最低分后，计算其余分数的平均值。

读入分数的同时维护三个量：

- 所有分数之和 `ans`；
- 当前最高分 `mx`；
- 当前最低分 `mn`。

最终用 `(ans - mx - mn) / (n - 2)` 得到平均分。代码中的 `n * 1.0 - 2` 会使除法按照浮点数运算，最后保留两位小数输出。

```c
#include <stdio.h>
#include <math.h>

int main() {
    int n;
    while (scanf("%d", &n) != EOF) {
        double ans = 0;
        int mx = -1e9;
        int mn = 1e9;
        for (int i = 0; i < n; i++) {
            double x;
            scanf("%lf", &x);
            if (mx < x) {
                mx = x;
            }
            if (mn > x) {
                mn = x;
            }
            ans += x;
        }
        printf("%.2lf\n", (ans - mx - mn) / (n * 1.0 - 2));
    }
    return 0;
}
```

---

## [L - HDU 2021 发工资咯：）](https://vjudge.net/problem/HDU-2021)

人民币面额为 `100、50、10、5、2、1`。为了让纸币张数最少，应当优先使用尽可能多的大面额纸币，再处理剩余金额，这就是本题的贪心思路。

例如需要发 126 元：先使用 1 张 100 元，再使用 2 张 10 元，之后使用 1 张 5 元和 1 张 1 元，共 5 张。

代码按照面额从大到小依次处理。只要剩余工资还能使用当前面额，就减去一张纸币的面额，并把答案加一。

```c
#include <stdio.h>
#include <math.h>

int main() {
    int n;
    while(scanf("%d", &n) != EOF) {
        if (n == 0) {
            break;
        }
        int ans = 0;
        for (int i = 0; i < n; i++) {
            int x;
            scanf("%d", &x);
            while (x - 100 >= 0) {
                x -= 100;
                ans++;
            }
            while (x - 50 >= 0) {
                x -= 50;
                ans++;
            }
            while (x - 10 >= 0) {
                x -= 10;
                ans++;
            }
            while (x - 5 >= 0) {
                x -= 5;
                ans++;
            }
            while (x - 2 >= 0) {
                x -= 2;
                ans++;
            }
            while (x - 1 >= 0) {
                x -= 1;
                ans++;
            }
        }
        printf("%d", ans);
    }
    return 0;
}
```

这段代码没有使用数组，适合当前的学习进度。学习数组后，可以把所有面额存入数组，再用循环完成相同的处理。

---

## 小结

这 12 道题涉及的算法并不复杂，但集中体现了 OJ 入门阶段最常见的几个问题：

1. **看清输入何时结束。** 数据组数不确定时使用 `scanf(...) != EOF`；题目给出结束标志时还要主动 `break`。
2. **选择正确的数据类型。** D 题边长是实数，需要使用 `double`；B 题还要避免整数除法。
3. **认真处理边界。** 编写 C 题的分数区间时，需要仔细确认大于、小于以及是否包含等号。
4. **严格遵守输出格式。** E 题要求组间空行，H 题要求多个数字以空格分隔，空格和换行都要按照题目要求处理。
5. **把思路直接翻译成程序。** J 题从最后一天倒推，K 题边读边维护最值，L 题优先使用大面额纸币，都是把自然语言思路逐步落实为代码的例子。

遇到题目时，不必急着寻找复杂公式。先确认输入、输出和数据范围，再用分支与循环把已经想清楚的过程写出来，就是建立算法思维的第一步。
