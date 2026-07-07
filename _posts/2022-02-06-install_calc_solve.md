---

layout: post-lemonchann
title: "Ubuntu 21.10 上安装 Calc/Solve"
date: 2022-02-06
permalink: /blogs/install_solve.html
tags:
  - software
  - VLBI
  - Calc/Solve
comments: false
toc: true
author: Niu Liu

---

本文介绍的是 `Calc/Solve` 的安装方法。我的测试环境如下：

- 操作系统：Ubuntu 21.10，GNU/Linux 5.13.0-28-generic x86_64；
- `gcc` 和 `gfortran`：gcc version 11.2.0，Ubuntu 11.2.0-7ubuntu2；
- Intel Fortran 编译器：`ifort` 2021.5.0；
- `Calc/Solve` 发行版本：`SOLVE_mk5_20200123`。

本文或许也适用于其他操作系统和软件版本，但并不保证所有命令都能直接复用。本文提及的代码可以在我的 [GitHub 仓库](https://github.com/Niu-Liu/calc-solve-install) 中找到。

> 注：本文记录的是我在 Ubuntu 21.10、Intel oneAPI 2022 和 `SOLVE_mk5_20200123` 环境下安装 `Calc/Solve` 的过程。Ubuntu 21.10 已停止支持，因此本文更适合作为旧环境下的复现实验记录，而不是当前系统上的通用安装教程。如果在 Ubuntu 22.04、Ubuntu 24.04 或更新版本上安装 `Calc/Solve`，建议参考本文中的思路，而不是逐条照搬命令。

<!-- more -->

`Calc/Solve` 软件包是美国国家航空航天局 NASA 下属的 Goddard Space Flight Center 在 20 世纪 80 年代左右开发的一套 VLBI 数据分析和处理工具。它历史悠久，但维护得比较有限，因此在较新的 Linux 系统上安装时可能会出现各种问题。

近期我又重新在 Ubuntu 21.10 系统上测试了一下软件安装过程，并在这里记录下全过程，供同行参考。在软件安装问题上，我曾与上海天文台肖威讨论过，我的安装方法也部分参考了他的笔记，在这里向肖威表示感谢。

## 1. 前期准备

将软件包 `SOLVE_mk5_20200123.tar` 解压。`Calc/Solve` 的安装说明在压缩包的 `help.zip` 中，对应的文件主要有三个：

- `INSTALL`；
- `INSTALL.hpu`；
- `INSTALL.linux`。

由于我使用的是 Linux 系统，所以主要参考 `INSTALL` 和 `INSTALL.linux`。大致顺序是：先依照 `INSTALL.linux` 安装一些必要的函数库和工具，之后再依照 `INSTALL` 中的说明安装 `Calc/Solve`。

<strong>需要注意的是</strong>：这些安装说明文档是早年写的，适用于以前的版本。现在编译 `Calc/Solve` 不一定需要严格遵照这些说明文档。例如，ATLAS 库函数并不是必须的，我的安装过程就没有这一步。

### 1.1 安装库依赖

`Calc/Solve` 软件包需要在支持 32 位的环境下编译安装，因此首先要添加 32 位库函数支持：

```bash
sudo dpkg --add-architecture i386
sudo apt update
```

同时确保 `gfortran` 支持 32 位：

```bash
sudo apt-get install gfortran-multilib
```

其他需要的软件和库函数包括：

```bash
sudo apt install libpng-dev libpng-dev:i386 libjpeg-dev:i386

# Curses
sudo apt-get install libncurses5 libncurses5:i386 libncurses5-dev libncurses5-dev:i386

# X11
sudo apt-get install libx11-6 libx11-dev libx11-6:i386 libx11-dev:i386

# RPC
sudo apt install libntirpc-dev

# Mail client
sudo apt install mailutils
```

这里列举的可能并非所有需要的库依赖。例如 `zlib` 等库函数，我的系统中可能之前已经安装过了。如果在后续编译过程中出现报错，可以根据报错信息继续补充对应依赖。

### 1.2 安装 Intel Fortran 编译器

现在的 Intel Fortran 编译器被包含在 Intel oneAPI HPC Toolkit 中，因此安装这个工具包即可。具体方法可以参考 Intel 官方文档。

我当时使用的是 Intel oneAPI 2022，对应的安装方式如下：

```bash
# Use wget to fetch the Intel repository public key
cd /tmp
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB

# Add the public key
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB

# Remove the downloaded public key
rm GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB

# Configure the APT client to use Intel's repository
sudo add-apt-repository "deb https://apt.repos.intel.com/oneapi all main"

sudo apt update

# Install the desired packages
sudo apt install intel-basekit
sudo apt install intel-basekit-32bit
sudo apt install intel-hpckit
sudo apt install intel-hpckit-32bit
```

需要说明的是，`apt-key` 是当时常见的写法，但在较新的 Ubuntu 系统中已经不再推荐。如果使用较新的系统或较新的 oneAPI 版本，请优先参考 Intel 官方文档中的最新安装方式。

安装完成之后，需要在 `.bashrc` 或 `.cshrc` 中添加相应设置。以 bash 为例，可以加入：

```bash
export MK5_FC=/opt/intel/oneapi/compiler/2022.0.2/linux/bin/ia32/ifort
source /opt/intel/oneapi/setvars.sh ia32
```

值得一提的是，这一版本的 `icc` 号称与 `gcc` 兼容：

```bash
icc -v
```

输出示例为：

```text
icc version 2021.5.0 (gcc version 11.2.0 compatibility)
```

这对 `Calc/Solve` 的编译应该是一个好消息。

### 1.3 安装 NetCDF

编译 `Calc/Solve` 需要 NetCDF 的 32 位库函数支持。由于 Ubuntu 21.10 仓库里的 NetCDF 库函数只有 64 位，因此需要自行编译安装。

我选用的编译器为 Intel 编译器。类似的安装教程可以在很多地方找到，例如：

- [CESM 优化——Intel 编译器编译安装 NetCDF 库（C+Fortran）](https://blog.csdn.net/weixin_41890971/article/details/86763859)；
- [服务器安装 netcdf 说明](https://www.cnblogs.com/gabriel-sun/p/12128386.html)；
- [Ubuntu 20.04 下 netcdf 库的安装（ifort 编译器）](https://blog.csdn.net/qq_39970131/article/details/116861365)。

下面给出我自己的安装方案。我的安装目录为 `/opt32`，源码包下载目录为 `/opt32/incoming`，解压目录为 `/opt32/dist`。

需要编译安装的软件包及版本如下：

- `hdf-4.2.15`；
- `hdf5-1.12.0`；
- `netcdf-c-4.8.1`；
- `netcdf-fortran-4.5.4`。

编译之前需要进行一些全局环境配置。在 `.bashrc` 或 `.cshrc` 中添加下列语句即可。以 bash 为例：

```bash
# Intel compiler
source /opt/intel/oneapi/setvars.sh ia32

export CC=icc
export CXX=icpc
export FC=ifort
export F90=ifort
export F77=ifort
```

#### 1.3.1 HDF4 函数库

```bash
PREFIX=/opt32
ver=4.2.15

cd ${PREFIX}/incoming
wget https://support.hdfgroup.org/ftp/HDF/releases/HDF${ver}/src/hdf-${ver}.tar.gz

# Unzip
cd ${PREFIX}/dist
tar -xf ${PREFIX}/incoming/hdf-${ver}.tar.gz
cd hdf-${ver}

if [ ! -d build ]; then
    mkdir build
fi
cd build

CFLAGS='-m32 -I/usr/include/tirpc' \
    CPPFLAGS='-m32 -I/usr/include/tirpc' \
    CXXFLAGS='-m32' \
    FFLAGS='-m32' \
    LDFLAGS='-ltirpc -L/opt32/lib -L/usr/lib/i386-linux-gnu' \
    ../configure --prefix=/opt32 --disable-netcdf --enable-fortran

if (( $? )); then
    echo "Configuration failed."
    exit
fi

make
if (( $? )); then
    echo "Make failed."
    exit
fi

make install
if (( $? )); then
    echo "Make install failed."
    exit
fi

make distclean
if (( $? )); then
    echo "Make clean failed."
    exit
fi
```

#### 1.3.2 HDF5 函数库

```bash
PREFIX=/opt32

# Download the source code to ${PREFIX}/incoming first.

cd ${PREFIX}/dist
tar -xzf ${PREFIX}/incoming/hdf5-1_12_0.tar.gz

cd ${PREFIX}/dist/hdf5-1.12.0
make distclean

if [ ! -d build ]; then
    mkdir build
fi
cd build

CFLAGS='-m32 -I/opt32/include' \
    CPPFLAGS='-m32 -I/opt32/include' \
    FFLAGS='-m32' \
    LDFLAGS='-L/opt32/lib -L/usr/lib/i386-linux-gnu' \
    ../configure --prefix=/opt32 --enable-fortran --enable-hl

if (( $? )); then
    echo "Configuration failed."
    exit
fi

make
if (( $? )); then
    echo "Make failed."
    exit
fi

make install
if (( $? )); then
    echo "Make install failed."
    exit
fi

make distclean
if (( $? )); then
    echo "Make clean failed."
    exit
fi
```

#### 1.3.3 NetCDF 函数库

下面的脚本分别编译安装 NetCDF-C 和 NetCDF-Fortran：

```bash
install_c() {
    echo "Install netcdf-C"
    cd netcdf-c-${CVER}
    make distclean

    if [ -d build ]; then
        rm -r build
    fi

    mkdir build && cd build

    CFLAGS="-m32" \
        LDFLAGS='-L/opt32/lib -L/usr/lib/i386-linux-gnu' \
        CPPFLAGS='-m32 -I/opt32/include' \
        ../configure --prefix=/opt32 --with-hdf4=/opt32

    if (( $? )); then
        echo "NETCDF-C Configuration failed."
        exit
    fi

    make
    if (( $? )); then
        echo "NETCDF-C Make failed."
        exit
    fi

    make install
    if (( $? )); then
        echo "NETCDF-C Make install failed."
        exit
    fi

    make distclean
    if (( $? )); then
        echo "NETCDF-C Make clean failed."
        exit
    fi
}

install_f() {
    echo "Install netcdf-Fortran"
    cd netcdf-fortran-${FVER}

    if [ -d build ]; then
        rm -r build
    fi

    mkdir build && cd build

    CFLAGS='-m32' \
        CPPFLAGS='-m32 -I/opt32/include' \
        FCFLAGS='-m32' \
        FFLAGS='-m32' \
        LDFLAGS='-L/opt32/lib -L/usr/lib/i386-linux-gnu' \
        ../configure --prefix=/opt32 --disable-fortran-type-check

    if (( $? )); then
        echo "NETCDF-Fortran Configuration failed."
        exit
    fi

    make
    if (( $? )); then
        echo "NETCDF-Fortran Make failed."
        exit
    fi

    make install
    if (( $? )); then
        echo "NETCDF-Fortran Make install failed."
        exit
    fi

    make distclean
    if (( $? )); then
        echo "NETCDF-Fortran Make clean failed."
        exit
    fi
}

export LD_LIBRARY_PATH="/opt32/lib:/usr/lib/i386-linux-gnu:${LD_LIBRARY_PATH}"

PREFIX=/opt32
CVER=4.8.1
FVER=4.5.4

cd ${PREFIX}/incoming
wget https://downloads.unidata.ucar.edu/netcdf-c/${CVER}/src/netcdf-c-${CVER}.tar.gz
wget https://downloads.unidata.ucar.edu/netcdf-fortran/${FVER}/netcdf-fortran-${FVER}.tar.gz

# Unzip
cd ${PREFIX}/dist
tar -xvzf ${PREFIX}/incoming/netcdf-c-${CVER}.tar.gz
tar -xvzf ${PREFIX}/incoming/netcdf-fortran-${FVER}.tar.gz

install_c
install_f
```

如果一切顺利，至此，前期准备工作已经完成。

## 2. 开始编译

编译安装可以参照安装说明文档进行。这里我只列举一些需要特别注意的地方。

### 2.1 设置编译器和路径

前面在安装 NetCDF 时，我将编译器全部设置为 Intel 编译器。在编译 `Calc/Solve` 时，需要将那些全局编译器设置注释掉，并加入下面的设置：

```bash
export MK5_FC=/opt/intel/oneapi/compiler/2022.0.2/linux/bin/ia32/ifort
export PATH=".:${PATH}"
```

然后关闭终端并重新打开，准备编译。

### 2.2 函数库的配置

对于一些没有安装在标准库路径下的库函数，例如我安装在 `/opt32` 下的 NetCDF，需要通过配置文件告诉编译器到哪里寻找需要的库文件和头文件。这些配置文件均在 `${MK5_ROOT}/local` 路径下。

我在安装时添加了两个配置文件，分别为 `lib.lcl` 和 `inc.lcl`。

`lib.lcl` 的内容如下：

```csh
#!/bin/csh
# ************************************************************************
# -                                                                      *
# -   Local Customization for Solve libraries.                           *
# -                                                                      *
# -  ### 07-OCT-2003   lib.lcl     v1.0 (c)  L. Petrov  07-OCT-2003 ###  *
# -                                                                      *
# ************************************************************************

setenv SOLVE_LIB_X11 "/lib/i386-linux-gnu/libX11.so"

setenv SOLVE_LIB_BLAS "-L /opt/intel/oneapi/mkl/2022.0.2/lib/ia32/ -lmkl_intel -lmkl_sequential -lpthread -lmkl_core"

setenv SOLVE_LIB_CURSES "/lib/i386-linux-gnu/libcurses.so"

setenv SOLVE_LIB_NETCDF "-L /opt32/lib/ -lnetcdf -lnetcdff"
```

从文件模板的头部信息来看，这是 Leonid 在 2003 年写的。现在的安装包中已经找不到相应文件了。

`inc.lcl` 的内容如下：

```csh
setenv SOLVE_NETCDF_INCLUDE "/opt32/include"
```

### 2.3 `pgplot522` 编译问题

在编译 `pgplot522` 时，可能会出现以下错误：

```text
ld: libpgplot.a(grdate.o): in function `grdate':
grdate.c:(.text+0xfe): undefined reference to `__stack_chk_fail_local'
ld: libpgplot.a(grtermio.o): in function `groter':
grtermio.c:(.text+0xa4): undefined reference to `__stack_chk_fail_local'
ld: libpgplot.a(grtermio.o): in function `grpter':
grtermio.c:(.text+0x2b0): undefined reference to `__stack_chk_fail_local'
ld: libpgplot.a(xwdriv_plus.o): in function `xw_bound_cursor':
xwdriv_plus.c:(.text+0x456): undefined reference to `__stack_chk_fail_local'
ld: libpgplot.a(xwdriv_plus.o): in function `xw_locate_cursor':
xwdriv_plus.c:(.text+0xf09): undefined reference to `__stack_chk_fail_local'
```

参考[网友的解答](https://stackoverflow.com/questions/4492799/undefined-reference-to-stack-chk-fail)，可以修改 `${MK5_ROOT}/support/mk5_f95_intel_gcc.conf` 文件。

将第 60 行由：

```bash
CFLAGC="-m32 -Wall -fPIC -O"
```

改为：

```bash
CFLAGC="-m32 -Wall -fPIC -O -fno-stack-protector"
```

此后，编译过程就可以顺利结束。

## 3. 安装之后的配置

在编译安装完成之后，需要继续配置 Solve。具体步骤可以参考 [pSolve 的文档](http://astrogeo.org/psolve/doc/solve_guide_01.html)。这个文档在 `${MK5_ROOT}/help` 路径下应该也可以找到。

到这里，`Calc/Solve` 的初步安装就结束了。但这并不意味着软件就一定能顺利运行。后续我会继续更新一些我所发现的代码问题和运行问题。

由于本文依赖的系统和编译器版本都比较旧，如果在 Ubuntu 22.04、Ubuntu 24.04 或更新版本上安装 `Calc/Solve`，建议优先参考本文中的思路，而不是逐条照搬命令。
