---
layout: post-lemonchann
title:  "Ubuntu21.10上安装Calc/Solve"
date: 2022-02-06
permalink: /blogs/install_solve.html
tags:
  - software package
  - vlbi
comments: true
toc: true
author: Neo
---


本文介绍的是`Calc/Solve`的安装方法。操作系统为Ubuntu 21.10 (GNU/Linux 5.13.0-28-generic x86_64)，gcc和gfortran编译器版本为gcc version 11.2.0 (Ubuntu 11.2.0-7ubuntu2)，ifort 编译器版本为2021.5.0，Calc/Solve的发行版本为SOLVE_mk5_20200123。本文或许也适用于其他操作系统和软件版本。本文提及的代码可以在我的[Github仓库](https://github.com/Niu-Liu/calc-solve-install)里面找到。

<!-- more -->

`Calc/Solve`软件包是美国航天局NASA下的GSFC在20世纪80年代左右开发的一套VLBI数据分析和处理工具，历史悠久，维护得很一般，导致在安装时会出现各种各样的问题。近期我又重新在新发行的Ubuntu 21.10系统上测试了一下软件的安装，并在这里记录下全过程，供各位同行参考。在软件安装问题上，我曾与上海天文台肖威一起讨论过，我的安装方法也部分参考了他的笔记，在这里向肖威表示感谢。

## 前期准备

将软件包`SOLVE_mk5_20200123.tar`打包之后，`Calc/Solve`的安装说明在压缩包的help.zip中，对应的文件有三个，为：INSTALL、INSTALL.hpu和NSTALL.linux。由于我使用的是Linux系统，所以只需要参考INSTALL和INSTALL.linux。顺序是先依照INSTALL.linux安装一些必要的函数库和工具，之后再依照INSTALL中的说明安装Calc/Solve。

***需要注意的是，这些安装说明文档是早年写的，适用于以前的版本。现在编译`Calc/Solve`不需要严格遵照这些说明文档，例如，ATLAS库函数不是必须的，我的安装过程就没有这一步。***

### 安装库依赖

`Calc/Solve`软件包需要在支持32位的环境下编译安装，因此首先要添加添加32位库函数的支持：

```
sudo dpkg --add-architecture i386
sudo apt update
```

同时确保gfortran支持32位：

```
sudo apt-get install gfortran-multilib
```

其他需要的软件有

```
sudo apt install libpng-dev libpng-dev:i386  libjpeg-dev:i386

# Curses
sudo apt-get install libncurses5 libncurses5:i386 libncurses5-dev libncurses5-dev:i386

# X11
sudo apt-get install libx11-6 libx11-dev libx11-6:i386 libx11-dev:i386

# rpc
sudo apt install libntirpc-dev

# Mail client
sudo apt install mailutils
```

这里列举的可能并非所有需要的库依赖（如zlib，可能我之前已经安装过了），在出现报错时可以进行补充。

### 安装Intel Fortran编译器

现在的Intel Fortran Compilers 被包含在Intel® oneAPI HPC Toolkit，因此安装这个包即可，具体方法见[官网文档](https://www.intel.com/content/www/us/en/develop/documentation/installation-guide-for-intel-oneapi-toolkits-linux/top/installation/install-using-package-managers/apt.html)。我在这里提供一个脚本来自动安装：

```
# use wget to fetch the Intel repository public key
cd /tmp
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
# add to your apt sources keyring so that archives signed with this key will be trusted.
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB
# remove the public key
rm GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB

# Configure the APT client to use Intel's repository
sudo add-apt-repository "deb https://apt.repos.intel.com/oneapi all main"

sudo apt update

# Install the desired package
sudo apt install intel-basekit
sudo apt install intel-basekit-32bit
sudo apt install intel-hpckit
sudo apt install intel-hpckit-32bit
```

安装完成之后，需要在`.bashrc`或者`.cshrc`中添加一行：

```
export MK5_FC=/opt/intel/oneapi/compiler/2022.0.2/linux/bin/ia32/ifort
source /opt/intel/oneapi/setvars.sh ia32
```

值得一提的是，这一版本的icc号称与gcc兼容

```
# icc -v
icc version 2021.5.0 (gcc version 11.2.0 compatibility)
```

这对`Calc/Solve`的编译应该是好消息。

### 安装Netcdf

编译`Calc/Solve`需要Netcdf的32位库函数支持。由于Ubuntu 21.10仓库里的Netcdf库函数只有64位，因此需要编译安装。我选用的编译器为Intel编译器。这一安装教程可以在很多地方找到，如

- [CESM优化——Intel编译器编译安装NetCDF库（C+Fortran）](https://blog.csdn.net/weixin_41890971/article/details/86763859)

- [服务器安装netcdf说明](https://www.cnblogs.com/gabriel-sun/p/12128386.html)

- [Ubuntu 20.04下 netcdf库的安装 （ifort编译器）](https://blog.csdn.net/qq_39970131/article/details/116861365)

我在这里给出我自己的安装方案。我的安装目录为`/opt32`，代码包下载的目录为`/opt32/incoming`，
解压目录为`/opt32/dist`。下面列出的是需要编译安装的软件包以及对应版本：

- hdf-4.2.15
- hdf5-1.12.0
- netcdf-c-4.5.4
- netcdf-fortran-4.8.1

编译之前需要进行一些全局环境配置，在`.bashrc`或者`.cshrc`中添加下列语句即可

```
# Intel compiler
source /opt/intel/oneapi/setvars.sh ia32

export CC=icc
export CXX=icpc
export FC=ifort
export F90=ifort
export F77=ifort
```

#### HDF4函数库

```
PREFIX=/opt32

ver=4.2.15

cd $PREFIX/incoming
wget https://support.hdfgroup.org/ftp/HDF/releases/HDF${ver}/src/hdf-${ver}.tar.gz

# Unzip
cd $PREFIX/dist
tar -xf $PREFIX/incoming/hdf-${ver}.tar.gz
cd hdf-${ver}

if [ ! -d build ]; then
    mkdir build
fi
cd build

CFLAGS='-m32 -I/usr/include/tirpc' \
    CPPFLAGS='-m32 -I/usr/include/tirpc' \
    CXXFLAGS='-m32' FFLAGS='-m32' \
    LDFLAGS='-ltirpc -L/opt32/lib -L/usr/lib/i386-linux-gnu' \
    ../configure --prefix=/opt32 --disable-netcdf --enable-fortran

if (( $? ));
then
    echo "Configuration failed."
    exit
fi

make
if (( $? ));
then
    echo "Make failed."
    exit
fi

make install
if (( $? ));
then
    echo "Make install failed."
    exit
fi

make distclean
if (( $? ));
then
    echo "Make clean failed."
    exit
fi
```

#### HDF5函数库

```
PREFIX=/opt32

# cd $PREFIX/incoming
# Download the source code

# Unzip
cd $PREFIX/dist
tar -xzf $PREFIX/incoming/hdf5-1_12_0.tar.gz

cd ${PREFIX}/dist/hdf5-1.12.0
make distclean

if [ ! -d build ]; then
    mkdir build
fi
cd build


CFLAGS='-m32 -I/opt32/include' CPPFLAGS='-m32 -I/opt32/include' \
    FFLAGS='-m32' \
    LDFLAGS='-L/opt32/lib -L/usr/lib/i386-linux-gnu' \
    ../configure --prefix=/opt32  --enable-fortran --enable-hl

if (( $? ));
then
    echo "Configuration failed."
    exit
fi

make
if (( $? ));
then
    echo "Make failed."
    exit
fi

make install
if (( $? ));
then
    echo "Make install failed."
    exit
fi

make distclean
if (( $? ));
then
    echo "Make clean failed."
    exit
fi
```

#### NetCDF函数库

```
install_c(){
    echo "Install netcdf-C"
    cd netcdf-c-${CVER}
    make distclean

    if [ -d build ]; then
        rm -r build
    fi
    mkdir build && cd build

    CFLAGS="-m32" LDFLAGS='-L/opt32/lib -L/usr/lib/i386-linux-gnu' \
       CPPFLAGS='-m32 -I/opt32/include' \
       ../configure --prefix=/opt32  --with-hdf4=/opt32

    if (( $? ));
    then
        echo "NETCDF-C Configuration failed."
        exit
    fi

    make
    if (( $? ));
    then
        echo "NETCDF-C Make failed."
        exit
    fi

    make install
    if (( $? ));
    then
        echo "NETCDF-C Make install failed."
        exit
    fi

    make distclean
    if (( $? ));
    then
        echo "NETCDF-C Make clean failed."
        exit
    fi
}

install_f(){
    # Install Fortran part
    cd netcdf-fortran-${FVER}
    if [ -d build ]; then
        rm -r build
    fi
    mkdir build && cd build

    CFLAGS='-m32' CPPFLAGS='-m32 -I/opt32/include' \
        FCFLAGS='-m32' FFLAGS='-m32' \
        LDFLAGS='-L/opt32/lib -L/usr/lib/i386-linux-gnu' \
        ../configure --prefix=/opt32 \
        --disable-fortran-type-check


    if (( $? ));
    then
        echo "NETCDF-Fortran Configuration failed."
        exit
    fi

    make
    if (( $? ));
    then
        echo "NETCDF-Fortran Make failed."
        exit
    fi

    make install
    if (( $? ));
    then
        echo "NETCDF-Fortran Make install failed."
        exit
    fi

    make distclean
    if (( $? ));
    then
        echo "NETCDF-Fortran Make clean failed."
        exit
    fi
}

export LD_LIBRARY_PATH="/opt32/lib:/usr/lib/i386-linux-gnu:${LD_LIBRARY_PATH}"

PREFIX=/data/softwares
FVER=4.5.4
CVER=4.8.1

cd $PREFIX/incoming
wget https://downloads.unidata.ucar.edu/netcdf-c/${CVER}/src/netcdf-c-${CVER}.tar.gz
wget  https://downloads.unidata.ucar.edu/netcdf-fortran/${FVER}/netcdf-fortran-${FVER}.tar.gz

# Unzip
cd $PREFIX/dist
tar -xvzf $PREFIX/incoming/netcdf-fortran-${FVER}.tar.gz
tar -xvzf $PREFIX/incoming/netcdf-c-${CVER}.tar.gz


install_c
install_f
```

如果一切顺利的话，至此，前期准备工作已经完成。

## 开始编译

编译安装参照安装说明文档即可，在这里我只列举出一些需要注意的点。

### 设置编译器和路径

前面在安装NetCDF时，我将编译器全部设置为Intel编译器，在编译`Calc/Solve`时，需要将那些语句注释掉（也许icc也可以编译`Calc/Solve`?），并加入下面语句

```
export MK5_FC=/opt/intel/oneapi/compiler/2022.0.2/linux/bin/ia32/ifort
export PATH=".:$PATH"
```

关闭终端并重新打开、准备编译。

### 函数库的配置

对于一些没有安装在标准库路径下的库函数（如我的NetCDF），需要通过配置文件来告诉编译器去哪里找
需要的文件，这些配置文件均在${MK5_ROOT}/local路径下。我在安装时添加了两个配置文件，为`lib.lcl`和`inc.lcl`。`lib.lcl`的内容如下：

```
#!/bin/csh
# ************************************************************************
# *                                                                      *
# *   Local Customization for Solve libraries.                           *
# *                                                                      *
# *  ### 07-OCT-2003   lib.lcl     v1.0 (c)  L. Petrov  07-OCT-2003 ###  *
# *                                                                      *
# ************************************************************************

setenv SOLVE_LIB_X11 "/lib/i386-linux-gnu/libX11.so"

setenv SOLVE_LIB_BLAS "-L /opt/intel/oneapi/mkl/2022.0.2/lib/ia32/ -lmkl_intel -lmkl_sequential -lpthread -lmkl_core"

setenv SOLVE_LIB_CURSES "/lib/i386-linux-gnu/libcurses.so"

setenv SOLVE_LIB_NETCDF "-L /opt32/lib/ -lnetcdf -lnetcdff"
```

从文件模版的头部信息来看，这是Leonid在2003年写的。现在的安装包中已经找不到相应文件了。`inc.lcl`的内容如下：

```
setenv SOLVE_NETCDF_INCLUDE  "/opt32/include"
```

### `pgplot522`编译问题

在编译`pgplot522`可能会出现以下错误：

```
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

参考[网友的解答](https://stackoverflow.com/questions/4492799/undefined-reference-to-stack-chk-fail)，修改`${MK5_ROOT}/support/mk5_f95_intel_gcc.conf`文件，将第60行由

```
CFLAGC="-m32 -Wall -fPIC -O"
```

改为

```
CFLAGC="-m32 -Wall -fPIC -O -fno-stack-protector"
```

此后，编译过程就顺利结束了。

## 安装之后的配置

在编译安装完成之后，需要配置Solve，具体步骤可以参考[pSolve的文档](http://astrogeo.org/psolve/doc/solve_guide_01.html)。这个文档在`${MK5_ROOT}/help`路径下应该也可以找得到。

到这里，`Calc/Solve`的初步安装就结束了，但这并不意味软件就能顺利运行。后续我会继续更新一些我所发现的代码中存在的问题。
