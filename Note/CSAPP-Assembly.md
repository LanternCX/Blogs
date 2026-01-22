# CSAPP

## Chapter 3: 程序的转换及机器级表示

### 栈

从高地址`0FFFFH`向低地址 `00000H` 生长

`push` 入栈 `pop` 出栈

### 汇编

| 后缀  | 全称     | 含义 | 大小 (位/字节) | C语言对应类型      | 寄存器举例     |
| :---- | :------- | :--- | :------------- | :----------------- | :------------- |
| **b** | **B**yte | 字节 | 8位 (1字节)    | `char`             | `%al`, `%bl`   |
| **w** | **W**ord | 字   | 16位 (2字节)   | `short`            | `%ax`, `%bx`   |
| **l** | **L**ong | 双字 | 32位 (4字节)   | `int`              | `%eax`, `%ebx` |
| **q** | **Q**uad | 四字 | 64位 (8字节)   | `long long` / 指针 | `%rax`, `%rbx` |

#### 地址传送

`mov` `push` `pop`

`leal`：`leal A(B, C, D), E` = `E = A + B + C * D`

#### 算术运算

1. 数学运算

   | 汇编指令     | C 语言翻译 | 备注   |
   | ------------ | ---------- | ------ |
   | `movl S, D`  | `D = S;`   | 赋值   |
   | `addl S, D`  | `D += S;`  | 加法   |
   | `subl S, D`  | `D -= S;`  | 减法   |
   | `imull S, D` | `D *= S;`  | 乘法   |
   | `incl D`     | `D++;`     | 自增   |
   | `decl D`     | `D--;`     | 自减   |
   | `negl D`     | `D = -D;`  | 取负数 |

2. 位运算

   | 汇编指令    | C 语言翻译 | 备注     |
   | ----------- | ---------- | -------- |
   | `andl S, D` | `D &= S;`  | 按位与   |
   | `orl S, D`  | `D |= S;`  | 按位或   |
   | `xorl S, D` | `D ^= S;`  | 按位异或 |
   | `notl D`    | `D = ~D;`  | 按位取反 |

3. 移位运算

   | 汇编指令    | C 语言翻译 | 备注                              |
   | ----------- | ---------- | --------------------------------- |
   | `sall k, D` | `D <<= k;` | 左移 (x2)                         |
   | `sarl k, D` | `D >>= k;` | 算术右移 (保留符号，对应 int)     |
   | `shrl k, D` | `D >>= k;` | 逻辑右移 (补0，对应 unsigned int) |

   | **汇编指令** | **动作描述** | **描述**                    |
   | ------------ | ------------ | --------------------------- |
   | `roll k, D`  | **循环左移** | 高位移出的 1 会补回到最低位 |
   | `rorl k, D`  | **循环右移** | 低位移出的 1 会补回到最高位 |

4. `leal`

   `leal 8(%eax, %edx, 4), %ecx`：`c = a + d*4 + 8;`

5. `test` 和 `cmp`

   只影响算术标志位 `ZF, SF, CF, OF`

   | **指令**  | **背后的数学**       | **类似 C 语言**              | **主要用途**                               |
   | --------- | -------------------- | ---------------------------- | ------------------------------------------ |
   | cmp a, b  | **减法** (`b - a`)   | `if (b == a)`   `if (b > a)` | **比较大小** (等于、大于、小于)            |
   | test a, b | **与运算** (`b & a`) | `if (b & a)`                 | **检查某些位** (是否为0、是否为负、奇偶性) |

​	`test %al %al`判断 `%al` 符号

​	1. `ZF = 1`：`%al = 0`
​	2. `SF = 0 && ZF = 0`：`%al > 0`
​	3. `SF = 1`：`%al < 0`


#### 控制转移

 1. 基础跳转 

    | 指令 | 英文全称        | 含义            | 触发条件 | C 语言场景                 |
    | ---- | --------------- | --------------- | -------- | -------------------------- |
    | je   | Jump Equal      | 相等 / 为零时跳 | ZF = 1   | if (x == y) 或 if (x == 0) |
    | jne  | Jump Not Equal  | 不等 / 非零时跳 | ZF = 0   | if (x != y) 或 if (x != 0) |
    | js   | Jump Signed     | 结果为负时跳    | SF = 1   | if (x < 0)                 |
    | jns  | Jump Not Signed | 结果非负时跳    | SF = 0   | if (x >= 0)                |

