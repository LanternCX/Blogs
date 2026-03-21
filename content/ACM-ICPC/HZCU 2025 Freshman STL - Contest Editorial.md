# HZCU 2025 Freshman STL: Contest Editorial

## A 明明的随机数

**语法题、签到题**

根据题意使用 `set` 进行去重并排序后输出即可

注意行尾不能有空格，小心格式错误，另外几题也是

```c++
int n;
cin >> n;
set<int> s;
for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    s.insert(x);
}
cout << s.size() << '\n';
int idx = 0;
for (int x : s) {
    cout << x << " \n"[idx++ == s.size() - 1];
}
```

## B 考试座位号

**语法题**

使用 `map` 维护一个 `int` 键和 `node` 结构体值的查询即可

注意 `id` 要使用字符串输入

```c++
struct node {
    string id;
    int n;  
};
int main() {
    int n;
    cin >> n;
    map<int, node> mp;
    for (int i = 0; i < n; i++) {
        string id;
        int idx, num;
        cin >> id >> idx >> num;
        mp[idx] = {id, num};
    }
    int m;
    cin >> m;
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        auto [id, num] = mp[x];
        cout << id << ' ' << num << '\n';
    }
  	return 0;
}
```

## C 帅到没朋友

**语法题、思维题**

如果一个人没有朋友，要么这个人根本没有在名单内出现，要么这个人的朋友圈只有他自己

相反的，朋友圈人数大于 2 的人都是有朋友的，利用这个形式维护一个 `set`，在每次查询的时候在 `set` 内查找即可

注意 `id` 要用字符串输入，这个样例没有给出，可能会导致忽略了前导 `0` 的存在

```c++
int n;
cin >> n;
set<string> st;
while (n--) {
    int k;
    cin >> k;
    for (int i = 0; i < k; i++) {
        string x;
        cin >> x;
        if (k > 1) {
            st.insert(x);
        }
    }
}

cin >> n;
set<string> ans;
while (n--) {
    string x;
    cin >> x;
    if (!st.count(x) && !ans.count(x)) {
        if (ans.size()) {
            cout << ' ';
        }
        cout << x;
        ans.insert(x);
    }
}
if (!ans.size()) {
    cout << "No one is handsome\n";
}
```

## D 到底有多二

**模拟题、语法题**

注意到 `N` 有 50 位，要用字符串输入

使用 `map` 或者长度为 11 位的 `vector` 统计字符出现的频次，或者直接统计 2 出现的次数也可以

如果第一位是 `-` 那么这个数是负数

如果最后一位是偶数，那么这个数是偶数

根据这两个判断条件计算即可

```c++
string s;
cin >> s;
map<int, int> cnt;
for (auto ch : s) {
    cnt[ch]++;
}
double ans = cnt['2'] * 1.0 / (s.length() - cnt['-']);
if (cnt['-']) {
    ans *= 1.5;
}
if (!((s[s.length() - 1] - '0') % 2)) {
    ans *= 2;
}
cout << ans * 100 << '%';
```

## E 谁先倒

**较难的模拟题、语法题**

根据题意模拟即可

需要注意，要对**两人同赢或两人同输则继续下一轮，直到唯一的赢家出现**这个情况进行特判

```c++
int a, b;
cin >> a >> b;
int n;
cin >> n;
pair<char, int> ans;
map<int, int> cnt;
int tag = 0;
for (int i = 0; i < n; i++) {
    vector<int> arr(4);
    for (auto &x : arr) {
        cin >> x;
    }
    int sum = arr[0] + arr[2];
  	// 特判两人同输
    if (sum == arr[1] && sum == arr[3]) {
        continue;
    }
  	
    if (arr[0] + arr[2] == arr[1]) {
      	// A 赢
        a--;
        cnt[0]++;
    } else if (arr[0] + arr[2] == arr[3]) {
      	// B 赢
        b--;
        cnt[1]++;
    }
  
    if (a < 0 && !tag) {
        tag = 1;
        ans = {'A', cnt[1]};
    }
    if (b < 0 && !tag) {
        tag = 1;
        ans = {'B', cnt[0]};
    }
}
cout << ans.first << '\n' << ans.second;
```

## F Legs

**签到题**

给定一个偶数个物品，判断最少能将这些物品 4 个一份或者 2 个一份分为几份

贪心地想，显然先分 4 个一份，不够分了再分 2 个一份

英文题还是要耐心读一下

