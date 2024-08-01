---
layout: post-lemonchann
title:  "为SGDASS添加新的用户"
date: 2022-03-04
permalink: /blogs/confuguration_for_sgdass_new_user.html
tags:
  - software package
  - vlbi
comments: true
author: Neo
---


当 SGDASS 由课题组内共用时，每当有新的成员加入课题组，就需要新建一个用户并进行相关配置。
这里介绍一下我所使用的方法，仅供参考。 

<!-- more -->

## 在服务器上新建用户

我的服务器操作系统为Ubuntu24.04。为了便于文件权限的管理，我建立了一个名为`vlbi`的用户组，并将所有与SGDASS相关的文件夹和文件的读写权限赋予该用户组成员。
因此，新建的用户也应该被包含在 vlbi 用户组中。

假设需要建立一个名为somebody的新用户，运行
```
username=somebody
sudo useradd -m -s /usr/bin/bash ${username}
sudo usermod -a -G vlbi ${username}
```
之后，运行
```
pass ${username}
```
来为新用户设置密码。


## 为新用户配置运行环境

SGDASS在tcsh下运行，因此，需要在`~/.tcshrc`文件（如果没有请新建该文件）中加入与SGDASS相关的语句。
我的配置文件如下所示：
```
# /etc/csh.cshrc: system-wide .cshrc file for csh(1) and tcsh(1)

if ($?tcsh && $?prompt) then

	bindkey "\e[1~" beginning-of-line # Home
	bindkey "\e[7~" beginning-of-line # Home rxvt
	bindkey "\e[2~" overwrite-mode    # Ins
	bindkey "\e[3~" delete-char       # Delete
	bindkey "\e[4~" end-of-line       # End
	bindkey "\e[8~" end-of-line       # End rxvt

	set autoexpand
	set autolist
    set prompt = "%U%m%u:%B%~%b%# "
endif

set dir=/etc/csh/cshrc.d
if (-e $dir && `/bin/ls $dir` != "") then
  foreach FILE (`/bin/ls $dir/*`)
    source $FILE;
  end;
endif

set cr = "%{\e[31m%}" 
set cg = "%{\e[32m%}" 
set c0 = "%{\e[0m%}"  

# Set some variables for interactive shells
if ( $?prompt ) then
    if ( "$uid" == "0" ) then
        set prompt = "%B%U%n%u@%m.$cr%l$c0%b %c2 %B%%%b " 
    else
        set prompt = "%B%U%n%u@%m.$cg%l$c0%b %c2 %B%%%b "
    endif
endif

# For SGDASS
# gfortran compiler 
# Note: These lines are stored in ~/.login as suggested by Leonid, while his
# method does not work for me. Therefore, I put them in .tcshrc.
limit coredumpsize 0
limit stacksize 8000000
limit maxproc 16384
limit descriptors 2048
setenv GOMP_STACKSIZE 2000000
setenv LD_LIBRARY_PATH /opt64/lib:/opt64/lib64:/usr/lib:/usr/lib64
setenv PATH "/opt64/bin:/opt64/psolve/bin:${PATH}"
# pSolve
setenv PSOLVE_SAVE_DIR "/opt64/share/psolve"
# VTD
setenv VTD_CONF_SES /opt64/share/psolve/solve_lite.vtd
# PIMA
setenv PIMA_NUM_THREADS 8
# pgplot configuration
setenv PGPLOT_DEV "/xw"                      # tells that default is to print
                                              # the graphics to the screen
setenv PGPLOT_XW_MARGIN "1.0"                 # sets display margins
setenv PGPLOT_XSIZE_MM 400.0                  # specifies with width of the PGPLOT window

xrdb -merge ~/.Xdefaults
# setenv DIAGI_SCREEN "vast" # For big screen
setenv DIAGI_SCREEN "small"  # For laptop screen
```
从上面内容中很容易就可以找到与SGDASS相关的配置语句及其用途。

此外，还需要在`~/.Xdefaults`文件（如果没有请新建该文件）中加入
```
pgxwin.Win.iconize:     True
pgxwin.Win.geometry:	1080x750+0+50
pgxwin.server.visible:	True
pgxwin.Win.maxColors:   230
```

至此，新用户应该就可以顺利运行SGDASS中的软件了。