2. 比较跳转

   | **比较关系**      | **有符号数 (int)**      | **无符号数 (unsigned / 指针)** |
   | ----------------- | ----------------------- | ------------------------------ |
   | **大于 (>)**      | **jg** (Greater)        | **ja** (Above)                 |
   | **大于等于 (>=)** | **jge** (Greater Equal) | **jae** (Above Equal)          |
   | **小于 (<)**      | **jl** (Less)           | **jb** (Below)                 |
   | **小于等于 (<=)** | **jle** (Less Equal)    | **jbe** (Below Equal)          |

​	**有符号 (Signed)：** 用 **G**reat (大) 和 **L**ess (小)

​	**无符号 (Unsigned)：** 用 **A**bove (上) 和 **B**elow (下)

### 过程调用的机器级表示

#### 保护现场

| 寄存器类型              | 具体寄存器         | 负责保存          |
| ----------------------- | ------------------ | ----------------- |
| 易失性 (Volatile)       | EAX ECX EDX      | 调用者 (Caller)   |
| 非易失性 (Non-Volatile) | EBX ESI EDI | 被调用者 (Callee) |
| 特殊 | ESP EBP | 被调用者 (Callee) |

#### 参数传递和返回

- 参数 `int a, int b, int c` 按照 `c b a` 也就是逆序压入栈

- 返回值保存在 `eax`

#### 栈结构

当 CPU 执行到函数内部的第一行指令（在保存完 `ebp` 后），栈的布局是这样的：

| 内存地址方向 | 栈的内容   | 说明            | 对应指针位置           |
| ------------ | ---------- | --------------- | ---------------------- |
| 高地址       | ...        | ...             |                        |
| ↑            | 参数 2 (b) | 值：20          | [EBP + 12]             |
|              | 参数 1 (a) | 值：10          | [EBP + 8]              |
|              | 返回地址   | call 指令压入的 | [EBP + 4]              |
| 低地址       | 旧 EBP     | push ebp 压入的 | <--- 当前 EBP 指向这里 |
| ↓            | 局部变量   | ...             | [EBP - 4]              |

#### 示例代码

调用者 (Caller) 的操作

A. 调用者负责把数据搬到栈上。

```assembly
# --- 准备参数 (从右往左) ---
pushl   $20             # 压入第二个参数 b
pushl   $10             # 压入第一个参数 a

# --- 调用函数 ---
call    Add             # 1. 压入返回地址
                        # 2. 跳转到 Add 标号处

# --- 清理参数 (cdecl 约定) ---
addl    $8, %esp        # 两个整数共 8 字节。
                        # 简单粗暴地把栈顶指针往回拨 8 个字节，
                        # 相当于丢弃了刚才压入的 10 和 20。
```

B. 被调用者 (Callee) 的操作

被调用者通过**栈基址指针 (EBP)**加上**正偏移量**来捞取参数。

```assembly
Add:
    # --- 建立栈帧 (Prologue) ---
    pushl   %ebp            # 保存调用者的栈底
    movl    %esp, %ebp      # 把当前栈顶作为新的栈底 (EBP 现在指向 "旧 EBP")
    
    subl    $8, %esp        # 开辟 8 字节的栈空间用于局部变量
                            # 栈是向下增长的，减去 8 意味着预留了 8 字节位置
    
    # --- 获取参数 ---
    # 此时栈顶 %esp 变成了 (%ebp - 8)
    # 但参数的位置是相对于 %ebp 的，所以偏移量完全不用变！
    # (%ebp)     = 旧 EBP
    # 4(%ebp)    = 返回地址
    # 8(%ebp)    = 参数 1
    # 12(%ebp)   = 参数 2
    
    movl    8(%ebp), %eax   # 把 参数1 (10) 放入 EAX
    addl    12(%ebp), %eax  # 把 参数2 (20) 加到 EAX 上
    
    # 假设我们要用刚才开辟的空间存一下结果（仅仅为了演示局部变量用法）：
    movl    %eax, -4(%ebp)  # 把结果存入局部变量 (位于 ebp 下方 4 字节处)
    
    # --- 恢复栈帧 (Epilogue) ---
    movl    %ebp, %esp      # 把 ESP 拉回 EBP 的位置
                            # 这一步相当于"回收"了刚才 subl $8 开辟的空间
                            # 如果不写这行，下面的 popl 会从错误的位置弹数据
                            
    popl    %ebp            # 恢复调用者的 EBP
    ret                     # 返回 (EAX 中是结果)
```

对应的 C 语言：

