# RRR 构型关节式三自由度机械臂的运动学解算

## 简介

RRR 型关节式 3DOF 机械臂一般由 3 个关节构成

- $J_1$：绕 Z 轴旋转，控制机械臂的朝向

- $J_2$：肩关节，控制抬升

- $J_3$：肘关节，控制伸缩

利用柱面坐标，我们可以方便的表示末端关节的位置：

$$
P(r, \theta, h)
$$

其中 $ r $ 表示末端半径，$ \theta $ 表示末端旋转角度，$ h $ 表示末端高度

为了对机械臂进行控制，我们需要完成机械臂运动学的正解与逆解

![RRR](https://gitee.com/LanternCX/picx-images-hosting/raw/master/2025-08-09/RRR.9rjpub4btx.webp)

## 运动学正解

求解 $r$

$ L_2$ 在 $ r - \theta$ 平面的投影

$$
r_1 = L_2 \sin\theta_2
$$

$\theta_3$ 应该是关于水平面的夹角，因此实际上还需要再加上 $ \alpha + \beta $

$$
\alpha + \beta = \frac{\pi}{2} - \theta_2
$$

$ L_3$ 在 $ r - \theta$ 平面的投影

$$
r_2 = L_3 \sin(\pi - \theta_1 - \theta_3)
$$

则

$$
r = r_1 + r_2 = L_2\sin\theta_2 +L_3 \sin(\pi - \theta_1 - (\theta_3 + \alpha + \beta))
$$

同理我们可以求解 $ h $

$$
h_1 = L_2 \cos\theta_2 \\
h_2 = L_3 \cos(\pi - \theta_2 - (\theta_3 + \alpha + \beta))
$$

根据几何关系有

$$
h = L_1 + h_1 - h_2 \\
= L_1 + L_2 \cos\theta_2 - L_3 \cos(\pi - \theta_2 - (\theta_3 + \alpha + \beta))
$$

于是我们有

$$
P(L_2\sin\theta_2 +L_3 \sin(\pi - \theta_2 - (\theta_3 + \frac{\pi}{2} - \theta_2)),\quad \theta_1 ,\quad L_1 + L_2 \cos\theta_2 - L_3 \cos(\pi - \theta_2 - (\theta_3 + \frac{\pi}{2} - \theta_2)))
$$

这就是最终的运动学正解

## 运动学逆解

固定$\theta_1$，在 $r-h$ 平面内作辅助线 $L^{\prime}$ 连接 $J_2$ 和 $ P $

首先解出 $\theta_3$

根据勾股定理

$$
\left(L^{\prime}\right)^2 = r^2 + (h - L_1)^2
$$

根据余弦定理

$$
cos(\pi - \theta_3) = \frac{\left(L_2\right)^2 + \left(L_3\right)^2 - \left(L^{\prime}\right)^2}{2 L_2 L_3}
$$

根据诱导公式

$$
cos(\pi - \theta_3) = -cos(\theta_3)
$$

则

$$
\theta_3 = \arccos \left(\frac{\left(L^{\prime}\right)^2 - \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L_3}\right)
$$

同样的我们可以解出 $\theta_2$

$r$ 和 $L^{\prime}$ 的夹角

$$
\alpha = \arctan2(h - L_1, \quad r)
$$

$L^{\prime}$ 和 $L_1$ 的夹角，根据余弦定理

$$
\beta = \arccos \left(\frac{\left(L^{\prime}\right)^2 + \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L^{\prime}}\right)
$$

则

$$
\theta_2 = \frac{\pi}{2} - (\alpha + \beta) \\
 = \frac{\pi}{2} - \left(\arctan2(h - L_1, \quad r) + \arccos \left(\frac{\left(L^{\prime}\right)^2 + \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L^{\prime}}\right)\right)
$$

fix: 实际上小臂使用连杆驱动，小臂关于水平面的夹角在大臂运动时不变，因此 $\theta_3$ 应该是关于水平面的夹角，还需要再减去 $ \alpha + \beta $：

$$
\theta_3 = \arccos \left(\frac{\left(L^{\prime}\right)^2 - \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L_3}\right) - \left(\alpha + \beta\right) \\
= \arccos \left(\frac{\left(L^{\prime}\right)^2 - \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L_3}\right) -\left(\arctan2(h - L_1, \quad r) +\arccos \left(\frac{\left(L^{\prime}\right)^2 + \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L^{\prime}}\right)\right)
$$

柱面坐标下

$$
\theta_1 = \theta
$$

使用矩阵表示为：

$$
\begin{bmatrix}
\theta_1 \\
\theta_2 \\
\theta_3 \\
\end{bmatrix}
= 
\begin{bmatrix}
\theta \\
\frac{\pi}{2} - \left(\arctan2(h - L_1, \quad r) + \arccos \left(\frac{\left(L^{\prime}\right)^2 - \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L_3}\right)\right) \\
\arccos \left(\frac{\left(L^{\prime}\right)^2 - \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L_3}\right) -\left(\arctan2(h - L_1, \quad r) +\arccos \left(\frac{\left(L^{\prime}\right)^2 + \left(L_2\right)^2 - \left(L_3\right)^2}{2 L_2 L^{\prime}}\right)\right) \\
\end{bmatrix}
$$

这就是最终的运动学逆解