```c++
int n;
cin >> n;
cout << n / 4 + ((n % 4) > 0) << '\n';
```

## G Beautiful Year

**签到题**

找到给定的年份之后最近的年份，满足这个年份的四位数字均不同

实现方法有很多，因为我们这周讲 STL，这里使用 `set` 进行维护，将年份转换为字符串之后全部 `insert` 到 `set` 里面直接判断 `set` 的大小即可

```c++
int n;
cin >> n;
for (int i = n + 1; i <= 9000; i++) {
    set<char> s;
    string str = to_string(i);
    for (auto ch : str) {
        s.insert(ch);
    }
    if (s.size() == 4) {
        cout << i << '\n';
        return;
    }
}
```

## H Primary Task

**语法题、模拟题**

判断给定的字符串是否满足前缀为 `"10"` 且存在后缀为没有前导 0 且不为 1 的整数

```c++
string s;
cin >> s;
// 长度不满足就不用判断前缀，否则会 RE
if (s.length() <= 2) {
    cout << "NO\n";
    return;
}
string suf = s.substr(2, s.length());
if (s.substr(0, 2) == "10" && suf[0] != '0' && suf != "1") {
    cout << "YES\n";
} else {
    cout << "NO\n";
}
```

## I 找筷子

**防 AK 题、数学题**

利用异或的几个性质：

- 异或满足交换律

- 一个数异或自己等于 0

- 一个数异或 0 等于自己

因此直接将数列中所有数全部异或起来即可

当然直接用 STL 实现也可以，只不过常数可能有点神秘。

虽然没有讲过，但是题目没有限制解法，学一下又何妨呢？

```c++
int n;
cin >> n;
ll ans = 0;
for (int i = 0; i < n; i++) {
    ll x;
    cin >> x;
    ans ^= x;
}
cout << ans;
```

## J 篮子里的甜甜圈

**较为少见的语法题**

注意到操作满足 `multiset`  的性质，因此使用 `multiset` 进行模拟即可

```c++
int n, q;
cin >> n >> q;
multiset<int, greater<int>> st;
for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    st.insert(x);
}
int ans = 0;
while (q--) {
    int op;
    cin >> op;
    if (op == 1) {
        int w;
        cin >> w;
        st.insert(w);
    }
    if (op == 2) {
        int w;
        cin >> w;
        st.erase(st.find(w));
    }
    if (op == 3) {
        ans += *st.begin();
        cout << *st.begin() << '\n';
        st.erase(st.begin());
    }
}
cout << ans << '\n';
```

## K 互评成绩

**语法题**

根据题意输入每组数据之后找到最值去除之后计算即可

```c++
int n, m, k;
cin >> n >> k >> m;
vector<double> sc;
while (n--) {
    vector<int> arr(k);
    ll sum = 0;
    for (auto &x : arr) {
        cin >> x;
        sum += x;
    }
    int mx = *max_element(arr.begin(), arr.end());
    int mn = *min_element(arr.begin(), arr.end());
    sc.push_back((sum - mx - mn) * 1.0 / (k - 2));
}
sort(sc.begin(), sc.end(), greater<double>());
for (int i = m - 1; i >= 0; i--) {
    if (i != m - 1) {
        cout << ' ';
    }
    cout << sc[i];
}
```

## L 彩虹瓶

**防 AK 题，但是作业原题：**[P4387 【深基15.习9】验证栈序列](https://www.luogu.com.cn/problem/P4387)

甚至比作业简单

考虑到基于栈由 B 序列构造 A 序列时，从 B 序列中取出的每一个元素只有两种操作：放入栈或者直接放入 A 序列，基于这个思想进行分类讨论决策即可

我们构造的目标序列 A 实际上就是一个递增的排列

虽然题目有点长但是还是要耐心读一下

```c++
int n, m, k;
cin >> n >> m >> k;
while (k--) {
    vector<int> arr(n);
    for (auto &x : arr) {
        cin >> x;
    }
    int idx = 1;
    stack<int> st;
    int tag = 0;
    for (auto x : arr) {
        if (x == idx) {
            idx++;
            while (!st.empty() && st.top() == idx) {
                st.pop();
                idx++;
            }
        } else {
            st.push(x);
            if ((int)st.size() > m) {
                tag = 1;
                break;
            }
        }
    }
    if (!tag && idx == n + 1) {
        cout << "YES\n";
    } else {
        cout << "NO\n";
    }
}
```
