# 操作系统原理实验填空题背诵表

> 按实验题库章节整理，重点提取填空题中需要记忆的头文件、API、参数、固定宏与代码模板。

---

# 第一章 Linux 系统与实验环境

## 1. 内核源码目录

```text
arch/      与硬件体系结构相关
kernel/    调度、定时器等内核核心代码
ipc/       System V IPC 等进程间通信代码
drivers/   设备驱动
mm/        内存管理
fs/        文件系统
```

Linux 内核五大子系统：

```text
SCHED    进程调度
MM       内存管理
VFS      虚拟文件系统
NET      网络接口
IPC      进程间通信
```

## 2. 高频固定填空

```text
Linux 版本：内核版、发行版
至少创建的分区：根分区、swap 分区
make 的规则文件：Makefile
程序请求内核服务的入口：系统调用
```

## 3. 常用命令

```bash
dmesg          # 查看内核环形缓冲区、启动信息
pstree         # 树状显示进程关系
top            # 动态显示进程、CPU、内存信息
uname -r       # 查看内核版本
pwd            # 显示当前目录
ps -f          # 完整格式显示进程信息
ps ax          # 显示较完整的进程列表
lsmod          # 显示已加载的内核模块
ipcs           # 查看 System V IPC 对象
```

## 4. GCC 参数

```bash
gcc test.c
# 默认生成：a.out

gcc test.c -o test
# -o：指定输出文件名

gcc thread.c -o thread -pthread
# -pthread：编译并链接 pthread 程序
```

---

# 第二章 进程控制与程序执行

## 1. 常用头文件

```c
#include <unistd.h>     // fork、getpid、getppid、read、write、exec
#include <sys/wait.h>   // wait、waitpid
#include <fcntl.h>      // open、O_CREAT、O_TRUNC、O_RDWR
#include <sys/stat.h>   // S_IRWXU 等权限宏
#include <string.h>     // strcpy、strlen
#include <stdlib.h>     // exit、system
#include <errno.h>      // errno
```

## 2. `fork()`

```c
pid_t pid = fork();
```

返回值必须背：

```text
pid < 0    创建失败
pid == 0   当前是子进程
pid > 0    当前是父进程，pid 是子进程号
```

典型填空：

```c
if ((cld_pid = fork()) == 0) {
    // 子进程
} else {
    // 父进程
}
```

## 3. 进程号 API

```c
pid_t getpid(void);    // 获取当前进程 PID
pid_t getppid(void);   // 获取父进程 PID
```

典型代码：

```c
printf("current PID = %d\n", getpid());
printf("parent PID = %d\n", getppid());
printf("child PID = %d\n", cld_pid);  // 父进程中 fork 的返回值
```

## 4. 等待子进程

```c
pid_t wait(int *status);
pid_t waitpid(pid_t pid, int *status, int options);
```

常见填写：

```c
wait(NULL);
wait(0);
waitpid(pid, NULL, 0);
```

参数：

```text
pid       指定等待哪个子进程
status    保存退出状态；不需要时填 NULL
options   0 表示普通阻塞等待
```

## 5. 文件操作

```c
int open(const char *path, int flags, mode_t mode);
ssize_t write(int fd, const void *buf, size_t count);
ssize_t read(int fd, void *buf, size_t count);
int close(int fd);
```

典型代码：

```c
int fd = open(
    "temp",
    O_CREAT | O_TRUNC | O_RDWR,
    S_IRWXU
);

write(fd, buf, strlen(buf));
close(fd);
```

常见标志：

```text
O_CREAT    文件不存在时创建
O_TRUNC    文件存在时清空
O_RDWR     以可读可写方式打开
S_IRWXU    文件所有者拥有读、写、执行权限
```

## 6. `exec` 与 `system`

```c
execlp("ps", "ps", "-f", NULL);

char *argv[] = {"ls", "-l", NULL};
execvp(argv[0], argv);

system("ls -l");
```

记忆：

```text
exec 成功：替换当前程序，后续代码不执行，PID 通常不变
system 成功：命令执行结束后返回原程序
```

## 7. `fork()` 数量固定题

连续执行 \(n\) 次无条件 `fork()`：

```text
最终进程数 = 2^n
```

题库固定结果：

```c
for (i = 0; i < 2; i++) {
    fork();
    printf("a");
}
```

```text
进程数：4
字符数：8
原因：未刷新的缓冲区也会被 fork 复制
```

使用换行或 `fflush(stdout)`：

```c
printf("a\n");
```

或：

```c
printf("a");
fflush(stdout);
```

