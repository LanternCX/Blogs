# Debug 2025 Freshman - C Programing

## [Practice 02 - Array, String and Function](https://vjudge.net/contest/756608) Editorial

#### [A - P5724 求极差](https://vjudge.net/contest/756608#problem/A)

按要求输入 `n` 和数组 `a` 后，通过遍历数组时动态维护最小值 `mn` 和最大值 `mx` 求解即可

```c++
#include <math.h>
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int a[100] = {0};
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
    int mn = 1e9, mx = 0;
    for (int i = 0; i < n; i++) {
      	// 动态维护最大值最小值
        mn = fmin(a[i], mn);
        mx = fmax(a[i], mx);
    }
    printf("%d", mx - mn);
    return 0;
}
```

### [B - P1720 斐波那契数列](https://vjudge.net/contest/756608#problem/B)

观察题目，注意到给定的 $ F_n $ 公式实际上是斐波那契数列的通项公式。

我们使用斐波那契的递推公式能够更快地求解：$ feb_n = feb_{n-1} +feb_{n-2} $

需要注意的是，题目给定的数据范围包括第 0 项，此时 $ feb_0 = 0 $

```c++
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    double feb[100] = {0};
  	// 	初始化斐波那契数列
    feb[0] = 0;
    feb[1] = 1;
    feb[2] = 1;
  	// 通过递推公式求解
    for (int i = 3; i <= n; i++) {
        feb[i] = feb[i - 1] + feb[i - 2];
    }
    printf("%.2lf", feb[n]);
    return 0;
}
```

### [C - P1914 凯撒密码](https://vjudge.net/contest/756608#problem/C)

主要考察字符串的使用，直接根据题意输入之后偏移即可

对于偏移值超过 `'z'` 的值需要分类讨论

需要注意的是，在 ASCILL 码表中 `'z' + 6` 的真实值已经超过了码表的表示范围，如果最终的加和超过了 ASCILL 码表的表示范围，会出现一些意料之外的错误，因此需要直接使用公式求解，不能通过类似 `char ch = str[i] + n` 之类的中间变量比较，详见代码：

```c++
#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    char str[100];
    scanf("%s", str);
    int len = strlen(str);
    for (int i = 0; i < len; i++) {
      	// 错误：
      	// char ch = str[i] + n;
      	// if (ch + n > 'z')
        if (str[i] + n > 'z') {
            str[i] = str[i] + n - ('z' - 'a') - 1;
        } else {
            str[i] = str[i] + n;
        }
    }
    printf("%s", str);
    return 0;
}
```

### [D - P5733 自动修正](https://vjudge.net/problem/洛谷-P5733)

和上一题类似，根据题意输入之后遍历字符串进行大小写转换，然后输出即可

```c++
#include <stdio.h>
#include <string.h>

int main() {
    char str[100];
    scanf("%s", str);
    int len = strlen(str);
    for (int i = 0; i < len; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') {
          	// 大小写转换
            str[i] = str[i] + 'A' - 'a';
        }
    }
    printf("%s", str);
    return 0;
}
```

### [E - P5735 距离函数](https://vjudge.net/problem/洛谷-P5735)

根据距离函数的定义实现一个函数 `double dist(double x1, double y1, double x2, double y2) ` 计算点对 `((x1, y1), (x2, y2))` 的距离

通过 `double a[i][j]` 的存储结构，表示第 `i` 个点坐标值 `x = a[i][0], y = a[i][1]`

```c++
#include <math.h>
#include <stdio.h>
#include <string.h>

double dist(double x1, double y1, double x2, double y2) {
    return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

int main() {
    double a[3][2];
    for (int i = 0; i < 3; i++) {
        scanf("%lf %lf", &a[i][0], &a[i][1]);
    }
    double ans = 0;
    for (int i = 0; i < 3; i++) {
      	// (i + 1) % 3 防止当 i = 2 时下标越界
        ans += dist(a[i][0], a[i][1], a[(i + 1) % 3][0], a[(i + 1) % 3][1]);
    }
    printf("%.2lf", ans);
    return 0;
}
```

### [F - P5737 闰年展示](https://vjudge.net/problem/洛谷-P5737)

根据闰年的定义，实现一个函数 `int is_run(int y)` 判断输入的 `y` 是否为闰年

从 `x` 到 `y` 枚举给定的数据范围中的每一个年份

```c++
#include <stdio.h>
#include <string.h>

int is_run(int y) {
    return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);
}

int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    int a[10000] = {0};
    int idx = 0;
    for (int i = x; i <= y; i++) {
        if (is_run(i)) {
            a[idx++] = i;
        }
    }
    printf("%d\n", idx);
    for (int i = 0; i < idx; i++) {
        printf("%d ", a[i]);
    }
    return 0;
}
```

### [G - P5730 显示屏](https://vjudge.net/problem/洛谷-P5730)

