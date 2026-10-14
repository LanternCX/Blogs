---
permalink: debug-2026-cp-practice-2
title: "[Debug 2026 Freshman] CP Practice 02"
pubDate: 2026-10-12
---

## 字符串输入

HDOJ 似乎会禁用 `gets` 和 `fgets`，所以这里自己实现了 `readLine` 来读取整行字符串。

先用 `scanf` 读取组数，再读字符串时，需要处理留在输入缓冲区中的换行符：

```cpp
int n;
scanf("%d", &n);
getchar();
while (n--) {
    char str[100 + 10];
    readLine(str, sizeof(str));
    // 处理当前一行字符串
}
```

例如输入 `2` 后换行，`scanf("%d", &n)` 读走了 `2`，但换行符还留着。`readLine` 遇到换行就会停止：

```cpp
while ((c = getchar()) != '\n' && c != EOF) {
    if (i < size - 1) {
        s[i++] = (char)c;
    }
}
s[i] = '\0';
```

如果省略前面的 `getchar()`，第一次调用 `readLine` 就会直接读到这个换行符，得到空字符串，后面的输入也会错位。因此，读完组数后先用 `getchar()` 把换行符读走。之后每行的换行符由 `readLine` 处理，不需要再额外读取。

注意，`scanf("%d\n", &n)` 中的 `\n` 会跳过连续的空白字符，并不是只读走一个换行。如果这样写，后面再调用 `getchar()`，就会读走下一行的首字符。例如下一行是 `aeiou`，最终读到的就只剩 `eiou`。

这里假设组数后紧接换行。如果行末还有空格，则需要继续读到换行，不能只调用一次 `getchar()`。

---

## [A - HDU 2014 青年歌手大奖赛_评委会打分](https://vjudge.net/problem/HDU-2014)

这题第一周做过，去掉一个最高分和一个最低分，再求平均值：

**平均分 = (总分 − 最高分 − 最低分) / (n − 2)**

这次先把分数存进数组，再分别写 `get_sum`、`get_max`、`get_min` 三个函数。每个函数遍历一次数组，返回总和、最大值或最小值，最后代入公式即可。

分子和分母都是整数，直接相除会丢掉小数部分，所以代码先用 C++ 的 `double(...)` 转换分子，最后保留两位小数输出。

```cpp
#include <stdio.h>
#include <math.h>

int a[100 + 10];

int get_max(int a[], int n) {
    int mx = -1e9;
    for (int i = 0; i < n; i++) {
        mx = fmax(a[i], mx);
    }
    return mx;
}


int get_min(int a[], int n) {
    int mn = 1e9;
    for (int i = 0; i < n; i++) {
        mn = fmin(a[i], mn);
    }
    return mn;
}

int get_sum(int a[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
       sum += a[i];
    }
    return sum;
}

int main() {
    int n;
    while (scanf("%d", &n) != EOF) {
        for (int i = 0; i < n; i++) {
            scanf("%d", &a[i]);
        }
        printf("%.2lf\n", double(get_sum(a, n) - get_max(a, n) - get_min(a, n)) / (n - 2));
    }
    return 0;
}
```

---

## [B - HDU 2016 数据的交换输出](https://vjudge.net/problem/HDU-2016)

找到最小元素，与第一个元素交换。例如 `3 1 2` 交换后是 `1 3 2`，其余位置不动。

`get_min_idx` 在找到更小的数时，同时更新最小值 `mn` 和下标 `idx`。函数返回 `idx`，主程序就能找到要交换的 `a[idx]`。

交换前先用 `temp` 存下 `a[idx]`。否则执行 `a[idx] = a[0]` 后，原来的最小值就丢了。