```c
// B. 被调用者 (Callee)
int Add(int a, int b) {
    // 对应汇编中的 subl $8, %esp (开辟空间)
    // 这里的局部变量 sum 迫使编译器在栈帧中预留内存
    int sum; 
    
    // 对应 movl ... %eax (计算) 
    // 以及 movl %eax, -4(%ebp) (将寄存器里的结果写回栈内存)
    sum = a + b; 
    
    // 对应 ret (eax 中存放返回值)
    return sum;
}

// A. 调用者 (Caller)
void Caller() {
    // 对应汇编中的:
    // pushl $20 (参数 b)
    // pushl $10 (参数 a)
    // call Add
    // addl $8, %esp (清理参数)
    Add(10, 20); 
}
```

实际上参数的传递也可以直接通过在函数初始化的时候就直接开辟栈空间，后续传递直接通过 mov 指令写入栈帧。

这种方式比较高效一点，虽然在汇编中不太直观，但是编译器一直是这么优化的

### 流程控制的机器级表示

#### if-else

```c
if (a == 10) {
    a = 1;
} else if (a > 20) {
    a = 2;
} else {
    a = 0;
}
```

```assembly
		# 假设变量 a 在 %eax 中
    # --- 1. 检查第一个条件 (if a == 10) ---
    cmpl    $10, %eax 
    jne     .L_check_next 

    movl    $1, %eax        # a = 1
    jmp     .L_end

.L_check_next:
    # --- else if (a > 20) ---
    cmpl    $20, %eax
    jle     .L_else         
    
    movl    $2, %eax        # a = 2
    jmp     .L_end

.L_else:
    # --- 3. Else---
    movl    $0, %eax        # a = 0

.L_end:
    # --- 结束 ---
```

#### do-while

```c
i = 0
do {
    i++;
} while (i < 100);
```

```assembly
    movl    $0, %ecx
.L_loop_start:              # 循环体开始标号
    # [循环体]
    addl    $1, %ecx        # i++
    # [条件检查]
    cmpl    $100, %ecx      # 比较 i 和 100
    jl      .L_loop_start   # 如果 i < 100 (Jump if Less)，跳回开头继续
                            # 否则，继续往下执行（退出循环）
```

#### while

```c
while (i < 100) {
    i++;
}
```

```assembly
# 假设 i 在 %ecx 中
    jmp     .L_test         # 1. 刚进来，直接强行跳到测试环节！

.L_body:
    # [循环体]
    addl    $1, %ecx        # i++

.L_test:
    # [条件检查]
    cmpl    $100, %ecx      # 比较 i 和 100
    jl      .L_body         # 2. 如果满足条件，跳回 .L_body 执行
                            #    如果不满足，直接往下走（退出）
```

#### switch

使用跳转表进行跳转

```C
switch (a) {
    case 0: func0(); break;
    case 1: func1(); break;
    case 2: func2(); break;
    default: func_def(); break;
}
```

```assembly
# jmp *table(,%eax,4) 意思是：
    # 去内存地址 [table + eax * 4] 的地方，取出里面的地址，然后跳过去
    jmp     *.L_jump_table(,%eax,4)

    # --- 数据段：跳转表 (存的是地址) ---
    .section .rodata
.L_jump_table:
    .long .L_case_0         # 对应 case 0 的代码地址
    .long .L_case_1         # 对应 case 1 的代码地址
    .long .L_case_2         # 对应 case 2 的代码地址

    # --- 代码段：各个分支 ---
    .text
.L_case_0:
    call func0
    jmp .L_end
···
.L_default:
    call func_def
.L_end:
```

### 复杂数据类型的分配和访问

#### 数组

```c
// 【全局变量】：存储在 数据段 中，地址永远不变
int G[100]; 

void copy_array(int i) {
    // 【局部变量】：存储在 栈 中
    // 100 个 int，占用 400 字节的空间
    int L[100]; 

    L[i] = G[i];
}
```

```assembly
copy_array:
    # --- 1. 函数序言 (Prologue) ---
    pushl   %ebp                    # 保存旧的栈底指针 (EBP)
    movl    %esp, %ebp              # 将栈顶 (ESP) 设为新的栈底
    subl    $400, %esp              # 【栈分配】：ESP 减去 400，开辟局部数组 L 的空间
                                    # 此时 L[0] 的地址即为 -400(%ebp)

    # --- 2. 获取下标 i ---
    movl    8(%ebp), %ecx # %ecx = i

    # --- 3. 读取全局数组 G[i] (Load) ---
    # 格式：G( , index, scale)  <-- 典型的 AT&T 绝对寻址方式
    # 计算：Addr = G + (%ecx * 4)
    movl    G( , %ecx, 4), %eax # 将 G[i] 的值读入 %eax

    # --- 4. 写入局部数组 L[i] (Store) ---
    # 格式：disp(base, index, scale) <-- 典型的 AT&T 相对寻址方式
    # 计算：Addr = (%ebp - 400) + (%ecx * 4)
    # 注意：-400(%ebp) 是数组 L 的首地址 (Base)
    movl    %eax, -400(%ebp, %ecx, 4) # L[i] = %eax

    # --- 5. 函数尾声 (Epilogue) ---
    leave                           
    ret
```

