---
layout: post-lemonchann
title:  "安装nuSolve时的Qt5库函数问题"
date: 2022-02-11
permalink: /blogs/qt5_for_nuSolve.html
tags:
  - software package
  - vlbi
comments: true
author: Neo
---

昨天尝试在Ubuntu 21.10服务器上安装[nuSolve](https://sourceforge.net/projects/nusolve/),
结果遇到了与Qt5库函数的编译问题，在这里记录一下解决办法。
桌面版也许没有此类问题。

<!-- more -->

在网上搜索“在Ubuntu上安装Qt5”，得到的答案多数是

```
sudo apt install qt5-default
```

可惜的是，这对于Ubuntu 21.10来说属于是过期攻略了。
因此，在Ubuntu 21.10的仓库里面，Qt5库函数的名称改变了，新的名称以及对应的安装指令如下：

```
sudo apt install qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools 

sudo apt install libqt5script5 libqt5scripttools5 qtscript5-dev
```

不过，问题并没有就此结束。
在执行`configure`脚本配置`nuSolve`的编译环境时，脚本试图寻找`libQt5Script.so`文件，
但是在我的对应目录下却没有该文件。
因此，我建立了一个软链接，运行的指令如下：

```
cd /usr/lib/x86_64-linux-gnu

sudo ln -s libQt5Script.so.5.15.2 libQt5Script.so
```

最后，需要注意的是，如果你使用`conda`，在编译`nuSolve`时需要关闭`conda`环境，
否则，配置脚本会定位到`conda`目录下的Qt5函数库。
在我的测试中，使用`conda`的Qt5函数库时，编译无法顺利完成。