```cpp
#include <stdio.h>
#include <math.h>

int a[100 + 10];

int get_min_idx(int a[], int n) {
    int mn = a[0];
    int idx = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] < mn) {
            mn = a[i];
            idx = i;
        }
    }
    return idx;
}

int main() {
    int n;
    while (1) {
        scanf("%d", &n);
        if (n == 0) {
            break;
        }
        for (int i = 0; i < n; i++) {
            scanf("%d", &a[i]);
        }
        int idx = get_min_idx(a, n);
        
        int temp = a[idx];
        a[idx] = a[0];
        a[0] = temp;

        for (int i = 0; i < n; i++) {
            printf("%d", a[i]);
            printf(i != (n - 1) ? " " : "\n");
        }
    }
    return 0;
}
```

---

## [C - HDU 2019 数列有序!](https://vjudge.net/problem/HDU-2019)

数列已经有序，只要找到 `m` 应该放的位置。例如把 `4` 插入 `1 3 5`，它应该放在 `3` 和 `5` 之间，对应的条件就是：

**a[i − 1] ≤ m < a[i]**

找到后令 `idx = i`，表示在 `a[i]` 前面插入。如果没有找到这样的相邻元素，就检查两端：`m < a[0]` 时放在开头，否则放在末尾。

不用真的移动数组元素，按顺序输出 `a[0]` 到 `a[idx - 1]`、`m`、`a[idx]` 到 `a[n - 1]`，就得到了插入后的数列。

```cpp
#include <stdio.h>
#include <math.h>

int a[100 + 10];

int main() {
    int n, m;
    while (1) {
        scanf("%d %d", &n, &m);
        if (n == 0 && m == 0) {
            break;
        }
        int idx = -1;
        for (int i = 0; i < n; i++) {
            scanf("%d", &a[i]);
            if (i != 0) {
                if (a[i - 1] <= m && a[i] > m) {
                    idx = i;
                }   
            }
        }
        if (idx == -1) {
            if (a[0] > m) {
                idx = 0;
            } else {
                idx = n;
            }
        }

        for (int i = 0; i < idx; i++) {
            printf("%d ", a[i]);
        }
        printf("%d", m);
        printf(idx != n ? " " : "\n");
        for (int i = idx; i < n; i++) {
            printf("%d", a[i]);
            printf(i != (n - 1) ? " " : "\n");
        }
    }
    return 0;
}
```

> 视频中的原解漏了插入末尾时的换行：这时 `idx == n`，后面的循环一次也不会执行。这里让 `m` 在末尾时直接输出换行，否则下一组答案会接在同一行。

---

## [D - HDU 2020 绝对值排序](https://vjudge.net/problem/HDU-2020)

这里使用选择排序。先从整个数组中选出绝对值最大的数，换到第一个位置；再从剩下的数中选出绝对值最大的，换到第二个位置，依次做下去。

因此，第 `i` 轮只需要检查 `a[i]` 到 `a[n - 1]`。用 `idx` 记下选中位置，再交换 `a[i]` 和 `a[idx]`，前面已经排好的部分不用再动。

比较时用 `abs()` 取绝对值，交换时保留原数。例如 `-3 1 -5` 应排成 `-5 -3 1`。

> 视频中的原解没有包含 `<stdlib.h>`，这里补上了。使用整数 `abs()` 时应包含这个头文件，有些编译环境会通过其他头文件带入它的声明，所以没写也可能编译通过。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

int a[100 + 10];

int main() {
    int n, m;
    while (1) {
        scanf("%d", &n);
        if (n == 0) {
            break;
        }
        for (int i = 0; i < n; i++) {
            scanf("%d", &a[i]);
        }
        
        for (int i = 0; i < n; i++) {
            int idx = i, max = abs(a[i]);
            for (int j = i + 1; j < n; j++) {
                if (abs(a[j]) > max) {
                    idx = j;
                    max = abs(a[j]);
                }
            }
            int temp = a[i];
            a[i] = a[idx];
            a[idx] = temp;
        }

        for (int i = 0; i < n; i++) {
            printf("%d", a[i]);
            printf(i != (n - 1) ? " " : "\n");
        }
    }
    return 0;
}
```

---

## [E - HDU 2022 海选女主角](https://vjudge.net/problem/HDU-2022)

用两层循环遍历分数，遇到绝对值更大的，就更新 `max` 并记下行列下标 `(x, y)`。输出时，下标加一得到题目要求的行列编号，分数输出原值。

绝对值相同时，要选行号最小的；同一行里选列号最小的。按从上到下、从左到右的顺序遍历，先遇到的就是应该保留的，所以更新条件用 `>`。写成 `>=` 就会被后面相同绝对值的分数替换掉。

> 视频中的原解把 `max` 设成了 `0`。如果所有分数都是 `0`，一次更新都不会发生，最后就会访问 `a[-1][-1]`。这里改成 `-1`，让第一个分数就能更新坐标。另外补了输出末尾的换行和 `abs()` 所需的 `<stdlib.h>`。

```cpp
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

