## React-SSR-With-NextJs

#### 1、首先需要安装下载 redis 

• 官方版本是不支持 Windows 系统的，微软自己实现了支持 win64 位系统的版本

• [redis-windows](https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504)

• [Redis 服务端下载](https://github.com/ServiceStack/redis-windows/raw/master/downloads/redis-latest.zip)

• [Redis 客户端下载](https://redisdesktop.com/download)

• [Redis 官网](https://redis.io/)

• [Redis 中文网](http://www.redis.cn/documentation.html)

*** 

#### 2、找到 github 上的 [开发者设置] (https://github.com/settings/developers) ，在上面注册自己的 OAuth App

* 记录 Client ID 和 Client Secret 到 global.config.js 中

* Homepage URL：填写应用的域名端口（如：http://localhost:3000）

* Authorization callback URL：后台服务地址 + '/auth'（如：http://localhost:3000/auth）

![图片](https://github.com/yjdjiayou/react-ssr-with-nextjs-demo/blob/master/register-oauth.png)

*** 

#### 3、安装依赖
`npm install `

*** 

#### 4、启动调试项目
`npm run dev `

*** 

