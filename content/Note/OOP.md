#  OOP

## JDK

### 核心工具

- **`javac` (Compiler)**：**编译器**。将源码编译成字节码。（类比 `gcc`，但只生成中间代码）。
- **`java` (Launcher)**：**启动器**。启动 JVM 进程来加载并运行字节码。（本质是一个虚拟机进程）。
- **`javap` (Disassembler)**：**反汇编器**。查看 `.class` 内部的字节码指令和常量池。（类比 `objdump`）。
- **`jar` (Archiver)**：**打包工具**。把一堆 `.class` 压缩成一个包。（类比 `ar` 或 `tar`）。
- **`jdb` / `jps`**：**调试与监控**。命令行调试器和进程状态查看工具。（类比 `gdb` 和 `ps`）。

### 文件类型

- **`.java`**：**源码文件**。ASCII/UTF-8 文本。（类比 C++ 的 `.cpp`）。
- **`.class`**：**字节码文件**。二进制，包含指令和符号表。（类比 C++ 的 `.o` 目标文件）。
- **`.jar`**：**Java 归档包**。本质是 ZIP 压缩包，包含类文件和清单。（类比 C++ 的 `.lib` 或 `.a` 静态库）。

## 基本语法

### 板子

```java
package cn.edu.hzcu.cs.oop.caoxin;

import java.util.*;

public class test1 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        int a = input.nextInt();
        int b = input.nextInt();

        System.out.println(a + b);
    }
}
```

### 输入

```java
Scanner input = new Scanner(System.in);

int num = input.nextInt();
String line = input.nextLine();
double f = input.nextDouble();
```

### 输出

整行打印、格式化打印、直接 `to_string` 打印

```java
System.out.println("Hello, world!");
System.out.printf("%d %d\n", 10, 20);
System.out.print(10);
```

### 数据

```java
short s = 0;
int i = 0;
long l = 1L;

float f = 1.0f;
double d = 3.14;

// char 是 2 字节
char ch = 'c';
// byte 是 1 字节
byte bt = 'a';

boolean is = false;
```

#### 关键字

```java
public class VarDemo {
    // 1. static：属于类，所有对象共享一份
    static int sharedMoney = 1000; 

    // 2. final：属于常量，初始化后禁止修改
    final int ID_CODE = 9527;

    public void keyFeatures() {
        // 3. static 调用
        VarDemo.sharedMoney = 500; 

        // 4. final 尝试二次赋值会报错
        // this.ID_CODE = 8888; 
    }
}
```

#### 运算规则

除了以下几条，其余和 C/C++ 一致

1. 窄化转换必须显式声明

   ```java
   int a = 76.02 * 100; // Java 编译报错！Incompatible types.
   // 必须写成：
   int a = (int)(76.02 * 100);
   ```

2. `boolean` 是完全独立的类型，绝不允许 `(int)true` 这种操作

3. 除法是向 0 取整

4. `short` 和 `byte` 在运算的时候会强制转换为 `int` 因此需要运算后重新转换为 `byte`

    ```java
    byte a = 10;
    byte b = 20;
    byte c = a + b; // Java 编译报错！
    ```

5. `float` 赋值常量需要带 `f` 后缀，因为发生了窄化转换。而整型之间不需要，保证数据符合范围即可。

    ```java
    float f = 1.0f;
    long l = 1;
    short s = 1;
    ```

值得注意的是：和 C/C++ 一样存在着变量作用域，规则和 C/C++ 相同。

#### 命名规则

1. 组成元素：只能包含 字母 (a-z, A-Z)、数字 (0-9)、下划线 (`_`) 和 美元符号 (`$`)。
2. 首字符限制：不能以数字开头。
3. 关键字避让：不能是 Java 的关键字（Reserved Keywords，如 `class`, `int`, `public` 等）。

#### 赋值

规则：引用类型的值是对象引用（也就是地址），修改引用会直接修改原对象。而基本类型的值就是本身。

1. 基本类型赋值

   ```java
   // 不影响 b
   int a = 10; int b = a;
   ```

2. 引用类型赋值（对象、数组）

   ```java
   // a 和 b 是同一个对象的引用
   int[] a = {1, 2}; int[] b = a;
   ```

