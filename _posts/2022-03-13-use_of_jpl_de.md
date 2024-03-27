---
layout: post-lemonchann
title:  "JPL DE 历表的使用"
date: 2022-03-13
permalink: /blogs/use_of_jpl_de.html
tags:
  - software package
  - Ephemerides
comments: true
author: Neo
usemathjax: true
---

今天翻到了 2016 年写的关于 JPL DE 历表使用的笔记，就随手上传了。
里面记录的信息也许已经过时了。
后续我会进行测试并更新，以确保本文内容是准确的。

<!-- more -->

有关 DE 历表的信息(参考系、历表的历元区间等)在 README 中均能找到。这里主要讲实际使用。

下载到的 DE 历表数据一般为 ascii 文件，而现有的读取数据软件几乎都是用来处理二进制文件的，因此，使用DE历表之前要先将 ascii 文件转为二进制文件。如何测试转换得到的二进制文件的正确性？JPL提供了`testpo.XXX`（XXX 对应于历表的版本号）文件来验证，用来计算的程序名（JPL提供的）为`testeph.f`。其实处理DE历表数据的程序有很多，各种语言版本的都有，相关下载信息在`other-users.txt`文件里。我用的是使用 JPL 提供的数据转换程序和用于历表计算的 Caleph 程序（C语言版本）。这里仅介绍数据转换程序的用法。

对于用户而言，一般只需了解程序的功能以及可调参数即可。首先，数据格式转换的程序名为`asci2ehp.f`，基于F77语言编写，需要关注的参数有两处

- 关于记录数据长度的NREL参数。这和机器本身相关，程序里面提供了`NREL=1`和`NREL=4`两种选择，去掉对应语句前面的注释即可使用，一般选`NREL=4`。

- $$T_1$$、$$T_2$$。提取数据的区间，对应的时间尺度是 JD，依据自己的选择，选择默认值也可以，对应的应该是提取所有历元跨度的参数（反正对于现在的机器来说，储存空间不是问题）。

转换使用方法也有很多，这里提供 Linux 终端下的使用方法。假设编译源代码得到的可执行性程序为`asci2eph`，那么，输入

```
cat header. XXX ascXXX. XXX | ./asci2eph
```

它会先输出常数值，以及计算结果（日期），最后输出“OK”，生成 JPLEPH 文件即最终的数据文件。

接着，测试得到的数据，即与 JPL 计算的结果相比对。源代码为`testeph.f`。这个源代码很重要，里面写的一些子程序可以复制，用于历表计算。 主要有

- subroutine FSIZER1
subroutine FSIZER2
subroutine FSIZER3
具体选哪个与机器记录的数据长度有关。为了编译通过，需要给里面的一些变量赋值。比如`NREC=4`，`KSIZE`要依据历表的不同赋不同的值。源代码里面有说明。

- PLEPH （很重要）
用于历表计算，得到天体之间的相对位置（`target`和`center`）、章动、月球天平动。可以复制到自己的程序里面。`target`和`center`用整数代表天体，程序里面有说明，实际计算时可以自定义，但测试时不要改动。

- INTERP
由chebyshev系数计算得到位置和速度（PV）。

- SPLIT
把历元分为整数和小数部分，为的是不损失精度。

- STATE
输入输出的各种声明，如用户需要选择使用哪种`FSIZER`，一般选择`FSIZER3`。
这里需要注意的两类变量，在自己的代码使用这些子程序时根据需要设置，测试时不要改动。
  - 与单位相关
    - `KM=.TRUE`（km， km/s）
    - `KM=.FALSE` （AU和AU/d， 默认）
  - 参考点（参考系原点）
    - `BARY=.TRUE`（太阳系质心）
    - `BARY=.FALSE`（太阳）

- CONST
定义了一些常数。

实际使用时，以上提到的子程序最好一并复制过去。

`testeph.f`默认的输入数据文件名为`JPLEPH`，也可以设成自己想要的值，对应的文件名变量在`FSIZER`那三个程序中。

假设编译`testeph.f`得到`testeph`。测试用法如下：

```
cat testpo.XXX | ./testeph
```

没有输出warning和ERROR信息的话，说明转换的数据没有问题。

2016，6，6 夜
