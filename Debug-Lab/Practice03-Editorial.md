# Debug 2025 Freshman - C Programing

## [Practice 03 - Struct, Pointer and Debugger](https://vjudge.net/contest/758974) Editorial

### [A - P5743 猴子吃桃](https://vjudge.net/contest/758974#problem/A)

设数列顺序为从后向前逆推，倒数第 $ n $ 项的为值 $a_n$ 。那么根据题意可以求出递推公式 $ a_n = (a_{n - 1} + 1) \cdot 2 $，直接用 `for` 循环实现即可

当然也可以观察规律或者使用数学方法求出通项公式为 $ a_n = 2^{n - 1} \cdot 3 - 2 $，直接通过通项公式求解也可

这里的 `1 << x` 是一种 $2^x$ 的值的简单表示与快速计算方法。其中 `<<` 称为移位运算符，是 C 语言中位运算的一种，可以看：[位运算 | 菜鸟教程](https://www.runoob.com/w3cnote/bit-operation.html)。

```c++
#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", (1 << (n - 1)) * 3 - 2);
    return 0;
}
```

### [B - P5744 培训](https://vjudge.net/contest/758974#problem/B)

按照题意定义结构体后进行输入

再按照题意进行数据处理之后输出即可

```c++
#include <stdio.h>
#include <math.h>

typedef struct {
    char name[1000];
    int age, sc;
} node;

int main() {
    int n;
    scanf("%d", &n);
    node arr[10];
    for (int i = 0; i < n; i++) {
        char name[1000];
        int age, sc;
        scanf("%s %d %d", arr[i].name, &arr[i].age, &arr[i].sc);
    }
    for (int i = 0; i < n; i++) {
        // 进行浮点数运算之后需要转换为 int 类型。
        // 这一部分涉及到 C 语言中数据类型运算时的强制转换规则，大家可以自行学习一下
        printf("%s %d %.0f\n", arr[i].name, arr[i].age + 1, fmin(arr[i].sc * 1.2, 600));
    }
    return 0;
}
```

### [C - P5740 最厉害的学生](https://vjudge.net/contest/758974#problem/C)

和上一题类似，定义结构体后进行输入，然后按照题目要求计算总分和最大值，最后进行输出即可

```c++
#include <stdio.h>
#include <math.h>

typedef struct {
    char name[1000];
    int a, b, c, sum;
} node;

int main() {
    int n;
    scanf("%d", &n);
    node arr[1010];
    int max = 0;
    for (int i = 0; i < n; i++) {
        scanf("%s %d %d %d", arr[i].name, &arr[i].a, &arr[i].b, &arr[i].c);
        arr[i].sum = arr[i].a + arr[i].b + arr[i].c;
        max = fmax(max, arr[i].sum);
    }
    for (int i = 0; i < n; i++) {
        if (arr[i].sum == max) {
            printf("%s %d %d %d", arr[i].name, arr[i].a, arr[i].b, arr[i].c);
            break;
        }
    }
    return 0;
}
```

### [D - P5741 旗鼓相当的对手](https://vjudge.net/contest/758974#problem/D)

和前两题类似，定义结构体后进行输入，并计算总分。

最后按照题目定义判断条件并输出即可。

```c++
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char name[1000];
    int a, b, c, sum;
} node;

int main() {
    int n;
    scanf("%d", &n);
    node arr[1010];
    for (int i = 0; i < n; i++) {
        scanf("%s %d %d %d", arr[i].name, &arr[i].a, &arr[i].b, &arr[i].c);
        arr[i].sum = arr[i].a + arr[i].b + arr[i].c;
    }
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (abs(arr[i].a - arr[j].a) <= 5 && 
                abs(arr[i].b - arr[j].b) <= 5 && 
                abs(arr[i].c - arr[j].c) <= 5 && 
                abs(arr[i].sum - arr[j].sum) <= 10
            ) {
                printf("%s %s\n", arr[i].name, arr[j].name);
            }
        }
    }
    return 0;
}
```

### [E - P5742 评等级](https://vjudge.net/contest/758974#problem/E)

和前四题类似，定义结构体之后进行输入并计算加权分后结合题设条件判断并输出即可。

值得注意的是，题目提到了浮点数的精度问题，因此我们选择将一位小数的比较的不等式转换为左右式子乘十后进行整型比较。

```c++
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id, a, b, sc;
} node;

int main() {
    int n;
    scanf("%d", &n);
    node arr[1010];
    for (int i = 0; i < n; i++) {
        scanf("%d %d %d", &arr[i].id, &arr[i].a, &arr[i].b);
        // 乘十之后再进行比较
        arr[i].sc = arr[i].a * 7 + arr[i].b * 3;
    }
    for (int i = 0; i < n; i++) {
        // 按照题意乘十之后比较
        if (arr[i].sc >= 800 && arr[i].a + arr[i].b > 140) {
            printf("Excellent\n");
        } else {
            printf("Not excellent\n");
        }
    }
    return 0;
}
```

### [F - P2670 扫雷游戏](https://vjudge.net/contest/758974#problem/F)

根据题意进行模拟即可。

思路是先开一个符合题意的地图，所有的值初始化为 0，表示当前格附近的地雷数量，对于有地雷的格，设置为 -1。之后就可以这个地图上维护地雷的数量。

输入之后，遍历地图，每遇到一个地雷，就将这个地雷为中心的九宫格中非地雷的格点的值加上一。

也就是通过地雷去更新每个非地雷格点的数字。

当然对每个非地雷格点检查周围的地雷数量也是可以的。

```c++

#include <stdio.h>

int mp[110][110];

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            char ch = '\n';
            while (ch != '*' && ch != '?') {
                scanf("%c", &ch);
            }
            
            // 如果是非地雷格点就不进行数量更新
            if (ch != '*') {
                continue;
            }
            // 标记当前格点为地雷格点
            mp[i][j] = -1;
            // 更新这个地雷周围的非地雷格点的地雷数量
            for (int x = -1; x <= 1; x++) {
                for (int y = -1; y <= 1; y++) {
                    // 防溢出
                    if (i + x < 0 || j + y < 0) {
                        continue;
                    }
                    // 跳过地雷格点
                    if (mp[i + x][j + y] == -1) {
                        continue;
                    }
                    // 更新非地雷格点的计数器
                    mp[i + x][j + y]++;
                }
            }
        }
    }
    
    // 根据题意打印地图
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (mp[i][j] == -1) {
                printf("*");
            } else {
                printf("%d", mp[i][j]);
            }
        }
        printf("\n");
    }
    return 0;
}
```

### [G - P2415 集合求和](https://vjudge.net/contest/758974#problem/G)

一道小小的数学题 + 思维题。

我们也可以通过暴力模拟的方式求解，无论如何我们最后会发现最终的答案总是所有数的和 `sum` 的倍数，倍率是 $ 2^{n - 1}$。

从常规的思路出发，我们注意到实际上划分子集的方式并不会影响最终结果。

更进一步的，对于同等长度的子集划分方式，所有元素被选中的次数都是相等的。

例如从 $ n $ 个元素中选 $ k $ 个，那么总共有 $ C^k_n $ 种选法。

我们要计算元素 $ a_1 $ 被选到几次，那么我们可以先选则 $ a_1 $ ，然后从剩下的 $ n - 1 $ 个数字中选择 $ k - 1$ 个，也就是这个次数是 $ C_{n-1}^{k-1} $

在所有的选择方法中，元素 $ a_1 $ 被选择到的次数就是
$$
\sum_{k=1}^{n} C_{n-1}^{k-1}
$$
利用高中知识我们可以得到这个式子的值为 $ 2^{n - 1} $

也就是说，无论如何划分，每一个元素都会被选中 $ 2^{n-1}$ 次，因此答案就是 $ sum \cdot 2^{n-1} $，其中 $ n $ 表示元素的个数，$ sum $ 表示集合中所有元素的和。

当然这题更建议的做法是直接手动列举然后找规律，利用数学直觉推导。

```c++
#include <stdio.h>

int main() {
    int n;
    int idx = 0;
    long long sum = 0;
    while(scanf("%d", &n) != EOF) {
        sum += n;
        idx++;
    }
    printf("%lld", sum * (1 << (idx - 1)));
    return 0;
}
```

### [H - B4057 Rise](https://vjudge.net/contest/758974#problem/H)

根据题意，我们直接维护一个一维数组，在每次进行操作的时候根据题意判断操作并实现操作逻辑即可。

详细过程可以看代码。

```c++
#include <stdio.h>
#include <string.h>

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    int arr[1010] = {0};
    for (int i = 0; i < m; i++) {
        char op[100];
        scanf("%s", op);
        if (strcmp(op, "water") == 0) {
            int l, r;
            scanf("%d %d", &l, &r);
            // 转换为 0 开头下标
            l--, r--;
            // 进行 water 操作
            for (int j = l; j <= r; j++) {
                arr[j]++;
            }
        }
        if (strcmp(op, "rise") == 0) {
            int l, r, k;
            scanf("%d %d %d", &l, &r, &k);
            // 转换为 0 开头下标
            l--, r--;
            int res = 0;
            // 进行 rise 操作，根据题意判断即可
            for (int j = l; j <= r; j++) {
                if (arr[j] >= k) {
                    // 统计答案
                    res++;
                    arr[j] = 0;
                }
            }
            printf("%d\n", res);
        }
    }
    return 0;
}
```

### [I - B4058 三角含数](https://vjudge.net/contest/758974#problem/I)

根据题意从 `l` 到 `r` 判断每个数是否为三角含数。

判断三角含数的过程，我们可以先提取这个数每一位，然后枚举所有排列。

```c++
#include <stdio.h>
#include <string.h>
#include <math.h>

/**
 * 判断三边 x y z 是否能组成三角形
 */
int check(int x, int y, int z) {
    int min = fmin(x, fmin(y, z));
    int max = fmax(x, fmax(y, z));
    int mid = x + y + z - min - max;
    return min + mid > max;;
}

/**
 * 判断 x 是否为三角含数
 */
int calc(int x) {
    
    int bit[6];
    // 提取六位数的每一位
    for (int i = 0; i < 6; i++) {
        bit[i] = x % 10;
        x /= 10;
    }
    
    // 
    for (int i = 1; i < 6; i++) {
        for (int j = i + 1; j < 6; j++) {
            // 先选出第一组的三个数，并判断
            int is1 = check(bit[0], bit[i], bit[j]);
            int arr[3];
            int idx = 0;
            // 找到剩下没选中的三个数
            for (int k = 1; k < 6; k++) {
                if (k != i && k != j) {
                    arr[idx++] = bit[k];
                }
            }
            // 检查剩下的三个数是否也能组成三角形
            int is2 = check(arr[0], arr[1], arr[2]);
           	// 如果两组数都满足，那么就满足三角含数的定义。返回真
            if (is1 && is2) {
                return 1;
            }
        }
    }
    // 否则不满足定义，返回假
    return 0;
}

int main() {
    int l, r;
    scanf("%d %d", &l, &r);
    int ans = 0;
    // 从 l 到 r 进行统计
    for (int i = l; i <= r; i++) {
        ans += calc(i);
    }
    printf("%d", ans);
    return 0;
}
```

### [J - P5019 铺设道路](https://vjudge.net/contest/758974#problem/J)

显然我们每次都填最大的坑，这样的代价肯定是最小的。

在这样的顺序下，我们进一步从特殊到一般的情况进行思考：

首先我们定义一个单调下降之后单调上升的坑为 U 型坑。

我们注意到，每一个 U 型坑需要填的次数，实际上取决于这个坑最深的那个点。

因为只要把这个坑最深的那个点填掉了，剩下的地方都能被顺带填掉。

在进一步，如果这个 U 型坑中存在一个小的突起呢？也就是并不完全单调下降后单调上升。

我们可以先将这个这样的坑先按照 U 型坑的策略填，直到这个小突起的地方满足填平的高度要求，我们就不能再按大 U 型坑的策略填了。

也就是说，这个时候一个大的坑变成了两个小的 U 型坑。

那么这两个小的 U 型坑就可以继续按普通的 U 型坑的策略填。

形式化的，对于一个深度最大为 `a` 的坑，每多一个深度为 `b` 的小 U 型坑（`b <= a`）我们就需要多填 `b` 次。

因此我们只需要找到每个单调下降后单调上升的区间的最低点，也就是关注每个坑的单调下降区间即可。

对于一个单调下降区间单调下降高度，实际上意味着这个区间填埋到最后得到的 U 型坑需要填埋的次数。

因此对每个单调下降区间的单调下降高度累加，就能得到我们的答案。

```c++
#include <stdio.h>
#include <string.h>

int main() {
    int n;
    scanf("%d", &n);
    int arr[100010];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    int diff[100010];
    diff[0] = arr[0];
    for (int i = 1; i < n; i++) {
        // 对于两个相邻点做差，得到这个区间下降的高度
        diff[i] = arr[i] - arr[i - 1];
    }
    long long ans = 0;
    for (int i = 0; i < n; i++) {
        if (diff[i] > 0) {
            // 累加单调下降的高度
            ans += diff[i] > 0 ? diff[i] : 0;
        }
    }
    printf("%lld", ans);
    return 0;
}
```