### 数组

基本操作

```java
// arr = {0, 0, 0, 0, 0}
int[] arr = new int[5];

int[][] mp = {
    {1, 1},
    {1, 2}
};

arr[1] = 1;
int len = arr.length;
```

Arrays

```java
int[] a = new int[5];
int[] b = {1, 2, 3, 4, 5};

boolean is  = Arrays.equals(a, b);
Arrays.fill(a, 1);
Arrays.sort(b, 0, 4);
System.out.println(Arrays.toString(b));
```

### 分支与循环

for

```java
int[] a = {1, 2, 3, 4, 5};

int sum = 0;

for (int i = 0; i < 5; i++) {
    sum += a[i];
}

for (int x : a) {
    sum += x;
}
```

while

```java
int idx = 0;
int sum = 0;
while (idx < a.length) {
    sum += a[idx];
    idx += 1;
}
```

if-else

```java
int x = 1;
if (x > 1) {

} else if (x == 1) {

} else {

}
```

### 方法

#### 参数传递

Java 中的参数传递，核心是：Java 永远只有值传递（传拷贝），没有引用传递。

但因为数据类型不同，这个“拷贝”的内容不一样。

1. 基本类型

   ```java
   public void testPrimitive(int x) {
       x = 999;
   }
   int a = 10;
   testPrimitive(a);
   System.out.println(a); // 还是 10
   ```

2. 引用类型（对象/数组）

   1. 修改内容

      ```java
      public void modifyContent(int[] arr) {
          arr[0] = 999;
      }
      
      // 主函数：
      int[] list = {1, 2, 3};
      modifyContent(list);
      System.out.println(list[0]); // 变成 999
      ```

   2. 修改指向

      ```java
      public void changeRef(int[] arr) {
          arr = new int[]{8, 8, 8};
      }
      
      // 主函数：
      int[] list = {1, 2, 3};
      changeRef(list);
      System.out.println(list[0]); // 还是 1
      ```

#### 静态方法

一般作为工具方法或者工厂方法

**归属权**：属于类 (Class)，不属于具体的对象。

**调用方式**：直接用 `Class.function()` 调用。

**访问限制**：

- 只能直接访问静态成员（静态变量、静态方法）。
- 不能直接访问非静态成员（实例变量、实例方法）。
- 不能使用 `this` 或 `super` 关键字。

```java
public class Demo {
    static int staticVar = 100; // 静态变量
    int instanceVar = 1;        // 实例变量

    // 1. 必须加 static 关键字
    public static void keyFeatures() {
        
        // 2. 只能直接访问静态成员
        System.out.println(staticVar); 
        
        // 3. 不能直接访问非静态变量 (解开注释会报错)
        // System.out.println(instanceVar); 
        
        // 4. 不能使用 this 关键字 (解开注释会报错)
        // System.out.println(this);
    }

    public static void main(String[] args) {
        // 5. 推荐直接使用 类名.方法名()
        Demo.keyFeatures(); 
    }
}
```

## 标准库

### 不可修改

在 Java 标准库中，不可修改（Immutable）是一个非常核心的设计理念。

最好的特性就是满足原子性、安全性：在传递参数时，不用担心被接收方偷偷修改数据。

同时也线程安全 (Thread Safety)、适合做 Map 的 Key。

| **类型** | **不可修改 (Immutable) ** | **可修改 (Mutable) **            |
| -------- | ------------------------- | -------------------------------- |
| **文本** | `String`                  | `StringBuilder` / `StringBuffer` |
| **数字** | `Integer` / `Long`        | `AtomicInteger` / `AtomicLong`   |
| **数组** | (无，数组内容默认可改)    | `int[]`, `ArrayList`             |
| **时间** | `LocalDate` (Java 8+)     | `Date` / `Calendar` (老版)       |
| **大数** | `BigDecimal`              | (通常无直接替代，需重新赋值)     |

### String

```java
String a = "qwq";
String b = "w";

a += "string";
a += 'c';

int cmp = a.compareTo(b);
boolean start = a.startsWith("string");
boolean end = a.endsWith("string");
boolean equal = a.equals("string");
int idx = a.indexOf("stirng");
int lastIdx = a.lastIndexOf("string");
int len = a.length();
String replace = a.replace('a', 'b');
// [begin, end)
String str = a.substring(0, 10);
char[] arr = a.toCharArray();
```

