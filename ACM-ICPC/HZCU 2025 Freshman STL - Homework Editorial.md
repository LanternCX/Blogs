# HZCU 2025 Freshman STL: Homework Editorial

## [A - P3156 【深基15.例1】询问学号](https://www.luogu.com.cn/problem/P3156)

考察 `vector` 的基本使用，按要求输入之后对 `vector` 指定下标进行访问然后输出即可

```c++
int n, m;
cin >> n >> m;
vector<int> a(n);
for (int i = 0; i < n; i++) {
    cin >> a[i];
}
for (int i = 0; i < m; i++) {
    int x;
    cin >> x;
    cout << a[x - 1] << '\n';
}
```

## [B - P1104 生日](https://www.luogu.com.cn/problem/P1104)

考察 `sort` 的基本使用，根据题意进行输入，并通过自定义排序按照给定的关键字排序即可。

```c++
struct node {
    string name;
    int y, m, d, id;
};
int main() {
    int n;
    cin >> n;
    vector<node> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i].name >> a[i].y >> a[i].m >> a[i].d;
        a[i].id = i;
    }
  	// 通过匿名函数进行排序的自定义
    sort(a.begin(), a.end(), [](node a, node b) -> int {
        bool res = a.y < b.y;
        if (a.y == b.y) {
            res = a.m < b.m;
            if (a.m == b.m) {
                res = a.d < b.d;
                if (a.d == b.d) {
                    res = a.id > b.id;
                }
            }
        }
        return res;
    });
    for (auto p : a) {
        cout << p.name << '\n';
    }
    return 0;
}
```

## [C - P2952 USACO09OPEN Cow Line S ](https://www.luogu.com.cn/problem/P2952)

考察双端队列 `deque` 的使用，根据题意输入之后判断操作类型和入队端点进行模拟即可。

```c++
int n;
cin >> n;
// 奶牛编号
int idx = 1;
deque<int> q;
while (n--) {
    char op, dir;
    cin >> op >> dir;
  	// 添加
    if (op == 'A') {
        if (dir == 'L') {
            q.push_front(idx++);
        } else {
            q.push_back(idx++);
        }
    }
  	// 删除
    if (op == 'D') {
        int k;
        cin >> k;
        if (dir == 'L') {
            for (int i = 0; i < k; i++) {
                q.pop_front();
            } 
        } else {
            for (int i = 0; i < k; i++) {
                q.pop_back();
            }
        }
    }
}
for (auto x : q) {
    cout << x << '\n';
}
```

## [D - P5266 【深基17.例6】学籍管理](https://www.luogu.com.cn/problem/P5266)

考察 `map` 的使用。根据题意输入操作之后进行判断，结合 `map` 提供的各类接口进行模拟即可。

```c++
int n;
cin >> n;
map<string, int> mp;
while (n--) {
    int op;
    cin >> op;
  	/// 插入或修改
    if (op == 1) {
        string s;
        int sc;
        cin >> s >> sc;
        mp[s] = sc;
        cout << "OK\n";
    }
  	// 查询
    if (op == 2) {
        string s;
        cin >> s;
        if (!mp.count(s)) {
            cout << "Not found\n";
        } else {
            cout << mp[s] << '\n';
        }
    }
  	// 删除
    if (op == 3) {
        string s;
        cin >> s;
        if (!mp.count(s)) {
            cout << "Not found\n";
        } else {
            mp.erase(s);
            cout << "Deleted successfully\n";
        }
    }
  	// 查询大小
    if (op == 4) {
        cout << mp.size() << '\n';
    }
}
```

## [P1125 NOIP 2008 提高组 笨小猴](https://www.luogu.com.cn/problem/P1125)

考察 `map` 的使用以及素性判断。使用一个 `map` 统计最值后根据题目要求计算即可。

```c++
bool is_prime(int n) {
    if (n == 0 || n == 1) {
        return false;
    }
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0 && i != n) {
            return false;
        }
    }
    return true;
}

int main() {
    string s;
    cin >> s;
    map<char, int> cnt;
    for (char c : s) {
        cnt[c]++;
    }

    int mx = INT_MIN;
    int mn = INT_MAX;

    for (auto &[ch, n] : cnt) {
        mx = max(mx, n);
        mn = min(mn, n);
    }

    if (is_prime(mx - mn)) {
        cout << "Lucky Word" << '\n';
        cout << mx - mn;
    } else {
        cout << "No Answer" << '\n';
        cout << 0;
    }
    return 0;
}
```