int a[100 + 10][100 + 10];

int main() {
    int m, n;
    while (scanf("%d %d", &n, &m) != EOF) {
        int x = -1, y = -1, max = -1;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                scanf("%d", &a[i][j]);

                if (abs(a[i][j]) > max) {
                    max = abs(a[i][j]);
                    x = i;
                    y = j;
                }
            }
        }
        printf("%d %d %d\n", x + 1, y + 1, a[x][y]);
    }

    return 0;
}
```

---

## [F - HDU 2023 求平均成绩](https://vjudge.net/problem/HDU-2023)

用 `a[i][j]` 存第 `i` 个学生的第 `j` 门成绩，每行是一个学生，每列是一门课。

前两部分都是求平均值：按行求和，除以课程数 `m`，得到每个学生的平均分；按列求和，除以学生数 `n`，得到每门课的平均分，存入 `avg[j]`。

第三部分要求学生的**每一门成绩**都不低于这门课的平均分。只要有一门低于平均分，就不能计入人数，其他科目再高也没用。代码用 `cnt` 记录低于平均分的科目数，只有 `cnt == 0` 才给 `ans` 加一。等于平均分也符合要求，所以判断不合格时用 `<`。

```cpp
#include <stdio.h>
#include <math.h>

int a[100 + 10][100 + 10];
double avg[100 + 10];

int main() {
    int n, m;
    while (scanf("%d %d", &n, &m) != EOF) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                scanf("%d", &a[i][j]);
            }
        }

        for (int i = 0; i < n; i++) {
            int sum = 0;
            for (int j = 0; j < m; j++) {
                sum += a[i][j];
            }
            printf("%.2lf", sum * 1.0 / m);
            printf(i != (n - 1) ? " " : "\n");
        }
        
        for (int j = 0; j < m; j++) {
            int sum = 0;
            for (int i = 0; i < n; i++) {
                sum += a[i][j];
            }
            avg[j] = sum * 1.0 / n;
            printf("%.2lf", avg[j]);
            printf(j != (m - 1) ? " " : "\n");
        }

        int ans = 0;
        for (int i = 0; i < n; i++) {
            int cnt = 0;
            for (int j = 0; j < m; j++) {
                cnt += a[i][j] < avg[j] ? 1 : 0;
            }
            
            ans += cnt > 0 ? 0 : 1;
        }
        printf("%d\n\n", ans);
    }
    return 0;
}
```

平均分只在输出时保留两位小数，比较时直接使用 `avg[j]`。每组结果后还要一个空行，所以最后输出 `\n\n`。

---

## [G - HDU 2017 字符串统计](https://vjudge.net/problem/HDU-2017)

遍历字符串，满足 `s[i] >= '0' && s[i] <= '9'` 就把 `cnt` 加一。这里统计的是数字字符的个数，例如 `a123` 中有三个，不需要把 `123` 转换成整数。

视频中的原解用了 C++ 的 `string` 和 `cin`，因为当时还没发现是 `gets` 被限制了。本题字符串不含空格，可以用 `cin >> s` 读取，`s.length()` 得到字符串长度。

```cpp
#include <string>
#include <iostream>

using namespace std;

