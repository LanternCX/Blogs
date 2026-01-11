# OOP

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

char ch = 'c';
byte bt = 'a';

boolean is = false;
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

## 标准库

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
// begin, end
String str = a.substring(0, 10);
char[] arr = a.toCharArray();
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
// (0.0, 1.0)
double rand = Math.random();
// [1, 100]
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

    public void setAge(int age) {
        this.age = age;
    }

    public int getAge() {
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

#### super 关键字

`super` 关键字表示父类，类似 `this` 关键字

构造方法不能继承，实现的时候如果需要继承父类的构造方法，需要使用 `super` 关键字调用父类的构造方法

#### 方法重写

加上`@Override` 直接重写父类的方法，虽然不写也可以，但是加上这个注解可以进行安全检查

### instanceof 运算符

```java
object instanceof type
```

用于在运行时检查一个对象是否是特定类（Class）、接口（Interface）或其子类的实例

`object` 和 `type` 在同一棵继承树上，否则会 `CE`

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

这段代码中，`IOException` 先抛出，因此程序不会继续执行接下来的 `Test.Runtime()`

## IO