## [B3614 【模板】栈](https://www.luogu.com.cn/problem/B3614)

考察栈的使用，根据题意调用栈的借口模拟即可。需要注意 `x` 的取值范围，要开 `long long`

```c++
using ll = long long;
int n;
cin >> n;
stack<ll> st;
while (n--) {
    string op;
    cin >> op;
    if (op == "push") {
        ll x;
        cin >> x;
        st.push(x);
    }
    if (op == "query") {
        if (st.empty()) {
            cout << "Anguei!\n";
            continue;
        }
        cout << st.top() << '\n';
    }
    if (op == "size") {
        cout << st.size() << '\n';
    }

    if (op == "pop") {
        if (st.empty()) {
            cout << "Empty\n";
            continue;
        }
        st.pop();
    }
}
```

## [P4387 【深基15.习9】验证栈序列](https://www.luogu.com.cn/problem/P4387)

栈的经典应用。考虑到基于栈由 B 序列构造 A 序列时，从 B 序列中取出的每一个元素只有两种操作：放入栈或者直接放入 A 序列，基于这个思想进行分类讨论决策即可。

```c++
int n;
cin >> n;
queue<int> q;
vector<int> tag(n);
for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    q.push(x);
}
for (int i = 0; i < n; i++) {
    cin >> tag[i];
}
stack<int> st;
st.push(q.front());
q.pop();
for (int i = 0; i < n; i++) {
    while ((st.empty() || st.top() != tag[i]) && !q.empty()) {
        st.push(q.front());
        q.pop();
    }
    if (st.empty() || st.top() != tag[i]) {
        cout << "No" << '\n';
        return;
    }
    st.pop();
}
cout << "Yes" << '\n';
return;
```

## [P1102 A-B 数对](https://www.luogu.com.cn/problem/P1102)

问题转化为对于每一个数 `A` 都查找是否存在一个满足的 `B` 使得 `A = B - C`，在这个思想的基础上进行计数。

基于 STL 的时间复杂度，可以让这个查找在符合题目要求的时间复杂度内通过。

可以开一个 `map` 直接统计每个数的出现次数，在数对匹配成功的时候就可以避免重复计数。

```c++
int n, c;
cin >> n >> c;
map<int, int> m;
set<ll> s;
vector<ll> diff;
for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
  	// 等待配对的数 A
    s.insert(x);
  	// 需要逐一与 A 配对的 B - C
    diff.push_back(x - c);
  	// 计数
    m[x]++;
}
ll ans = 0;
for (int x : diff) {
    if (s.count(x)) {
        ans += m[x];
    }
}
cout << ans;
```

### [P5250 【深基17.例5】木材仓库](https://www.luogu.com.cn/problem/P5250)

根据题意使用 `set` 模拟即可。

```c++
int m;
cin >> m;
set<int> st;
while(m--) {
    int op, len;
    cin >> op >> len;
    if (op == 1) {
        if (st.count(len)) {
            cout << "Already Exist\n";
        } else {
            st.insert(len);
        }
    }
    if (op == 2) {
        if (st.empty()) {
            cout << "Empty\n";
            continue;
        }
        auto it = st.lower_bound(len);
        int r = *it;
        if (it != st.begin()) {
            it--;
        }
        int l = *it;
        if (abs(l - len) <= abs(r - len)) {
            cout << l << '\n';
            st.erase(l);
        } else {
            cout << r << '\n';
            st.erase(r);
        }
    }
}
```

### [P1090 NOIP 2004 提高组 合并果子 - 洛谷](https://www.luogu.com.cn/problem/P1090)

贪心地想，每次合并两堆最小堆显然最优，因为如果先合并最大再合并最小，合并的贡献会重复累积。

基于这个思想使用优先队列贪心即可。

```c++
int n;
cin >> n;
vector<int> arr(n);
for(int i = 0; i < n; i++){
    cin >> arr[i];
}
priority_queue<int, vector<int>, greater<int>> pq;
for(int x : arr){
    pq.push(x);
}
int ans = 0;
while (pq.size() > 1) {
    int temp = 0;
    temp += pq.top();
    pq.pop();
    temp += pq.top();
    pq.pop();
    ans += temp;
    pq.push(temp);
}

cout << ans;
```

