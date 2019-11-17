当前仓库 master 分支是前 5 章的源码，可以切换到**finish**分支查看项目完成之后的代码，这部分代码可能会跟课程后续章节完成代码有一定区别，在课程完成之后会更新全部代码到 master

注意`config.js`需要你自己从`config.sample.js`拷贝并且填写你自己的相关配置。

### 分支

- master：前 5 章
- first-5：前 5 章
- finish：项目完成

### redis

##### centos 安装

更新安装源来安装最新得包

```
sudo yum install epel-release
sudo yum update
```

安装 redis

```
sudo yum install redis
```

后台启动 redis

```
sudo systemctl start redis
```

设置开机启动 redis

```
sudo systemctl enable redis
```