### StringBuilder

`String` 的一个“缺点”：String 是不可变的 (Immutable)。写 `String s = "Hello" + " " + "World";` 时，Java 在幕后非常忙碌。因为它不能修改原来的字符串，所以每次拼接，它都要创建一个新的 String 对象。

而 `StringBuilder` 作为一个可变容器，类似 `STL` 的 `vector`，操作效率比 `String` 高，也更灵活。 

```java
// 1. 创建 StringBuilder
StringBuilder sb = new StringBuilder("Hello");

// 2. 追加内容 (最常用的方法)
sb.append(" World");
sb.append(2026); // 连数字都能直接追加

// 3. 插入内容
sb.insert(5, ","); // 在索引5的位置插个逗号

// 4. 反转字符串 (考试常考算法题常用)
// sb.reverse(); 

// 5. 最后转回 String
String result = sb.toString();

System.out.println(result);
```

详细 API：

```java
// 初始化：可以直接给初始值
StringBuilder sb = new StringBuilder("Start"); 
// 性能优化：预先分配内存 (避免底层数组频繁扩容 copy)
StringBuilder sbHighPerf = new StringBuilder(1024); 

// 链式调用
sb.append(" Hello").append(2026).append(true); 
// 在 index 前插入
sb.insert(0, ">> "); 
// [start, end)
sb.delete(0, 3); 
sb.deleteCharAt(sb.length() - 1); 
// [start, end)
sb.replace(0, 5, "Java"); 
sb.setCharAt(0, 'j'); 
sb.reverse(); 
int len = sb.length(); 
// 底层数组申请了多大空间
int cap = sb.capacity();
// 快速清空内容 (设为0) 或 截断字符串
sb.setLength(0); 

// 所有操作结束后，必须转回不可变的 String
String result = sb.toString();
```

### Number

Number 是一套 Java 数据类型的封装，旨在为数据操作提供一套统一的接口

初始化：

```java
Integer i = 0;
Short s = 0;
Long l = 0L;

Byte bt = 'a';
Character ch = 'a';

Float f = 1.0f;
Double d = 1.0;

Boolean b = false;
```

接口：

```java
Number num = 1.0;
System.out.println(num.intValue());

Double d = num.doubleValue();
double dx = d;
```

### Math

```java
// [0.0, 1.0)
double rand = Math.random();
// [1, 100)
int randomInt = (int)(Math.random() * 100) + 1;

// e^1 ≈ 2.718
Math.exp(1);
// ln(e) = 1
Math.log(Math.E);
// log10(100) = 2
Math.log10(100);

Math.sin(Math.PI / 2);
Math.cos(0);
Math.tan(Math.PI / 3);
Math.atan(1);
Math.toDegrees(Math.PI / 2);

Math.abs(-1);
Math.max(1, 2);
Math.min(1, 2);

// 3^2
Math.pow(2, 3);
Math.sqrt(2);

Math.floor(1.5);
Math.ceil(1.5);
```

### List

```java
ArrayList<Integer> list = new ArrayList<>();
for (int i = 0; i < 10; i++) {
    list.add(i);
}
list.set(2, 1);
Collections.sort(list);
if (!list.isEmpty()) {
    for (int i = 1; i < list.size(); i++) {
        System.out.println(list.get(i));
    }
    for (int x : list) {
        System.out.println(x);
    }
}
```

### 日期和时间

#### Date

```java
Date currentDate = new Date();
Date myDate = new Date(1640995200000L);

for (int i = 4; i < 10; i++) {
    System.out.println(new Date((int)Math.pow(10, i)));
}
```

#### GregorianCalendar

```java
for (int i = 0; i < 2; i++) {
    System.out.println("Year is " + calendar.get(GregorianCalendar.YEAR));
    System.out.println("Month is " + calendar.get(GregorianCalendar.MONTH));
    System.out.println("Date is " + calendar.get(GregorianCalendar.DAY_OF_MONTH));
    calendar.setTimeInMillis(1234567898765L);
}
```