```text
两次循环：4 个进程，输出 6 个 a
```

---

# 第三章 线程与同步

## 1. pthread 头文件与编译参数

```c
#include <pthread.h>
```

```bash
gcc thread.c -o thread -pthread
```

## 2. 创建和等待线程

```c
int pthread_create(
    pthread_t *tid,
    const pthread_attr_t *attr,
    void *(*start_routine)(void *),
    void *arg
);

int pthread_join(
    pthread_t tid,
    void **retval
);
```

典型填写：

```c
pthread_t id1, id2;

pthread_create(&id1, NULL, thread_white_fun, NULL);
pthread_create(&id2, NULL, thread_black_fun, NULL);

pthread_join(id1, NULL);
pthread_join(id2, NULL);
```

参数记忆：

```text
&tid            保存线程标识
NULL            使用默认线程属性
thread_fun      线程入口函数
arg             传给线程函数的参数
```

线程函数标准形式：

```c
void *thread_fun(void *arg) {
    return NULL;
}
```

## 3. POSIX 无名信号量

头文件与类型：

```c
#include <semaphore.h>

sem_t sem_id;
```

核心 API：

```c
int sem_init(sem_t *sem, int pshared, unsigned int value);
int sem_wait(sem_t *sem);
int sem_post(sem_t *sem);
int sem_destroy(sem_t *sem);
```

互斥模板：

```c
sem_t mutex;

sem_init(&mutex, 0, 1);

sem_wait(&mutex);
/* 临界区 */
sem_post(&mutex);

sem_destroy(&mutex);
```

`sem_init()` 参数：

```text
&mutex    信号量地址
0         同一进程的线程之间共享
1         初值；表示开始时允许一个线程进入
```

对应理论操作：

```text
sem_wait()    P 操作，申请资源
sem_post()    V 操作，释放资源
```

## 4. 两线程严格交替

先执行白线程，再执行黑线程：

```c
sem_t white_turn;
sem_t black_turn;

sem_init(&white_turn, 0, 1);
sem_init(&black_turn, 0, 0);
```

```c
// 白线程
sem_wait(&white_turn);
/* 白线程操作 */
sem_post(&black_turn);

// 黑线程
sem_wait(&black_turn);
/* 黑线程操作 */
sem_post(&white_turn);
```

记忆：

```text
初值 1：开始即可执行
初值 0：必须等待其他线程唤醒
```

## 5. pthread 互斥锁

类型：

```c
pthread_mutex_t mutex;
```

API：

```c
pthread_mutex_init(&mutex, NULL);

pthread_mutex_lock(&mutex);
/* 临界区 */
pthread_mutex_unlock(&mutex);

pthread_mutex_destroy(&mutex);
```

完整填空顺序：

```text
pthread_mutex_t
pthread_mutex_init
pthread_create
pthread_join
pthread_mutex_lock
pthread_mutex_unlock
```

## 6. POSIX 命名信号量

```c
sem_t *s1 = sem_open("/s1", O_CREAT, 0666, 1);
sem_wait(s1);
sem_post(s1);
sem_close(s1);
sem_unlink("/s1");
```

注意参数形式：

```c
sem_t sem;      sem_wait(&sem);   // 无名信号量变量
sem_t *s1;      sem_wait(s1);     // sem_open 返回的指针
```

---

# 第四章 进程信号

## 1. 常用头文件

```c
#include <signal.h>     // signal、sigaction、kill、信号宏
#include <unistd.h>     // fork、pause、alarm、getppid
#include <sys/wait.h>   // wait
#include <stdlib.h>     // exit
```

## 2. 设置处理函数

旧接口：

```c
signal(SIGALRM, ding);
```

推荐接口：

```c
struct sigaction sa;

sa.sa_handler = ding;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;

sigaction(SIGALRM, &sa, NULL);
```

记忆：

```text
signal / sigaction    设置处理方式
kill                  发送信号
```

处理函数：

```c
void ding(int sig) {
    alarm_fired = 1;
}
```

## 3. 发送信号

```c
int kill(pid_t pid, int sig);
```

典型填空：

```c
kill(getppid(), SIGALRM);
kill(p1, 16);
kill(p2, 17);
```

参数：

```text
pid    接收信号的进程
sig    要发送的信号
```

其他发送接口：

```c
raise(SIGUSR1);        // 向当前进程发送信号
alarm(5);              // 5 秒后向自身发送 SIGALRM
sigqueue(pid, sig, value);
```

## 4. 等待信号

```c
pause();
```

作用：

```text
挂起当前进程，直到收到一个能够递送的信号。
```

标准父子信号模板：