int main() {
    int n;
    scanf("%d\n", &n);
    while (n--) {

        string s;
        cin >> s;
        int cnt = 0;

        for (int i = 0; i < s.length(); i++) {
            if (s[i] >= '0' && s[i] <= '9') {
                cnt++;
            }
        }

        printf("%d\n", cnt);
    }
    return 0;
}
```

`cin >> s` 会跳过开头的空格和换行，这里不用再加 `getchar()`，`scanf` 里的 `\n` 也可以省略。

---

## [H - HDU 2024 C语言合法标识符](https://vjudge.net/problem/HDU-2024)

按本题的规则，标识符只能包含字母、数字和下划线，而且不能以数字开头：

- `a1`、`_a` 合法；
- `1a`、`a-b`、`a b` 不合法。

代码逐个检查字符。字母和下划线可以直接给 `cnt` 加一，数字还要满足 `i != 0`。如果 `cnt` 等于字符串长度，说明每个字符都符合要求；再排除空字符串，就可以输出 `yes`。

```cpp

#include <string.h>
#include <stdio.h>

void readLine(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

int main() {
    int n;
    scanf("%d", &n);
    getchar();

    while (n--) {
        char str[100];
        readLine(str, sizeof(str));
        int cnt = 0;
        for (int i = 0; i < strlen(str); i++) {
            if (str[i] >= '0' && str[i] <= '9' && i != 0) {
                cnt++;
            }
            if (str[i] >= 'a' && str[i] <= 'z' || str[i] >= 'A' && str[i] <= 'Z') {
                cnt++;
            }
            if (str[i] == '_') {
                cnt++;
            }
        }
        printf(cnt > 0 && cnt == strlen(str) ? "yes\n" : "no\n");
    }
    return 0;
}
```

输入 `a b` 时，必须把整行读进来才能发现空格。用 `%s` 只会读到 `a`，就会误判为合法。

> 视频中的原解在 `scanf("%d\n", &n)` 后面又接了 `getchar()`，会多吃掉第一行的首字符。比如 `1abc` 被读成 `abc`，判断就错了。这里去掉了 `scanf` 中的 `\n`，另外加上 `cnt > 0`，排除空字符串。

---

## [I - HDU 2025 查找最大元素](https://vjudge.net/problem/HDU-2025)

先遍历一次，找到编码最大的字符 `max`。再遍历一次，逐个输出字符，遇到 `max` 就多输出一个 `(max)`。

最大字符出现几次，就标记几次。例如 `zaz` 要输出 `z(max)az(max)`。直接在输出时加标记即可，不用修改数组。

```cpp
#include <string.h>
#include <stdio.h>
#include <math.h>

void readLine(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

int main() {
    char str[100 + 10];
    while (scanf("%c", &str[0]) != EOF) {
        readLine(str + 1, sizeof(str) - 1);
        char max = '\0';
        for (int i = 0; i < strlen(str); i++) {
            max = fmax(str[i], max);
        }
        for (int i = 0; i < strlen(str); i++) {
            printf("%c", str[i]);
            if (str[i] == max) {
                printf("(max)");
            }
        }
        printf("\n");
    }
    return 0;
}
```

本题没有给数据组数，所以先用 `%c` 读一个字符，判断是否到了 `EOF`。首字符已经放进 `str[0]`，剩下的就交给 `readLine(str + 1, sizeof(str) - 1)`，从 `str[1]` 开始存。

> 视频中的原解用了 `str[100]`，这里改成了 `str[100 + 10]`。数组还要存末尾的 `\0`，原来的写法只能存下 99 个字符，输入 100 个时会丢掉最后一个。

---

## [J - HDU 2026 首字母变大写](https://vjudge.net/problem/HDU-2026)

关键是判断单词从哪里开始：位于字符串开头，或者前一个字符是空格。如果这个位置上是小写字母，就用 `str[i] += 'A' - 'a'` 转成大写，其余字符照常输出。

先单独判断 `i == 0`，再用 `else if` 检查前一个字符，这样就不会访问 `str[-1]`。

> 视频中的原解用了 `str[100]`，这题也改大了，原因和 I 题一样：100 个字符之外，还要留一个位置存 `\0`。

```cpp
#include <string.h>
#include <stdio.h>
#include <math.h>

void readLine(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

int main() {
    char str[100 + 10];
    while (scanf("%c", &str[0]) != EOF) {
        readLine(str + 1, sizeof(str) - 1);
        for (int i = 0; i < strlen(str); i++) {
            int flag = 0;
            if (str[i] >= 'a' && str[i] <= 'z') {
                if (i == 0) {
                    flag = 1;
                } else if (str[i - 1] == ' ') {
                    flag = 1;
                }

                if (flag) {
                    str[i] += 'A' - 'a';
                }
            }
            printf("%c", str[i]);
        }
        printf("\n");
    }
    return 0;
}
```

---

## [K - HDU 2027 统计元音](https://vjudge.net/problem/HDU-2027)

五个元音要分别计数，所以用 `count[5]` 保存次数，`map = "aeiou"` 保存对应的字母。例如 `map[1]` 是 `e`，`count[1]` 就记录 `e` 出现了几次。

遍历字符串，把当前字符与这五个字母逐一比较。如果 `str[i] == map[j]`，就给 `count[j]` 加一。输出时也按同样的下标取字母和次数。

```cpp
#include <string.h>
#include <stdio.h>
#include <math.h>

void readLine(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

char map[] = "aeiou";

int main() {
    int n;
    scanf("%d", &n);
    getchar();
    while (n--) {
        char str[100 + 10];
        readLine(str, sizeof(str));
        int count[5] = {0, 0, 0,0,0 };
        for (int i = 0; i < strlen(str); i++) {
            for (int j = 0; j < 5; j++) {
                count[j] += str[i] == map[j] ? 1 : 0;
            }
        }
        for (int i = 0; i < 5; i++) {
            printf("%c:%d\n", map[i], count[i]);
        }
        if (n > 0) {
            printf("\n");
        }
    }
    return 0;
}
```

> 视频中的原解已经 AC。这里按题面要求，去掉了最后一组后多余的空行：`while (n--)` 中的 `n` 是剩余组数，只有 `n > 0` 才再输出空行。数组也改大了，避免 100 个字符只读进 99 个。

---

## [L - HDU 2029 Palindromes _easy version](https://vjudge.net/problem/HDU-2029)

回文要求两端的字符一一相等。用 `i` 指向开头、`j` 指向末尾，先比较 `str[i]` 和 `str[j]`，相等再向中间移动。比如 `abba` 先比较两端的 `a`，再比较中间的 `b`。

只要有一对不同，就输出 `no` 并退出循环。如果一直比较到 `i >= j` 都没有不同，就输出 `yes`。奇数长度时，中间剩下的那个字符不需要比较。

> 视频中的原解把 `i++, j--` 写在了比较前面，漏掉了首尾。例如 `abbd` 会直接比较中间两个 `b`，错误输出 `yes`。这里改成先比较，再移动下标。数组也从 `str[100]` 改大了，给 `\0` 留出位置。

```cpp
#include <string.h>
#include <stdio.h>
#include <math.h>

void readLine(char s[], int size) {
    int i = 0;
    int c;

    while ((c = getchar()) != '\n' && c != EOF) {
        if (i < size - 1) {
            s[i++] = (char)c;
        }
    }

    s[i] = '\0';
}

char map[] = "aeiou";

int main() {
    int n;
    scanf("%d", &n);
    getchar();
    while (n--) {
        char str[100 + 10];
        readLine(str, sizeof(str));
        int i = 0, j = strlen(str) - 1;
        int flag = 1;
        while (i < j) {
            if (str[i] != str[j]) {
                printf("no\n");
                flag = 0;
                break;
            }
            i++, j--;
        }
        if (flag) {
            printf("yes\n");
        }
    }
    return 0;
}
```

---

## 小结

检查代码时，可以专门试一下这些情况：C 题插到最前面或最后面，E 题所有分数都是 `0`，H 题以数字开头，L 题只有首尾不同。只用普通样例，很容易漏掉这些问题。