## 类与对象

对象是类的实例，可以在一段代码中实例化多个类的对象

```java
public class Puppy {
    private int age;
    private final String name;

    public Puppy(String name) {
        this.name = name;
    }
    
    public Puppy() {
        // this 构造必须是方法的第一行
        // 如果不写，就会按照规则初始化为默认值
        this("Dog");
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getAge() {
        // 这里没有变量覆盖
        return age;
    }

    public String getName() {
        return name;
    }
}
```

```java
public class Test {
    public static void main(String[] args) {
        Puppy puppy = new Puppy("name");
        puppy.setAge(1);
        System.out.println(puppy.getAge());
        System.out.println(puppy.getName());
    }
}
```

**成员变量（数据域）的默认值：**

数值类型是 `0`，引用类型是 `null`，布尔类型是 `false`（相当于 `0`）

```java
int: 0
double: 0.0
boolean: false
String: null
Array: null
```

## 继承

父类：

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " eat");
    }
}
```

子类：

```java
public class Dog extends Animal {
    Dog (String name) {
        super(name);
    }

    public void bark() {
        System.out.println(name + " bark");
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println(name + "Eat more");
    }
}
```

子类可以自动向上转型为父类，但是父类并不能向下转型为子类。

#### super 关键字

`super` 关键字表示父类，类似 `this` 关键字

构造方法不能继承，实现的时候如果需要继承父类的构造方法，需要使用 `super` 关键字调用父类的构造方法

1. **构造子类必须先构造父类**： 子类构造函数第一行默认是 `super()`，如果你在子类的构造函数里没有显式地写 `super(...)`，编译器会**自动**帮你加一行 `super()`，也就是去调用父类的**无参构造函数**。

2. **默认构造函数的消失规则**： 如果你在类里**手动定义了任何一个**构造函数（不管是有参还是无参），Java 编译器就**不再赠送**你那个默认的无参构造函数了。

#### 方法重写

加上`@Override` 直接重写父类的方法，虽然不写也可以，但是加上这个注解可以进行安全检查

**核心规则：两同、两小、一大**

1. **两同 (Two Same)**：
   - **方法名**必须相同。
   - **参数列表**必须相同，即参数的个数、类型、顺序必须完全一样（如果参数不同，那是重载 Overload，不是重写）。
2. **一大 (One Big)**：
   - **访问权限**必须**大于或等于**父类。
   - 顺序：`public` > `protected` > `(default)` > `private`。
3. **两小 (Two Small)**：
   - **返回值类型**：必须是父类返回值类型的**同类**或**子类**，即为**协变返回类型（Covariant Return Type）**，子类重写方法时，返回类型可以是父类方法返回类型的子类。。
   - **抛出的异常**：子类方法声明抛出的**检查异常 (Checked Exception)** 范围必须**小于或等于**父类（或者是父类异常的子类，或者干脆不抛异常）。你不能抛出父类没声明过的新的检查异常。 

```java
// === 1. 父类定义 ===
class Father {
    // 普通方法，准备被重写
    protected Number doCalculation() throws IOException {
        System.out.println("Father: Calculating...");
        return 0;
    }
    
    // 私有方法
    private void secretMethod() {
        System.out.println("Father: Private secret");
    }

    // 静态方法
    public static void staticMethod() {
        System.out.println("Father: Static method");
    }
}

// === 2. 子类定义 ===
class Son extends Father {

    // 正确重写演示
    // 1. 两同：方法名 doCalculation，参数为空，完全一致。
    // 2. 一大：访问权限由 protected 变成了 public（变大），合法。
    // 3. 两小-返回值：父类返 Number，子类返 Integer（Integer 是 Number 子类），合法。
    // 4. 两小-异常：父类抛 IOException，子类抛 FileNotFoundException（是子类），合法。
    @Override
    public Integer doCalculation() throws FileNotFoundException {
        System.out.println("Son: Calculating optimized!");
        return 100;
    }

    // 错误重写示范 1：权限太小
    // void doCalculation() { } // 错！默认权限比 protected 小。

    // 错误重写示范 2：返回值类型不对
    // public Object doCalculation() { return "Wrong"; } // 错！Object 是 Number 的父类，不是子类。

