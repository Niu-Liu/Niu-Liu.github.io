---
layout: post-lemonchann
title:  "pSolve常见错误分析及解决方案"
date: 2022-01-31
permalink: /blogs/commen_error_in_psolve.html
tags:
  - vlbi
comments: true
author: Neo
---

在使用`pSolve`处理和分析天测/测地VLBI数据的过程中，我们遇到了很多问题。
在这里，我试图总结一下我们经常遇到的问题，并提供可能的解决方案。

<!-- more -->


## 1. 数据转换（vgsoDb->vgosDa->GVF）

### 1.1 IUER=4441 GVH_READ_AGV

这个错误发生在使用`gvf_import.py`导入vda文件时。详细错误信息例如：
```
gvf_import.py: Failure to transform vda data file /l2/vda/2022/20220203_a.vda.gz to gvf format
gvf_import.py: Failed command: gvf_transform -to_binary /dev/shm/20220203_a.vda @a OBS
$$$ IUER=4441 GVH_READ_AGV  "Error in parsing of the 11582-th line of VDA
database file /dev/shm/20220203_a.vda -- the number of TEXT records exceeded
the limit 8192" $$$
$$$ IUER=1823 GVF_TRANSFORM  "Error in an atttempt to read input database file
/dev/shm/20220203_a.vda" $$$
```

这是nuSolve软件以前的一个漏洞：nuSolve将vgosDa格式向vgosDb格式转换过程中的所有警告信息都写入了数据（vda）文件中。这些警告信号有时候有好几百行之多，因此超过了TEXT记录容量的上限。现在该错误已被修复。
**对于这样的数据，需要手动删除vda文件中多余的行。**


## 2 数据读取

### 2.1 部分Lcode缺失

在读取apsg6（99NOV04XA）数据时，遇到了下列的报错
```
...
  J1=          98  LCODE=UTC_MTAI
  J1=          99  LCODE=UTC_OBS
$$$ IUER=4112 GVH_LCODE_TAB_INQ  "Lcode UV_CHN1  was not found in cache table" $$$
$$$ IUER=4275 GVH_GLCODE  "Error in an attempt to find lcode UV_CHN1 in cache table" $$$
$$$ IUER=8865 GETDB_FILL_OBORG  "Error in getting lcode UV_CHN1" $$$
$$$ IUER=8825 GETDB_DO  "Error in an attempt to fill OBORG with values from database files" $$$
```

这也是nuSolve软件以前的一个漏洞。Sergei Bolotin表示会在未来修复这个问题。


### 2.2 测试站先验坐标和位置缺失

在读取r1761（16OCT11XA）数据时，遇到了下列的报错
```
Loading database 20161011_a ver 1 VTD: /opt64/share/psolve/solve_lite.vtd
$$$ IUER=2156 VTD_LOAD_STACOO
"Station NYALDBBC was not found in the station coordinate catalogue file /apr/sta/glo.sit" $$$
I_FMT=3
$$$ IUER=2157 VTD_LOAD_STACOO
"1 stations were not found in station coodinate catalogue file /apr/sta/glo.sit" $$$
$$$ IUER=2140 VTD_LOAD
"Error in an attempt to load station coordinates from the input file /apr/sta/glo.sit"
$$$
$$$ IUER=9041 COMP THEO
"Error in an attempt to load files with auxiliary information need for computation of theoretical path delay" $$$
$$$ IUER=8826 GETDB_DO| "Error in an attempt to computed theoretical path delay using VTD with configuration file /opt64/share/psolve/solve_lite.vtd" $$$
RUN_PROG: process /opt64/psolve/bin/GETDB 0 46 0 0 AU abnormally terminated with status code 1
```

NYALDBBC是一个测试站名，并非物理上独立的观测站，因此在测站坐标和测站速度的先验文件中找不到这个测试站。
类似的测试站还有：
- NOTOX   
- WIDE85_3 
- VLBA85_3 
- MOJAVLBA 
- LEFT85_1 
- TEST-001 
- TEST-002 
- YEBESDBC 
- YEBDBBC  
- YEBEDBBC 
- ONSALAAN 
- ONSAFLEX 
- ONSAVDIF 
- OHIGGADS 
- WETTDBBC 
- WETTVDIF 
- NOTDBBC  
- NOTOVDIF 
- HOBADBBC
- ...

如何解决这个问题？首先在先验文件中（即/apr/sta/glo.sit和/apr/sta/glo.vel），复制相关测站（如NYALES20）的数据到新的一行，将测站名称改为测试站名，再重新加载数据。
需要注意的是，**在数据分析中，要把测试站去掉。**

## 3. 数据解算

### 3.1 Conditional number过大

这是个非常常见的错误。如在分析r1763（16OCT24XA）数据时，遇到了下列报错信息：
```
$$$ IUER=1227 INVS
"Matrix is almost singular: Condition number = 1.8824D+11 what exceeds the specified limit: 1.0000D+11" $$$
$$$ IUER=8103 B3D_SOL_X| "Error during inversion matrix of global-global parameters. Conditional number = 1.8824D+11" $$$
$$$ IUER=6502 NORML_B3D
"Failure in solving system of normal equations by B3D algorithm"
＄＄$
$$$ IUER=8455 NORML MAIN
"Failure during solving normal system using B3D algorithm while database 20161024_а <1> was processing" $$$
NORML: abnormal termination
GLOBL Ver. 2001.05.02 RUN_PROG: process /opt64/psolve/bin/NORML 0 34 0 0 AU abnormally terminated with status code 1
RUN_PROG: process /opt64/psolve/bin/GLOBL 0 42 0 0 AU abnormally terminated with status code 1
```

造成出现这一错误的主要原因是参数设置不合理，待估参数之间存在强相关性。
为了找到问题所在，可以通过运行
```
setenv COND_MAX 1D12
```
来增大conditional number的阈值，使得解算可以运行，然后再根据解算结果来分析问题来源。
可能的问题来源有：
- 某个台站的钟跳设置过多 
- 某两个测站距离很近。此时，需要移除这两个测站组成的基线。
- ...


如有更多的问题，欢迎与我讨论。