#### 结构体

```c
struct Point {
    int x;      // 偏移 +0
    int y;      // 偏移 +4 (因为 x 占 4 字节)
};

// 【全局结构体】：地址固定，标号为 G_pt
struct Point G_pt; 

void copy_struct_member() {
    // 【局部结构体】：分配在栈上
    // sizeof(Point) = 8 字节
    struct Point L_pt; 

    // 核心操作：把全局结构体的 y 成员，赋值给局部结构体的 y 成员
    L_pt.y = G_pt.y;
}
```

```assembly
copy_struct_member:
    # --- 1. 函数序言 ---
    pushl   %ebp
    movl    %esp, %ebp
    subl    $8, %esp                # 【栈分配】：开辟 8 字节空间
                                    # L_pt 占据 [%ebp-8, %ebp]
                                    # L_pt.x 的地址是 -8(%ebp)
                                    # L_pt.y 的地址是 -4(%ebp)

    # --- 2. 读取全局结构体成员 G_pt.y ---
    # 寻址公式：G_pt + 偏移量
    # 这里的 4 是编译器算出来的 (因为 y 是第2个成员)
    movl    G_pt + 4, %eax          # 【绝对寻址 + 偏移】
                                    # 直接去 (G_pt首地址 + 4) 的地方取值

    # --- 3. 写入局部结构体成员 L_pt.y ---
    # 寻址公式：(%ebp - 8) + 4  ==> %ebp - 4
    # 编译器很聪明，直接把两个偏移量合并了：
    # 结构体基址偏移(-8) + 成员偏移(+4) = 最终偏移(-4)
    movl    %eax, -4(%ebp) # 将数据写入 L_pt.y 的位置
                                    
    # --- 4. 函数尾声 ---
    leave
    ret
```

#### 共用体

顾名思义，所有数据共用首地址，在同一时刻只有一个成员真正有效

会和大小端存储一起考

```c
union Data {
    int i;      // 4 字节
    char c;     // 1 字节
};

void test_union() {
    // 【局部共用体】：分配在栈上
    // 大小由最大的成员决定 -> 4 字节
    union Data L_u; 

    // 操作1：写入 int 成员
    L_u.i = 0x12345678;

    // 操作2：读取 char 成员 (演示读取同一块内存的低8位)
    char temp = L_u.c;
}
```

```assembly
test_union:
    # --- 1. 函数序言 ---
    pushl   %ebp
    movl    %esp, %ebp
    subl    $4, %esp                # L_u 占据 [%ebp-4, %ebp] (最大的数据是 int)
                                    # L_u.i 的起始地址是 -4(%ebp)
                                    # L_u.c 的起始地址 也是 -4(%ebp) 

    # --- 2. 写入 int 成员 (L_u.i) ---
    # 使用 movl (Move Long, 4字节)
    movl    $0x12345678, -4(%ebp)   # 将 4 字节整数填满整个共用体空间

    # --- 3. 读取 char 成员 (L_u.c) ---
    # 此时地址依然是 -4(%ebp)，但指令变了
    movb  -4(%ebp), %eax          # 仅读取最低的 1 个字节，小端序机器上，读到的是 0x78

    # --- 4. 函数尾声 ---
    leave
    ret
```

### 对齐

数据的地址必须是数据大小的整数倍。

结构体的总大小，必须是它里面**最大成员**大小的整数倍，也就是说结构体要内部对齐+整体对齐。

贪心地想，结构体中更大的数据放更前面，可以接受对齐浪费的空间。

### 缓冲区溢出

```c
void hacker(void) {
    printf("being hacked\n"); // 如果打印出这句话，说明攻击成功
}

void outputs(char *str) {
    char buffer[16];        // 栈上分配 16 字节空间
    
    // 【致命漏洞】：strcpy 不检查 str 是否超过 16 字节
    // 如果 str > 16 字节，多出的数据将覆盖高地址的 EBP 和 返回地址
  	// 可以通过这个操作，将返回地址修改为 hacker 的地址
    strcpy(buffer, str);    
    
    printf("%s \n", buffer);
  	
  	// outputs 返回之后 不是直接 return 到 main 而是到 hacker 的地址
}

int main(int argc, char *argv[]) {
    // 将命令行输入的第一个参数传给 outputs
    outputs(argv[1]); 
    return 0;
}
```