```c
if (fork() == 0) {
    sleep(5);
    kill(getppid(), SIGALRM);
    exit(0);
}

signal(SIGALRM, ding);
pause();
wait(NULL);
```

## 5. 高频信号

```text
Ctrl-C       SIGINT
Ctrl-Z       SIGTSTP
alarm()      SIGALRM
kill PID     SIGTERM
kill -9 PID  SIGKILL
```

> 题库部分旧代码直接写信号编号 `16`、`17`。考试填空可按题目填写；实际编程应优先使用 `SIGUSR1`、`SIGUSR2` 等宏。

---

# 第五章 进程间通信

## 1. 匿名管道

头文件：

```c
#include <unistd.h>
```

API：

```c
int pipe(int pipefd[2]);
```

固定下标：

```text
pipefd[0]    读端
pipefd[1]    写端
```

模板：

```c
int fd[2];
pipe(fd);

write(fd[1], buf, strlen(buf));
read(fd[0], buf, sizeof(buf));

close(fd[0]);
close(fd[1]);
```

## 2. 有名管道 FIFO

头文件：

```c
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
```

API：

```c
int mkfifo(const char *pathname, mode_t mode);
```

模板：

```c
mkfifo("myfifo", 0666);

int fd = open("myfifo", O_WRONLY);
write(fd, buf, strlen(buf));
close(fd);
```

## 3. System V IPC 公共键值

头文件：

```c
#include <sys/ipc.h>
```

生成键值：

```c
key_t ftok(const char *pathname, int proj_id);
```

模板：

```c
key_t key = ftok(".", 'a');
```

参数：

```text
pathname    已存在的文件或目录路径
proj_id     项目标识，常用字符常量
```

## 4. System V 消息队列

头文件：

```c
#include <sys/msg.h>
#include <sys/ipc.h>
```

消息结构：

```c
struct msgbuf {
    long mtype;
    char mtext[100];
};
```

API：

```c
int msgget(key_t key, int msgflg);

int msgsnd(
    int msqid,
    const void *msgp,
    size_t msgsz,
    int msgflg
);

ssize_t msgrcv(
    int msqid,
    void *msgp,
    size_t msgsz,
    long msgtyp,
    int msgflg
);

int msgctl(
    int msqid,
    int cmd,
    struct msqid_ds *buf
);
```

常用模板：

```c
int msqid = msgget(key, IPC_CREAT | 0666);

msgsnd(
    msqid,
    &msg,
    sizeof(msg.mtext),
    0
);

msgrcv(
    msqid,
    &msg,
    sizeof(msg.mtext),
    1,
    0
);

msgctl(msqid, IPC_RMID, NULL);
```

重点：

```text
msgsz 不包含 long mtype
msgtyp = 0      读取队列第一条消息
msgtyp > 0      读取指定类型消息
IPC_RMID        删除消息队列
```

## 5. System V 共享内存

头文件：

```c
#include <sys/shm.h>
#include <sys/ipc.h>
```

API：

```c
int shmget(key_t key, size_t size, int shmflg);

void *shmat(
    int shmid,
    const void *shmaddr,
    int shmflg
);

int shmdt(const void *shmaddr);

int shmctl(
    int shmid,
    int cmd,
    struct shmid_ds *buf
);
```

完整模板：

```c
int shmid = shmget(
    key,
    1024,
    IPC_CREAT | 0666
);

char *addr = shmat(
    shmid,
    NULL,
    0
);

strcpy(addr, "hello");

shmdt(addr);

shmctl(
    shmid,
    IPC_RMID,
    NULL
);
```

参数记忆：

```text
shmget:
key      IPC 键值
size     共享内存大小
shmflg   权限和创建标志

shmat:
shmid      共享内存标识符
shmaddr    映射地址，通常填 NULL
shmflg     0 表示可读写；SHM_RDONLY 表示只读
```

## 6. System V 信号量集

头文件：

```c
#include <sys/sem.h>
#include <sys/ipc.h>
```

API：

```c
int semget(key_t key, int nsems, int semflg);

int semop(
    int semid,
    struct sembuf *sops,
    size_t nsops
);

int semctl(
    int semid,
    int semnum,
    int cmd,
    ...
);
```

操作结构：

```c
struct sembuf {
    unsigned short sem_num;
    short sem_op;
    short sem_flg;
};
```

P 操作：

```c
struct sembuf p = {
    .sem_num = 0,
    .sem_op = -1,
    .sem_flg = 0
};

semop(semid, &p, 1);
```

V 操作：