    // 错误重写示范 3：抛出了更大或新的检查异常
    // public Integer doCalculation() throws Exception { } // 错！Exception 比 IOException 大。

    
    // 特殊情况 1：Private "重写" 假象
    // 这只是子类自己定义了一个全新的方法，刚好重名而已。加 @Override 会报错。
    private void secretMethod() {
        System.out.println("Son: My own secret");
    }

    // 特殊情况 2：Static "重写" 假象
    // 这叫方法隐藏。如果用 Father f = new Son(); f.staticMethod()，
    // 会调用 Father 的方法，而不是 Son 的。因为它不具备多态性。
    public static void staticMethod() {
        System.out.println("Son: Static method");
    }
}
```

### instanceof 运算符

```java
object instanceof type
```

用于在运行时检查一个对象是否是特定类（Class）、接口（Interface）或其子类的实例

`object` 和 `type` 在同一棵继承树上，否则会 `CE`

## 访问控制

**private**：仅限**本类内部**访问。

**(default)**：仅限**本类**和**同包**。

**protected**：包含**本类**、**同包**以及**所有子类**（即使子类在不同包）。

**public**：对**整个项目**开放，任何地方的类都可以访问（公共广场）。

```java
public class AccessLevel {
    // 仅限本类内部访问
    private int a;
    // 仅限同一个包访问
    /*default*/ int b;
    // 允许同包 + 所有子类访问
    protected int c;
    // 允许整个项目访问
    public int d;
}
```

## 多态

简单来说就是 `父类 名称 = new 子类()`

```java
public class Test {
    public static void main(String[] args) {
        Animal dog = new Dog("dog_name");
        Animal cat = new Cat("cat_name");
        dog.eat();
        cat.eat();
    }
}
```

注意到 `dog` 和 `cat` 实际上都被声明为 `Animal` 类型，但是通过对 `Cat` 类和 `Dog` 类的不同方法重载，我们可以实现下面的功能。

```java
public class Cat extends Animal {
    Cat(String name) {
        super(name);
    }
  
    @Override
    public void eat() {
        System.out.println("Class : Cat");
        super.eat();
    }
}
```

```java
public class Dog extends Animal {
    Dog (String name) {
        super(name);
    }
    
    @Override
    public void eat() {
        System.out.println("Class : Dog");
        super.eat();
    }
}
```

我们可以打印得到：

```bash
Class : Dog
dog_name eat
Class : Cat
cat_name eat
```

这就是 Java 的多态。

更具体地说，**多态**是指同一个行为（方法/消息）作用于不同的对象时，会产生不同的行为结果。

观察上面的代码，我们用到了面向对象的三个性质：

1. **继承（Inheritance）：** 必须存在子类和父类的继承关系（或者实现接口）。
2. **重写（Overriding）：** 子类必须重写父类的方法。
3. **向上转型（Upcasting）：** 父类的引用变量指向子类的对象。

这就是多态存在的三个必要条件

有了多态之后，我们就能写出这样的方法：

```java
public static void animalEat(Animal animal) {
    animal.eat();
}
```

而不需要关心对象的具体类型（是 `Dog` 还是 `Cat`）

## 抽象类

如果一个类不完全实现类的所有接口，而是交给继承的子类实现，那么这个类就可以被声明为抽象类。

抽象类没有实现的接口，可以被声明为抽象接口。

使用 `abstract`

```java
public abstract class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    public abstract void eat();
}
```

```java
public class Dog extends Animal {
    Dog (String name) {
        super(name);
    }

