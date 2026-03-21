# HZCU 2025 Freshman - ABC 430 A-D Editorial

## [A - Candy Cookie Law](https://atcoder.jp/contests/abc430/tasks/abc430_a)

输出 YES 的条件是：C 大于等 A 且 D 小于 B

根据题意判断即可，注意边界

```c++
void sol(){
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    if (c >= a && d < b) {
        cout << "Yes\n";
        return;
    }
    cout << "No\n";
}
```

提交：[Submission #70659154 - AtCoder Beginner Contest 430](https://atcoder.jp/contests/abc430/submissions/70659154)

## [B - Count Subgrid](https://atcoder.jp/contests/abc430/tasks/abc430_b)

直接根据题意模拟并去重即可

首先注意到去重可以使用 `set`

这里我将一个二维矩阵的每一位映射到为一个一维 `01` 串，进而压缩为一个二进制数，因此可以借助 `set` 进行维护

当然解法很多，直接模拟也是可以的

```c++
void sol(){
    int m, n;
    cin >> n >> m;
    vector<vector<char>> mp(n, vector<char>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> mp[i][j];
        }
    }
    set<ull> st;
    for (int i = 0; i < n - m + 1; i++) {
        for (int j = 0; j < n - m + 1; j++) {
            ull num = 0;
            int idx = 0;
            for (int x = i; x < i + m; x++) {
                for (int y = j; y < j + m; y++) {
                    num += (1 << idx++) * (mp[x][y] == '#');
                }
            }
            st.insert(num);
        }
    }
    cout << st.size() << '\n';
}
```

提交：[Submission #70660425 - AtCoder Beginner Contest 430](https://atcoder.jp/contests/abc430/submissions/70660425)

## [C - Truck Driver](https://atcoder.jp/contests/abc430/tasks/abc430_c)

首先想到使用前缀和统计到第 `i` 位为止的字母 `a` 和 `b` 的数量

这样我们就可以使用 $ O(1) $ 的时间复杂度求出区间 `[l, r]` 内 `a` 或者 `b` 字母的数量

对于这类区间计数问题，我们的常用思路是先固定一个左端点 `l`，然后查找符合条件的右端点 `r`

在这个问题中，我们可以先枚举每一个左端点 `l` ，然后由于前缀和数组单调，因此可以在前缀和数组二分得到一个合法的右端点 `r`

首先对于条件 A：区间内 `a` 的数量大于等于 `A`，我们可以二分得到一个满足条件的右端点 `ra`

同理对于条件 B：区间内 `b` 的数量小于 `B`，也可以二分得到一个满足条件的右端点 `rb`

同时满足条件 A 和条件 B 的区间就是当前 `l` 匹配的所有满足条件的 `r` 的取值范围，这个范围一定是连续的

因此我们可以直接在最终答案上直接加上这个区间长度

这个解法的时间复杂度为 $ O(n\log{n}) $

```c++
int n, a, b;
cin >> n >> a >> b;
string s;
cin >> s;

// a 和 b 的前缀和数组
vector<vector<int>> pre(2, vector<int>(n + 1));
for (int i = 1; i <= n; i++) {
    pre[0][i] = pre[0][i - 1];
    pre[1][i] = pre[1][i - 1];
    pre[s[i - 1] - 'a'][i]++;
}

ll ans = 0;
for (int l = 1; l <= n; l++) {
    int ar = lower_bound(pre[0].begin(), pre[0].end(), pre[0][l - 1] + a) - pre[0].begin();
    int br = lower_bound(pre[1].begin(), pre[1].end(), pre[1][l - 1] + b) - pre[1].begin();
  	// 累加区间贡献到答案
    if (ar <= br) {
     	 ans += (br - ar);
    }
}
cout << ans << "\n";
```

提交：[Submission #70663082 - AtCoder Beginner Contest 430](https://atcoder.jp/contests/abc430/submissions/70663082)

在这个基础上，我们注意到由于前缀和数组单调，可以不需要每次都搜索符合条件的 `ra` 和 `rb`，可以直接在上一次搜索的基础上查找

因此我们可以想到一个基于双指针与滑动窗口的解法，时间复杂度 $ O(n) $

```c++
int n, a, b;
cin >> n >> a >> b;
string s;
cin >> s;

vector<vector<int>> pre(2, vector<int>(n + 1));
for (int i = 1; i <= n; i++) {
    pre[0][i] = pre[0][i - 1];
    pre[1][i] = pre[1][i - 1];
    pre[s[i - 1] - 'a'][i]++;
}

ll ans = 0;
int ar = 0, br = 0;
for (int l = 1; l <= n; l++) {
  	// 使用滑动窗口查找右端点
		while (pre[0][ar] < pre[0][l - 1] + a && ar <= n) {
        ar++;
    }
    while (pre[1][br] < pre[1][l - 1] + b && br <= n) {
        br++;
    }
    ans += max(br - ar, 0);
}
cout << ans << "\n";
```

提交：[Submission #70663502 - AtCoder Beginner Contest 430](https://atcoder.jp/contests/abc430/submissions/70663502)

## [D - Neighbor Distance](https://atcoder.jp/contests/abc430/tasks/abc430_d)

首先考虑：当插入一个人的时候，我们如何寻找这个人最近的邻居

很容易想到使用一个 `set` 维护，在每次插入的时候进行查询的方法

但是问题在于，每次新加入的人会影响原来就在数轴上的人的最近邻居

注意到，每次新的加入只会影响这个人左右两次的人的最近邻居

因此又能想到一个优化：记录每一个在数轴上的人的最近邻居的距离，在每次插入的时候，更新新加入的人的左右邻居的最近左右邻居，然后重新计算答案

这样的解法时间复杂度为 $ O(n \log{n}) $ 

```c++
int n;
cin >> n;
set<int> st;
vector<int> arr(n);
map<int, int> res;
for (auto &x : arr) {
    cin >> x;
}

st.insert(0);
res[0] = INT_MAX;

ll ans = 0;
for (auto x : arr) {
    auto it = st.lower_bound(x);
    int l = -1, r = -1;
    if (it != st.begin()) {
        auto itl = prev(it);
        l = *itl;
    }
    if (it != st.end()) {
        r = *it;
    }

    // 在插入 x 之前，减去受影响的左右两人的旧贡献
    if (l != -1 && res[l] != INT_MAX) {
        ans -= res[l];
    }
    if (r != -1 && res[r] != INT_MAX) {
        ans -= res[r];
    }

    st.insert(x);

    // 更新三个人的最近距离
    if (l != -1) {
        res[l] = min(res[l], abs(x - l));
    }
    if (r != -1) {
        res[r] = min(res[r], abs(x - r));
    }
    res[x] = INT_MAX;
    if (l != -1) {
        res[x] = min(res[x], abs(x - l));
    }
    if (r != -1) {
        res[x] = min(res[x], abs(x - r));
    }

    // 加回新的贡献
    if (l != -1) {
        ans += res[l];
    }
    if (r != -1) {
        ans += res[r];
    }
    ans += res[x];

    cout << ans << '\n';
}
```

提交：[Submission #70672001 - AtCoder Beginner Contest 430](https://atcoder.jp/contests/abc430/submissions/70672001)
