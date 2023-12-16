---
layout: post-lemonchann
title:  "安装SGDASS可能遇到的问题及解决方案"
date: 2022-12-15
permalink: /blogs/sgdass_installation_notes.html
tags:
  - software package
  - vlbi
comments: true
toc: true
author: Neo
---

SGDASS全称为Space Geodesy Data Analysis Software System，
是Leonid Petrov开发的空间测地数据分析软件套装。
本文提到的问题都是在首次安装SGDASS和`pSolve`时遇到的，不适用于软件升级的情况。

<!-- more -->

SGDASS的官网地址为：[http://astrogeo.org/sgdass/](http://astrogeo.org/sgdass/)。
安装教程地址为[http://astrogeo.org/backup/sgdass_20211218_INSTALL.txt](http://astrogeo.org/backup/sgdass_20211218_INSTALL.txt)。
尽管Leonid已经写了非常详细的安装教程,
并写了自动化安装脚本`sgdass_install.py`，
其目的我想也是为了简化用户的安装过程，省去不必要的麻烦。
即使这样，我在安装的时候仍遇到了问题，现记录如下，以作为安装教程的补充。

## 支持系统

Leonid的安装教程中提到

> SGDASS supports Linux and MACOS.
>
> Disclaimer: MACOS installation was not recently checked and may be broken.

而在与Leonid的讨论中得知的实际情况是：
截止到目前（2022年1月29日），SGDASS并不支持MACOS。
但是，Leonid最近得到了一台苹果笔记本，因此，他会在未来的3到4周内测试SGDASS在MacOS上的安装。

## 编译器问题

SGDASS的安装教程提到安装SGDASS最好使用gcc-11.2.0版本（Leonid测试时用的版本）以及相应的gfortran和g++。
为此，我将服务器系统升级到了Ubuntu 21.10，
此时系统自带的gcc编译器(`/usr/bin/gcc`)就是11.2版本。
然而，如果使用系统自带的gcc和gfortran编译器，在编译`hdf5`时就会得到如下的报错

> f951: Fatal Error: Reading module ‘h5global.mod’ at line 1556 column 38: Unexpected EOF

这是由于编译器的库依赖不兼容导致的。
检查服务器自带的gcc版本，得到结果如下

> Using built-in specs.
>
> COLLECT_GCC=/usr/bin/gcc
>
> COLLECT_LTO_WRAPPER=/usr/lib/gcc/x86_64-linux-gnu/11/lto-wrapper
>
> OFFLOAD_TARGET_NAMES=nvptx-none:amdgcn-amdhsa
>
> OFFLOAD_TARGET_DEFAULT=1
>
> Target: x86_64-linux-gnu
>
> Configured with: ../src/configure -v --with-pkgversion='Ubuntu 11.2.0-7ubuntu2' --with-bugurl=file:///usr/share/doc/gcc-11/README.Bugs --enable-languages=c,ada,c++,go,brig,d,fortran,objc,obj-c++,m2 --prefix=/usr --with-gcc-major-version-only --program-suffix=-11 --program-prefix=x86_64-linux-gnu- --enable-shared --enable-linker-build-id --libexecdir=/usr/lib --without-included-gettext --enable-threads=posix --libdir=/usr/lib --enable-nls --enable-bootstrap --enable-clocale=gnu --enable-libstdcxx-debug --enable-libstdcxx-time=yes --with-default-libstdcxx-abi=new --enable-gnu-unique-object --disable-vtable-verify --enable-plugin --enable-default-pie --with-system-zlib --enable-libphobos-checking=release --with-target-system-zlib=auto --enable-objc-gc=auto --enable-multiarch --disable-werror --enable-cet --with-arch-32=i686 --with-abi=m64 --with-multilib-list=m32,m64,mx32 --enable-multilib --with-tune=generic --enable-offload-targets=nvptx-none=/build/gcc-11-ZPT0kp/gcc-11-11.2.0/debian/tmp-nvptx/usr,amdgcn-amdhsa=/build/gcc-11-ZPT0kp/gcc-11-11.2.0/debian/tmp-gcn/usr --without-cuda-driver --enable-checking=release --build=x86_64-linux-gnu --host=x86_64-linux-gnu --target=x86_64-linux-gnu --with-build-config=bootstrap-lto-lean --enable-link-serialization=2
>
> Thread model: posix
>
> Supported LTO compression algorithms: zlib zstd
>
> gcc version 11.2.0 (Ubuntu 11.2.0-7ubuntu2)

Leonid认为可能是`--with-arch-32=i686`的编译flag，
导致编译生成了32位架构的模块(`h5global.mod`?)，从而产生了错误。

解决方法是依照SGDASS安装说明中第V条的方法，在`/opt64/`目录下编译安装gcc-11.2.0，
并使用新编译的gcc和gfortran编译器来编译安装SGDASS。

## 编译`vex_parser`和`sur_sked`时的问题

在解决编译器的问题之后，`hdf5`编译非常顺利，但是在编译`vex_parser`时又遇到了报错
>
> make[1]: Entering directory '/data/sgdass/progs/vex_parser_20210707/src'
>
> I/opt64/include -I../include -c -o get_band_range.o get_band_range.f
>
> I/opt64/include -I../include -c -o matsub_nh.o matsub_nh.f
>
> I/opt64/include -I../include -c -o vex_ang_fmts.o vex_ang_fmts.f
>
> I/opt64/include -I../include -c -o vex_compar.o vex_compar.f
>
> I/opt64/include -I../include -c -o vex_flags.o vex_flags.f
>
> I/opt64/include -I../include -c -o vex_lists.o vex_lists.f
>
> I/opt64/include -I../include -c -o vex_parser.o vex_parser.f
>
> I/opt64/include -I../include -c -o vex_sou_idx.o vex_sou_idx.f
>
> I/opt64/include -I../include -c -o vex_sta_idx.o vex_sta_idx.f
>
> I/opt64/include -I../include -c -o sou_struc_fil_gen.o sou_struc_fil_gen.f
>
> I/opt64/include -I../include -c -o souivs_to_sourfc.o souivs_to_sourfc.f
>
> I/opt64/include -I../include -c -o sourfc_to_souivs.o sourfc_to_souivs.f
>
> I/opt64/include: Command not found.
>
> I/opt64/include: Command not found.
>
> I/opt64/include: Command not found.
>
> I/opt64/include: Command not found.
>
> make[1]: [makefile:14: vex_compar.o] Error 1 (ignored)
>
> I/opt64/include -I../include -c -o stp_compar.o stp_compar.f
>
> make[1]: [makefile:14: matsub_nh.o] Error 1 (ignored)
>
> make[1]: [makefile:14: vex_ang_fmts.o] Error 1 (ignored)
>
> I/opt64/include -I../include -c -o stp_dir_parser.o stp_dir_parser.f
>
> I/opt64/include: Command not found.
>
> make[1]: [makefile:14: get_band_range.o] Error 1 (ignored)
>
> I/opt64/include -I../include -c -o stp_fil_parser.o stp_fil_parser.f
>
> I/opt64/include: Command not found.
>
> I/opt64/include -I../include -c -o stp_obs_err.o stp_obs_err.f
>
> I/opt64/include: Command not found.
>
> make[1]: [makefile:14: vex_flags.o] Error 1 (ignored)
>
> I/opt64/include -I../include -c -o stp_sefd.o stp_sefd.f
>
> make[1]: [makefile:14: vex_lists.o] Error 1 (ignored)
>
> make[1]: [makefile:14: vex_parser.o] Error 1 (ignored)
>
> I/opt64/include -I../include -c -o stp_snr.o stp_snr.f
>
> I/opt64/include -I../include -c -o stp_sta_idx.o stp_sta_idx.f
>
> I/opt64/include: Command not found.
>
> I/opt64/include: Command not found.
>
编译`sur_sked`遇到的问题与此类似，二者均是因为环境变量的设置问题。
具体而言，编译这两个软件需要使用一些在`/opt64/bin/petools_vars`中定义的环境变量，
但是这些变量并没有在定义。

解决方法：在`.cshrc`中加入一行

```source /opt64/bin/petools_vars```

来实现这些变量的定义。
不过，`petools_vars`是在编译`petools`时从`petools`代码压缩包中解压并复制到`/opt64/bin/`
目录下的。
因此，为了保证编译顺利，有两种解决方法：

* 解压`petools`代码压缩包，手动复制`petools_vars`到`/opt64/bin/`目录下；
* 编译两次。

## `postinstall`之前的准备

在编译完成之后，需要进行一些额外的配置，来保证`pSolve`和`PIMA`的正常工作。
首先就是要将`/opt64/bin`加入在`PATH`路径变量中去。

查看安装配置文件的末尾，如`sgdass_config_astrogeo.cnf`，有

```
[PostInstall]:

psolve    psolve_reset AU 48000 48000

vtd       ${prefix}/bin/vtd_apriori_update.py -c /vlbi/vtd_data/apr.conf

pima      ${prefix}/bin/create_fftw_plan MEASURE 1           ${prefix}/share/pima/pima_wis_big.inp ${prefix}/share/pima/pima_wis_big_1thr.wis
pima      ${prefix}/bin/create_fftw_plan MEASURE 16          ${prefix}/share/pima/pima_wis_big.inp ${prefix}/share/pima/pima_wis_big_16thr.wis
pima      ${prefix}/bin/create_fftw_plan MEASURE ${num_proc} ${prefix}/share/pima/pima_wis_big.inp ${prefix}/share/pima/pima_wis_big_${num_proc}thr.wis

malo      ${prefix}/bin/malo_fftw_plan_create.csh
```

熟悉`Solve`的人可能知道，每次添加一名Solve的新用户（假设代号为XX），
首先需要在`letok`文件中加入一行

```
XX  Some_Note
```

，之后运行

```
solve_reset XX max_num_obs(具体数字) max_num_par(具体数字) 
```

来配置。
`solve_reset`的用法可以通过运行`solve_reset`来获知，此处不细说。

使用`pSolve`也需要执行同样的步骤。
对于`pSolve`，`letok`文件所在的目录为`/opt64/share/psolve/`。
在加入新用户之后，将SGDASS安装配置文件的用户代号（
如`sgdass_config_astrogeo.cnf`中的“AU”）替换为新用户的代号。
如果服务器上有多个用户，每个用户都需要执行一次`psolve_reset`。

## 结语

写到这里，整个安装过程近乎完成。
如果将来我遇到了新的安装问题，我将会在这里更新。
像`Calc/Solve`和`pSolve`这样非常小众的软件包，维护有限，用户手册也不多，
安装时遇到的问题很多且没有现成的解决方案，初学者常止步于安装这一步。
这一点我自己是深有体会的。
Leonid在方便用户安装他的软件包方面做了很好的示范，我在这里也分享我的一点经验，
希望可以帮到国内的同行。