```c++
#include <stdio.h>

const char map[5][50] = {
    "XXX...X.XXX.XXX.X.X.XXX.XXX.XXX.XXX.XXX",
    "X.X...X...X...X.X.X.X...X.....X.X.X.X.X",
    "X.X...X.XXX.XXX.XXX.XXX.XXX...X.XXX.XXX",
    "X.X...X.X.....X...X...X.X.X...X.X.X...X",
    "XXX...X.XXX.XXX...X.XXX.XXX...X.XXX.XXX",
};

int main() {
    int n;
    scanf("%d", &n);
    char str[1000];
    scanf("%s", str);
    int arr[1000];
    for (int i = 0; i < n; i++) {
        arr[i] = str[i] - '0';
    }
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < n; j++) {
            int num = arr[j];
            int idx = num * 4;
            if (j > 0) {
                printf(".");
            }
            for (int k = idx; k < idx + 3; k++) {
                printf("%c", map[i][k]);
            }
        }
        printf("\n");
    }
    return 0;
}
```

### [H - P1125 笨小猴](https://vjudge.net/problem/洛谷-P1125)

首先根据质数的定义我们能通过枚举一个数的的因数判断这个数是否为质数，然后写出质数判断函数 `int is_prime(int n)`

其次，注意到英文字母的数量为 26 个，我们可以使用 `cnt[26]` 这样的数组，数组的每一位对应字母表中的一位字母。

然后在遍历字符串的时候使用 `cnt[str[i] - 'a']++;` 统计每个字符的出现次数，最后求出最大值最小值即可。

需要注意的是，统计的时候大部分字母实际上都是不会出现的，因此很多字母的出现次数应当是 0，而 0 不能算作出现次数的最小值。

```c++
#include <math.h>
#include <stdio.h>
#include <string.h>

/**
 * @brief 素数判断
 * @param n 需要判断的数
 * @return 是否为数组
 */
int is_prime(int n) {
    if (n == 0 || n == 1) {
        return 0;
    }
    for (int i = 2; i < n; i++) {
        if (n % i == 0) {
            return 0;
        }
    }
    return 1;
}

int main() {
    char str[200];
    scanf("%s", str);
    int cnt[26] = {0};
    int len = strlen(str);
    for (int i = 0; i < len; i++) {
      	// 	统计字母的出现次数
        cnt[str[i] - 'a']++;
    }
    int mx = 0, mn = 1e9;
    for (int i = 0; i < 26; i++) {
        mx = fmax(mx, cnt[i]);
      	// 最小值不统计 0
        if (cnt[i] > 0) {
            mn = fmin(mn, cnt[i]);
        }
    }
    int det = mx - mn;
    if (is_prime(det)) {
        printf("Lucky Word\n%d", det);
    } else {
        printf("No Answer\n%d", 0);
    }
    return 0;
}
```

### [I - P1003 铺地毯](https://vjudge.net/problem/洛谷-P1003)

直接开一个 `map[100000][100000]` 对铺地毯的过程进行模拟并不能通过此题，因为这个二维数组使用的空间为 $ 10^5 \times 10^5 = 10^{10}$ 超过了判题机最大能存储的范围 $ 10^9 $ 

因此我们需要使用空间上更优的方法实现这题。

我们注意到，可以先对每张地毯进行存储，在存储之后对每一张地毯判断目标点上是否覆盖了该地毯，最后对地毯的编号取最大值即可。

这种不直接模拟，而是对离散的点分别求解的思想，又叫做离散化。

```c++
#include <math.h>
#include <stdio.h>
#include <string.h>

int main() {
    int a[10001], b[10001], g[10001], k[10001];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d %d %d %d", &a[i], &b[i], &g[i], &k[i]);
    }
    int x, y;
    scanf("%d %d", &x, &y);
    int ans = -1;
    for (int i = 0; i < n; i++) {
      	// 取出地毯并计算上下左右边界
        int x1 = a[i], y1 = b[i], x2 = a[i] + g[i], y2 = b[i] + k[i];
        if (x >= x1 && y >= y1 && x <= x2 && y <= y2) {
          	// 判断点 (x, y) 上是否覆盖了该地毯
            ans = fmax(ans, i + 1);
        }
    }
    printf("%d", ans);
    return 0;
}
```

### [J - P1007 独木桥](https://vjudge.net/problem/洛谷-P1007)

我们注意到如果只考虑所有士兵的时间，不考虑每个士兵的时间，两个士兵相遇之后掉头实际上可以看作两个士兵相互穿过。

从这点出发，我们就能很简单地写出代码：对于每一个士兵下桥的最快时间是 `fmin(l + 1 - arr[i], arr[i])` 下桥的最慢时间是 `fmax(l + 1 - arr[i], arr[i])` 

所有士兵均采用最快方式下桥，对每个士兵士兵下桥的时间的取最大值就是所有士兵的均下桥的最小值，同理可以算出最大值。

```c++
#include <math.h>
#include <stdio.h>
#include <string.h>

int main() {
    int l, n;
    scanf("%d %d", &l, &n);
    int arr[5005];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int ans1 = 0, ans2 = 0;
    for (int i = 0; i < n; i++) {
        ans1 = fmax(ans1, fmin(l + 1 - arr[i], arr[i]));
        ans2 = fmax(ans2, fmax(l + 1 - arr[i], arr[i]));
    }
    printf("%d %d", ans1, ans2);
    return 0;
}
```

