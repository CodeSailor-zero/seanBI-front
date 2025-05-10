# seanBI

> 作者：[sean](https://github.com/CodeSailor-zero)

## 项目介绍
seanBI是一个在线数据分析和图表显示的网站，用户只需要上传原始数据和输入分析目标即可调用AI来与数据集相关的可视化图表
### 项目源码
- [前端源码](https://github.com/CodeSailor-zero/seanBI-front)
- [后端源码](https://github.com/CodeSailor-zero/seanBI-backend)

# 项目亮点

- **模块化设计**：清晰的分层结构，便于维护和扩展。
- **性能优化**：使用 Redis 进行登录态缓存
- **安全性**：集成 Spring Security 进行权限管理。
- **自动化**：使用代码生成器自动生成业务代码，提高开发效率。
- **消息队列**：使用MQ方法来生成图表，生成失败/网络不稳定，可以自动重新生成。

# 技术栈
## 前端技术栈
- vue 3.5.12：经典的前端框架
- vuex 4.1.0：状态管理库
- vue-router 4.5.0：路由实现
- vue-echarts 7.0.3：前端可视化库（vue版）
- openapi-typescript-codegen 0.29.0：根据后端的Knife4j来生成前端的请求代码
  - 这里的 `http://localhost:8099/api/v2/api-docs` 需要到自己的后端Knife4j获取
```shell
openapi --input http://localhost:8099/api/v2/api-docs --output ./generated --client axios
```
- vite：打包工具
## 后端技术栈

### 主流框架 & 特性

- Spring Boot 2.7.2
- Spring MVC
- MyBatis + MyBatis Plus 数据访问（开启分页）
- Spring Boot 调试工具和项目处理器
- Spring Scheduler 定时任务
- Spring AOP 切面编程

### 数据存储

- MySQL 数据库
- Redis 内存数据库
- 腾讯云 COS 对象存储

### 工具类

- Easy Excel 表格处理
- Hutool 工具库
- Apache Commons Lang3 工具类
- Lombok 注解

## 业务特性

- Spring Session Redis 分布式登录
- 全局请求响应拦截器（记录日志）
- 全局异常处理器
- 自定义错误码
- 封装通用响应类
- Swagger + Knife4j 接口文档
- 自定义权限注解 + 全局校验
- 全局跨域处理
- 长整数丢失精度解决
- 多环境配置

## 业务功能

- 用户登录、注册、注销、更新、权限管理、签到、积分兑换
- 利用AI 生成图表，
  - 同步生成，
  - 异步生成，线程池处理AI请求。
  - 异步生成。通过队列异步处理AI请求，当生成失败时，消息会重新入队，等待下次处理。

# 架构设计
## 项目架构图
![seanBI架构图](https://github-program-show.oss-cn-shanghai.aliyuncs.com/seanBI%E6%9E%B6%E6%9E%84%E5%9B%BE.png?Expires=1746936373&OSSAccessKeyId=TMP.3Kq2WriM7iSyJPpneKWLSWqKwNDur2K9AAtxNdVJwFZfYJVG7mnMcZvPd2C7SGWPHFibsYju3mYbk1rML3BTFd6u7LczcH&Signature=6f%2FCxAI5Fx7qch1yVEvE0H7aOQs%3D "Magic Gardens")
## RabbitMQ的架构图
![seanBIMQ架构图](https://github-program-show.oss-cn-shanghai.aliyuncs.com/SeanBIMQ%E6%9E%B6%E6%9E%84%E5%9B%BE.png?Expires=1746942251&OSSAccessKeyId=TMP.3Kq2WriM7iSyJPpneKWLSWqKwNDur2K9AAtxNdVJwFZfYJVG7mnMcZvPd2C7SGWPHFibsYju3mYbk1rML3BTFd6u7LczcH&Signature=EnGY6rLByw0p8W8zxcko5hjDiDQ%3D "Magic Gardens")