    @Override
    public void eat() {
        System.out.println("Class-Dog: Eat");
    }
}
```

这个例子中，`Animal` 可以不需要实现 `eat()`，转而交给 `Dog` 类实现。

抽象类有几点性质：

1. 包含抽象方法的类必须是抽象类
2. 任何子类必须重写父类的所有抽象方法，或者声明自身为抽象类

当然，如果一个抽象类不包含抽象方法也是可以被声明为抽象类的，通常这样做是为了防止类被实例化。

## 接口

接口是 Java 中的一种特殊的抽象类，具备抽象类的所有性质

具有以下性质：

1. 接口是隐式 `abstract` 的
2. 接口的方法是隐式 `abstract public` 的
3. 接口的变量是隐式 `public sattic final` 的
4. 接口可以被多继承

总的来说，接口是一种支持多继承的抽象类。

什么时候使用抽象类，什么时候使用接口：

- **抽象类是 "Is-a"（是不是）：** 强调的是**族群/血缘**。
- **接口是 "Can-do"（会不会）：** 强调的是**能力/功能**

例如：

```java
public abstract class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }
}
```

```java
public interface Bark {
    void bark();
}
```

```java
public interface Eat {
    void eat();
}
```

例如我需要实现 `Cat` 类的时候，可以继承 `Animal` 类并实现 `Eat` 的接口：

```java
public class Cat extends Animal implements Eat {
    Cat (String name) {
        super(name);
    }

    public void eat() {
        System.out.println("Class-Cat: Eat");
    }
}
```

而需要实现 `Dog` 类的时候，我不仅可以实现 `Eat` 的接口，也可以实现 `Bark` 的接口。

```java
public class Dog extends Animal implements Eat, Bark {
    Dog (String name) {
        super(name);
    }

    @Override
    public void eat() {
        System.out.println("Class-Dog: Eat");
    }

    @Override
    public void bark() {
        System.out.println("Class-Dog: Bark");
    }
}
```

接口的命名通常是一个形容词，例如 `Swimmable`、`Flyable` 等等

当然接口和接口之间也可以通过 `extend` 关键字相互继承

## 异常处理

通过 `try-catch` 语法以及 `throws` 和 `throw` 关键字进行 Java 的异常处理：

```java
public static void IO() throws IOException {
    throw new IOException();
}

public static void Runtime() throws RuntimeException {
    throw new RuntimeException();
}

public static void main(String[] args) {
    try {
        Test.IO();
        Test.Runtime();
    } catch (IOException io) {
        System.out.println(Arrays.toString(io.getStackTrace()));
    } catch (RuntimeException re) {
        System.out.println(re.getMessage());
    } finally {
        System.out.println("Finished test.");
    }
}
```

这段代码中，`IOException` 先抛出，因此程序不会继续执行接下来的 `Test.Runtime()`。

当 `try` 块中抛出异常时，JVM 会按照代码书写的顺序，从上往下依次检查每一个 `catch` 块。

只要找到第一个能匹配该异常类型（或者是该异常的父类）的 `catch` 块，JVM 就会进入该块执行。执行完毕后，跳过后面所有剩余的 `catch` 块。

为了避免不可达代码错误，Java 强制要求：如果多个 `catch` 块捕获的异常存在继承关系，必须把子类异常放在前面，父类异常放在后面。

#### 运行时异常

RuntimeException

| **异常名称**                         | **记忆口诀**   | **典型场景**                          |
| ------------------------------------ | -------------- | ------------------------------------- |
| **`NullPointerException` (NPE)**     | **空指针**     | 拿着 `null` 当对象用。`null.method()` |
| **`ArrayIndexOutOfBoundsException`** | **越界**       | 数组长 10，你非要取第 11 个。         |
| **`StringIndexOutOfBoundsException`** | **越界**       | 字符串长 10，你非要取第 11 个。         |
| **`ClassCastException`**             | **类型转换错** | 指鹿为马。把 `Dog` 强转成 `Cat`。     |
| **`ArithmeticException`**            | **算术错**     | `10 / 0`，除数为零。                  |
| **`NumberFormatException`**          | **格式错**     | `Integer.parseInt("abc")`。           |

#### 检查型异常

Checked Exception

| **异常名称**                 | **记忆口诀**   | **典型场景**                            |
| ---------------------------- | -------------- | --------------------------------------- |
| **`IOException`**            | **IO流异常**   | 读写失败、网络断开。这是 IO 的父类。    |
| **`FileNotFoundException`**  | **找不到文件** | `new FileInputStream("不存在的文件")`。 |
| **`SQLException`**           | **SQL异常**    | SQL 语句写错了，或者数据库没连上。      |
| **`ClassNotFoundException`** | **类找不到**   | 即使你有代码，但运行环境里缺 jar 包。   |

#### Error

`OutOfMemoryError`：OOM，内存溢出

`StackOverflowError`：栈溢出。

## IO

### File

```java
// 1. 定义文件对象 (可以是相对路径或绝对路径)
File file = new File("demo.txt"); 

