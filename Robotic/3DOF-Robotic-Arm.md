# 3 自由度 RRR 构型机械臂

## 机械

RRR 构型 3 自由度机械臂

自主建模设计

使用 PETG 3D打印制造，关节处使用一颗法兰轴承和一个轴肩螺栓固定

串联了一组平行连杆保证末端平台水平

减速器使用 1:20 摆线减速器，结构件 3D 打印制造

## 电控

电机采用三个 42 步进电机控制

使用张大头步进电机闭环控制器进行 FOC 控制

结合减速器实现了位置模式与速度模式的电机控制

通过数学建模与解析求解实现了机械臂末端位置的运动学正逆解

解析解文章：[RRR 构型关节式三自由度机械臂的运动学解算 - Blog](https://www.caoxin.xyz/index.php/archives/50/)

控制平台使用 Arduino. + ESP32

实现了一套基于面向对象封装机制的机器人开发框架， Github Repo:[LanternCX/3DOF-Robotic-Arm-Control](https://github.com/LanternCX/3DOF-Robotic-Arm-Control)

## 语音控制

基于 AI 小智后端进行的二次开发，小智原项目地址：[xinnan-tech/xiaozhi-esp32-server](https://github.com/xinnan-tech/xiaozhi-esp32-server)

二次开发的小智项目地址：[LanternCX/3DOF-Robotic-Arm-xiaozhi-server: 3DOF-Robotic-Arm-xiaozhi-server](https://github.com/LanternCX/3DOF-Robotic-Arm-xiaozhi-server)

小智是一个语音控制开发框架，通过对接大模型（这里使用 [Deepseek 开放平台](https://platform.deepseek.com/)）的[对话补全 | DeepSeek API Docs](https://api-docs.deepseek.com/zh-cn/api/create-chat-completion)与 [Function Calling | DeepSeek API Docs](https://api-docs.deepseek.com/zh-cn/guides/function_calling)

语音识别使用了 Sense Voice Small 部署在本地将语音信息转换为文字

文字转换语音使用了 Edge 语音生成

## 视觉

基于 OpenCV 和 YoloV8 进行基础视觉处理与模型训练

YoloV8 实现了目标检测与缺陷检测等等

OpenCV 实现了多类型目标指定与识别

## 上位机

上位机负责主要的逻辑控制与功能实现，运行在本地部署的一台边缘计算服务器终端

上位机实现了视觉识别，运动学正逆解，电机逻辑控制，任务状态机维护，通过 Websocket 协议与小智后端交互，通过串口命令控制 ESP32 下位机通信与控制