```c
struct sembuf v = {
    .sem_num = 0,
    .sem_op = 1,
    .sem_flg = 0
};

semop(semid, &v, 1);
```

固定含义：

```text
sem_num    操作信号量集中的第几个信号量
sem_op=-1  P 操作
sem_op=1   V 操作
nsops=1    本次操作一个 sembuf
```

删除信号量集：

```c
semctl(semid, 0, IPC_RMID);
```

---

# 第六章 设备驱动与内核模块

## 1. 内核模块头文件

```c
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
```

## 2. 模块入口与出口

```c
static int __init my_init(void) {
    printk(KERN_INFO "module loaded\n");
    return 0;
}

static void __exit my_exit(void) {
    printk(KERN_INFO "module removed\n");
}

module_init(my_init);
module_exit(my_exit);
```

固定填写：

```text
__init
__exit
module_init
module_exit
```

## 3. 模块信息宏

```c
MODULE_LICENSE("GPL");
MODULE_AUTHOR("name");
MODULE_DESCRIPTION("description");
MODULE_VERSION("1.0");
```

最常考：

```c
MODULE_LICENSE("GPL");
```

## 4. 内核日志

```c
printk(KERN_INFO "message\n");
```

常见日志级别：

```text
KERN_EMERG
KERN_ALERT
KERN_CRIT
KERN_ERR
KERN_WARNING
KERN_NOTICE
KERN_INFO
KERN_DEBUG
```

查看日志：

```bash
dmesg
```

## 5. 模块命令

```bash
insmod module.ko       # 装载模块
rmmod module           # 卸载模块
lsmod                  # 查看模块
modinfo module.ko      # 查看模块信息
dmesg                   # 查看内核输出
```

## 6. 字符设备 `file_operations`

常见头文件：

```c
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/uaccess.h>
```

常见回调：

```c
static int dev_open(
    struct inode *inode,
    struct file *file
);

static int dev_release(
    struct inode *inode,
    struct file *file
);

static ssize_t dev_read(
    struct file *file,
    char __user *buf,
    size_t count,
    loff_t *ppos
);

static ssize_t dev_write(
    struct file *file,
    const char __user *buf,
    size_t count,
    loff_t *ppos
);
```

操作表：

```c
static const struct file_operations fops = {
    .owner = THIS_MODULE,
    .open = dev_open,
    .read = dev_read,
    .write = dev_write,
    .release = dev_release,
};
```

常见成员：

```text
.owner
.open
.read
.write
.release
.unlocked_ioctl
```

## 7. 用户空间与内核空间复制

```c
copy_to_user(user_buf, kernel_buf, count);
copy_from_user(kernel_buf, user_buf, count);
```

方向：

```text
copy_to_user      内核 → 用户
copy_from_user    用户 → 内核
```

---

# 高频头文件总表

```c
#include <stdio.h>       // printf、perror、fflush
#include <stdlib.h>      // exit、system、abort
#include <string.h>      // strcpy、strlen、memset
#include <errno.h>       // errno

#include <unistd.h>      // fork、exec、pipe、read、write、close
#include <sys/types.h>   // pid_t 等系统类型
#include <sys/wait.h>    // wait、waitpid
#include <sys/stat.h>    // 权限宏、mkfifo
#include <fcntl.h>       // open 及 O_* 标志

#include <pthread.h>     // pthread API
#include <semaphore.h>   // POSIX 信号量
#include <signal.h>      // signal、sigaction、kill

#include <sys/ipc.h>     // System V IPC 公共定义、ftok
#include <sys/msg.h>     // 消息队列
#include <sys/shm.h>     // 共享内存
#include <sys/sem.h>     // System V 信号量
```

---

# 高频 API 固定搭配

```text
fork       → getpid / getppid / wait
fork       → exec → wait
open       → read / write → close
pipe       → read / write → close
pthread_create → pthread_join
sem_init   → sem_wait / sem_post → sem_destroy
pthread_mutex_init → lock / unlock → destroy
signal     → pause / kill
msgget     → msgsnd / msgrcv → msgctl
shmget     → shmat → shmdt → shmctl
semget     → semop → semctl
module_init → module_exit
```

# 最后速记

```text
fork：父返回子 PID，子返回 0
pipefd[0] 读，pipefd[1] 写
sem_wait 是 P，sem_post 是 V
互斥初值 1，同步等待初值 0
signal 注册，kill 发送，pause 等待
msgsz 不包含 mtype
shmat 的 shmaddr 通常填 NULL
IPC_CREAT 创建，IPC_RMID 删除
copy_to_user：内核到用户
copy_from_user：用户到内核
```