try {
    // 2. 判断是否存在，不存在则创建
    if (!file.exists()) {
        boolean created = file.createNewFile(); // 真正创建文件
        System.out.println("文件创建成功: " + created);
    } else {
        System.out.println("文件已存在");
    }

    // 3. 获取文件信息
    System.out.println("文件名: " + file.getName());
    System.out.println("绝对路径: " + file.getAbsolutePath());
    System.out.println("文件大小(字节): " + file.length());
    System.out.println("是文件夹吗? " + file.isDirectory());

    // 4. 创建文件夹 (目录)
    File dir = new File("my_images");
    dir.mkdir(); // make directory

    // 5. 列出文件夹下的内容
    File projectDir = new File("."); // 当前项目目录
    for (String f : projectDir.list()) {
        System.out.println("当前目录下: " + f);
    }

    // 6. 删除文件 (慎用，不走回收站)
    // file.delete(); 

} catch (IOException e) {
    e.printStackTrace();
}
```

### Scanner

```java
// System.in 代表标准输入流（键盘）
Scanner sc = new Scanner(System.in);

System.out.print("请输入你的年龄: ");
if (sc.hasNextInt()) {
    // 判断输入的是否是整数，防止报错
    int age = sc.nextInt();
    System.out.println("明年你就 " + (age + 1) + " 岁了");
} else {
    System.out.println("输入的不是数字！");
}

// 记得关闭，释放资源
sc.close();
```

读取文件内容：

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class FileReadScanner {
    public static void main(String[] args) {
        // 1. 提供一个 File 对象
        File file = new File("demo.txt");

        try {
            // 2. 将 File 传给 Scanner
            Scanner sc = new Scanner(file);

            // 3. 循环读取每一行
            while (sc.hasNextLine()) {
                String line = sc.nextLine();
                System.out.println("读取内容: " + line);
            }
            
            sc.close();
        } catch (FileNotFoundException e) {
            System.out.println("找不到文件！请检查路径。");
        }
    }
}
```

### Writer

#### FileWriter

默认是**覆盖模式**（每次运行清空文件重写）。如果想**追加内容**，需要在构造函数里加个 `true`

```java
File file = new File("output.txt");

// 构造函数第二个参数:
// false (或不写) = 覆盖模式 (文件会被清空！)
// true = 追加模式 (接着原来的内容写)
try (FileWriter fw = new FileWriter(file, true)) { // try-with-resources 自动关闭

    fw.write("这是第一行文字。\n"); // 手动换行
    fw.write("这是第二行。");

    // 注意：不用手动调 fw.close()，try-catch 会自动处理
} catch (IOException e) {
    e.printStackTrace();
}
```

#### PrintWriter

默认是**覆盖模式**（每次运行清空文件重写）。

```java
// PrintWriter 可以直接接收文件名字符串，甚至不需要 new File()
try (PrintWriter pw = new PrintWriter("report.txt")) {

    String name = "Java";
    int score = 100;

    pw.println("这是一个成绩单"); // 自动换行
    pw.printf("姓名: %s, 分数: %d", name, score); // 支持格式化

} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```

如果要追加需要使用装饰器：

```java
public static void main(String[] args) {
    // 关键点：
    // 1. 里面用 FileWriter，第二个参数 true 代表 "Append" (追加)
    // 2. 外面套一个 PrintWriter，为了能用 println
    try (PrintWriter pw = new PrintWriter(new FileWriter("log.txt", true))) {
        pw.println("这是一条追加的日志记录");
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

#### BufferedWriter

`BufferedWriter` 会先把数据攒在内存（缓冲区）里，攒满了一次性倒进硬盘。

```java
try (BufferedWriter bw = new BufferedWriter(new FileWriter("big_data.txt"))) {
    for (int i = 0; i < 1000; i++) {
        bw.write("这是第 " + i + " 行数据");
        bw.newLine(); // 跨平台的换行符，比 "\n" 更安全
    }

} catch (IOException e) {
    e.printStackTrace();
}
```
