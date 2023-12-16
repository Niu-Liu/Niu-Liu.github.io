---
layout: post-lemonchann
title:  "GVF格式说明"
date: 2022-03-04
permalink: /blogs/gvh_and_gvf_format.html
tags:
  - software package
  - vlbi
comments: true
author: Neo
---

VLBI 数据分析软件 pSolve 支持的数据格式是 geo-VLBI 数据格式，简称为 GVF 格式，数据处理软件为 [GVH](http://astrogeo.org/gvh/)库函数。
GVH 库函数包括由 VLBI 相关机输出数据的相关后处理过程导出的群时延和相时延、条纹振幅、相位和相时延率，以及相关机输出中的关于 VLBI 观测的海量其他信息。
这些信息要保留到 VLBI 分析软件中，用于使用群时延和相时延来估计相关参数，例如射电源天球坐标、测站位置、地球定向参数等。
GVH 可以与 PIMA 和 VTD/post-Solve 软件交互使用。
GVF 格式可以与 VGOSDB 格式之间进行相互转换。
参照Leonid写的[说明文档](http://astrogeo.org/gvh/gvf.html)，我在这里记录下有关 GVF 格式的一些简单说明。

<!-- more -->

## 引言

依照Lenoid的说法，大地测量 VLBI 数据在分析过程中经历了数次转换，因此存在多种数据格式，列举如下：

- 首先，信号记录在磁带（光盘）上。数据采集终端以内部格式记录信号，对应的格式有Mark-5、Mark-4、Mark-3、K-3、K-4或S2格式。这些格式可以被称为“信号格式”(Signal format)。

- 相关机以其他格式写入输出。

- 条纹拟合程序（如 PIMA、AIPS 或 FOURFIT）可将记录添加到相关机输出中。这种格式可以被称为“后相关格式” (Post-correlator format)。

- 测地 VLBI 数据分析软件将相关后处理的输出转换为另一种格式，记为“观测格式”（Observations format）。

- 分析结果以不同的格式编写。让我们称它们为“结果格式”（Results formats）。

GVF格式是一种观测格式。
在Mark-3/Mark-4时代，VLBI数据分析软件使用所谓的MARK-3 DBH格式（或数据库格式）来保存VLBI实验的观测结果。
数据可以从MARK-3 DBH格式转换为NGS格式或SUP（或superfile）格式，前者可以经由Calc软件处理来计算理论时延值，后者用于综合解来进行参数估计。
不过，转换过程中会丢失大量信息（这是故意为之）。
MARK-3 DBH格式非常不好用，有诸多弊端，我在学习使用Calc/Solve软件时接触的也是这种格式，光是导入数据就花费了不少时间。
我曾经也写过类似的笔记来记录catlg指令。
好在从2018年开始，Calc/Solve可以支持VGOSDB格式数据，因此所有使用Calc/Solve的IVS分析中心都开始使用VGOSDB格式数据。
虽然当时也出现了诸多问题，不过对于初学者来说，VGOSDB格式数据要友好得多。
Leonid也列出了MARK-3 DBH格式的八宗罪。
针对MARK-3 DBH格式的这些毛病，Leonid为他的pSolve开发了新的GVF数据格式。
对于像我这样从Calc/Solve转向pSolve的用户，他建议我先从了解数据格式开始。
在初步了解之后，我感觉GVF数据格式与VGOSDB有不同类似之处。

## GVF格式规范

Leonid的优化思路为：提升读取效率和优化数据文件大小，两者所占的权重分别为70%和30%。
GVF格式主要用二进制来表示。
不过，尽管二进制数据格式提供了最高的效率，但对于非专业人士来说却有些晦涩难懂，因此，GVF格式也有相应的文本（ascii）版本。
文本GVF格式和二进制GVF格式之间可以相互转换。
这意味着用户可以二进制GVF文件转换为文本gvf文件，查看甚至编辑（但不建议这样做）文件，然后再将其转换回二进制格式。
GVF处理程序主要针对二进制版本进行优化。

GVF格式的数据库可以拆分为多个数据文件，称为扩展数据块（Extent），例如

```
------------    -----------    -----------    -----------    -----------
| Fringe-1 |    | Calib-1 |    | Theo-1  |    | Solve-1 |    | Docs-1  |
------------    -----------    -----------    -----------    -----------

------------    -----------    -----------    -----------
| Fringe-2 |    | Calib-2 |    | Theo-2  |    | Solve-2 |
------------    -----------    -----------    -----------
```

不同的文件包含不同类型的信息：

- Fringe由相关后处理软件（即FOURFIT）生成，包含root信息。此文件是必需的。

- Calib包含额外的校准信息，如系统温度，电缆校准，气象信息等。

- Theo包含Calc提供的信息：理论延迟，偏导数，中介分位数，如螺母角。

- Solve 包含解决方案提供的信息：解决方案设置、歧义、抑制标志等等。

- 文档包含任意文本信息。我建议把那里的详细描述保存在数据库中的项目。

每种类型的数据可以有多个扩展块。
可以将同一类型的扩展块拆分为“常用信息块”和“不常用信息块”，如将放入SUP文件中的信息视为“常用信息”。
处理GVF格式数据，首先是将与实验相关的文件列表传递给GVF处理程序。

这种划分方案的优点在于

- 不需要加载所有信息，从而节省大量资源；

- 用户可以获取指定的扩展数据块；

- 可以只更新部分扩展数据块；

- 用户提供的信息可以写在另一个扩展数据块，例如Calib-3，Calib-4，而不覆盖原始数据（当然，如果需要的话也可以覆盖其他扩展块中的数据）。

- 不同用户可以拥有自己的数据副本，而用户之间的操作不会影响彼此；

- 不同数据文件可以有不同的权限。例如，Fringe-1和Calib-1数据不可修改。

任一规范的 GVF 文件都有前导码、历史、`lcode`表和类似于 MARK-III DBH 的数据本身。
但是数据是在 MARK-III DBH 格式的观测基础排序的：首先是第`k`个观测值的所有`lcode`，然后是`k + 1`个观测值的所有`lcode`，依此类推。
数据按GVF格式的`lcode`排序：首先是`lcode=j`的所有观测值的数据，然后是`lcode=j+1`的所有观测值的数据，依此类推。
这样可以避免数据冗余。
数据通过这种方式进行结构化，只需很少的转换就可将文件映射到地址空间。

GVF文件采用以下命名方案：文件名由5个小写字母或数字字段组成，由下划线和点分隔，如
>
> europe55_b2_b03_cal1.gvf
>
> neos-a784_w1_g08_sol2.agvf

这些字段的含义依次为：

- 实验标识符，由 IVS 授予，用于编制观测纲要、相关处理和进一步分析。

- 相关中心代码（单字母） + 条纹版本（一位数）。前者表示对数据进行了条纹拟合的相关中心，例如，b 代表 GIUB，w 代表 USNO 等等。具有不同条纹版本的数据库被视为不同的实验。

- 分析中心代码（单字母） + 文件版本号（两位数）。前者表示创建此文件的分析中心，例如，g 代表 Goddard，i 代表 IRACNR 等等。

- 数据扩展块代码（四字母）。

- 文件扩展名，gvf 用于二进制文件，agvf 用于 ascii 文件。

所有数据被分为三类：

- a）实验类（session）

- b）扫描类（scan）

- c）测站类（station）

- d）基线类（baseline）

同一实验的X波段和S波段数据放在一起，同时支持 2 个以上的波段和多个记录模式（即偏振）。

数据处理程序与 VLBI 目录系统之间相互独立。
它获取输入文件，这些文件可以通过调用目录系统或通过其他方式（即由用户提供）获得。
数据处理程序首先读取内存中的所有数据，设置内部缓存表，然后处理各个查询。
数据处理程序包括

- 输入/输出段。它可以记录、打开、读取/写入和操作、关闭文件，同时管理内存。

- 查询段，提供用户查询界面。

- 兼容模式段，可以兼容 MARK-III DBH 数据格式。

对gvf文件的正常访问是通过 VLBI 目录系统完成的，它具有以下功能：

- 文件名控制。同一个实验可以有多个名字，如$99JUN14XH或EUROPE50，用户可以使用其中一个别名。目录系统维护此类别名，并防止使用重复的文件名。这个功能与Solve类似。

- 备份。维护磁带存档、与实验相关的文件的压缩存档、数据导入和导出等功能。

- 信息服务。目录系统读取数据库，提取有关实验配置的一些信息，将其保存在内部数据结构中，然后定期更新并提供查询。它支持简单的查询，如打印指定时间范围内的实验名称列表，以及更复杂的查询，如列举所有包含10个以上的基线NRAO20 / NRAO85~3的良好观测值的所有实验，并且能够提供类似于SUMRY程序（？）生成的统计数据。

## 二进制GVF格式的详细描述

一个二进制gvf文件由几个部分组成：

- a）前导码

- b） 文本部分

- c） 目录

- d） 按此顺序排列的二进制数据部分。

后三者可以省略。
每个部分的格式为

```
.--------.--------.------.--------.-------------.
| Length | Prefix | Body | Filler | Control sum |
.--------.--------.------.--------.-------------.
```

需要关注的是`Prefix`关键词，它表示这一部分数据的类型，可能的值为`PREA`、`TEXT`、`CONT`或`DATA`。

### PREA部分格式

包含必填记录和可选记录。
必填项如下：

```
File_format: Identifier of the format and its version.
Generator: Name of the program to have generated the file and its version.
Creation_UTC_date: Creation date.
Binary_format: Identifier of binary numbers format. It is assumed that normally IEEE standard will be used, but why not to reserve the capacity to use alternative format?
File_name: File name
File_version: Version number of the file. Versions are numbered starting with 1 up to 99.
Previous_filename_{ver}: File name of the version {ver}, where {ver} is a version number which is less than the current version number. If the current version number of greater than 2 then several Previous_filename_{ver}: records should present. For example, if the current version is 4 then records Previous_filename_03:, Previous_filename_02:, Previous_filename_01: should present.
Experiment_id: Experiment identifier in lower register letters.
Experiment_start_date: Start date in the format: YYYY.MM.DD , for example, 1999.08.06 The first observation which has been correlated considered as a start observation.
Experiment_start_doy: Day of year of the first observation of the experiment.
Experiment_start_UTC_time: Start time in the format HH:MM:SS.FFF, f.e. 08:00:52.028
Duration: duration of the experiment in seconds.
Correlation_center_code: One-symbol code of the correlation center.
Correlation_center_name: Full name of the correlation center.
Analysis_center_code: One-symbol code of the center where the file has been created.
Analysis_center_name: Full analysis center name.
analyst_name: Analyst name as it registered in the operating system.
Analyst_e-mail_address: E-mail address of the person who created a database and to whom to send questions as a last resort. The name is generated by operating system.
Hardware_name: Name and type of the computer used for creation of the file.
OS_name: Name and version number of the operating system.
```

### TEXT部分格式

由若干个字部分组成，每个字部分的结构如下：

```
Prefix: Sequence of 7 symbols: "Title: "
Title: Ascii text with any symbols, except CNTRL/J and CNTRL/Z (decimal codes 10 and 26).
Title delimiter: CNTRL/J (decimal codes 10).
Body: Any symbols, except CNTRL/Z (decimal 26).
Subsection terminator: CNTRL/Z (decimal 26)
```

不过我想这一信息应该不是特别重要。

### CONT部分格式

这一部分包含了数据部分的内容信息（类似于头文件），内容如下：

```
Lcode CHARACTER*8 Identifier of the item in the database.
OFFSET INTEGER*4 Offset in bytes of the first byte of the first occurrence of this lcode with respect to the beginning of DATA section.
DIM1 INTEGER*2 First dimension of the array of values for the lcode. Lcode is considered as a three-dimensional array.
DIM2 INTEGER*2 Second dimension of the array of values for the lcode. Lcode is considered as a three-dimensional array.
DIM3 INTEGER*2 Third dimension of the array of values for the lcode. Lcode is considered as a three-dimensional array.
Type Byte*1 Data type code. Supported data types: CHARACTER, BYTE*1, INTEGER*2, INTEGER*4, REAL*4, REAL*8.
Class Byte*1 Code of the data class. Supported data classes: Session, Scan, Station, Baseline.
Usage code Byte*1 Lcode usage code. Supported usage codes are: Primitive, Synonym, Derived. Usage code describes which additional actions are needed besides reading/writing.
```

可能会用到的是`Lcode`、`Class`和`Usage code`。
`Class`的值为：Session, Scan, Station, Baseline，分别对应的是四种数据名称。
`Usage code`表示了对这一数据的额外读写操作。

### DATA部分格式

DATA 部分由一组有序序列组成，结构如下

```
DATA-section:
                  ~~~~~~~~~~~~~
     Record k     | LCODE-k   |
                  ~~~~~~~~~~~~~

                  ~~~~~~~~~~~~~
     Record k+1   | LCODE-k+1 |
                  ~~~~~~~~~~~~~

                  ~~~~~~~~~~~~~
     Record k+2   | LCODE-k+2  |
                  ~~~~~~~~~~~~~
     ...
```

每个逻辑记录对应于一个`lcode`，并包含一个有序的帧（frame）序列。
每个帧都包含一个 `lcode` 值数组，该数组对应于一个观测值，如下所示

```
record-k:
         ~~~~~~~~~~~~~~~
         |  Frame j    |
         ~~~~~~~~~~~~~~~

         ~~~~~~~~~~~~~~~
         |  Frame j+1  |
         ~~~~~~~~~~~~~~~

         ~~~~~~~~~~~~~~~
         |  Frame j+2  |
         ~~~~~~~~~~~~~~~
     ...
```

记录数与 lcode 数相同，帧数取决于` lcode `的类。
Session类只有1帧，Scan类的帧数为扫描总数，Station类帧数为所有站参与的扫描次数的总和，Baseline类帧数为总观测量的数目。

### `Lcode`

所有 lcode 都分为三组：

- Primitives：不需要任何其他操作的基元;

- Synonyms：这意味着对 lcode A 数据的请求被重定向到对 lcode B 数据的请求。这样做主要是为了与旧的 lcode 命名方案兼容。例如，当前的 lcode 方案将 X 波段上群延迟的形式误差称为"DELSIGMA"，但将 S 波段群延迟的形式误差称为"DLERR XS"，这太晦涩难懂了。同义词 lcode 将允许向旧的 lcode 名称提供请求。

- Derived：这意味着要进行一些数据转换，例如类型转换。

未来Leonid将会添加一些新的 lcode：

- NUMSCA: 扫描次数；

- SCAN_ID: 与相关机输出格式的规范保持一致的扫描标识符；

- SCAN_IND: 有序扫描表中当前扫描的索引。

- STASCATB: 应该是Station Scan Table的简称，即参与扫描的测站指数的二维表。表中的列是参与实验的台站。表的行是扫描索引，值是扫描的参与索引。如果工作站没有参与扫描（或者确切地说，数据库没有关于它的信息），则为零。参与索引从1到K连续编号，例如，对于3个测站一共10次扫描，可以记为

```
     (测站#1 测站#2 测站#3)
          1    8    0
          2    9   15
          0   10   16
          0   11   17
          3   12   18
          4    0   19
          5    0   20
          6    0   21
          7   13   22
          0   14   23
```

这里，测站#1和测站#3参与了8号扫描，而测站#2则没有。
与测站#1和8号扫描相关的lcode信息包含在在索引为6的帧中;
与测站#3和8号扫描相关的lcode信息位于索引为 21 的帧中。

- BASSCATB：应该是Baseline Scan Table的简称，扫描参与指数的一维表。输入为数据库中观测量的索引，输出为扫描索引。对于5次扫描产生的13个观测量，有

```
          1
          1
          1
          2
          3
          3
          3
          3
          3
          3
       4
          5
          5
```

可以看出，扫描#1有三个观测量，应该是有三个测站同时参与了观测。
扫描#2只有一个观测量，说明有两个测站同时参与了观测。

### 文本GVF格式

文本GVF格式与二进制GVF格式在内容上应当是一样的，从下面的例子也可以较容易地推测出数据的含义。

```
$$"PREA"
 $"File_format:" gvf v 0.1  1999.08.08

...

$$"TEXT"
 $"HISTORY version 1 1999.08.04 08:34:35" Created by Dbedit HP-UX version 3.1
  Dbedit control file history entry: IRIS-S138, fort-gilc-hart-west-wett, -LP
  Directory /diskA5/is138/1513

...

$$"CONT"
 $"JUL DATE"    880256    1   1    1  R8 SCAN PRIM
 $"CALBYFRQ"   1280264    3   2   14  I2 STAN PRIM

...

$$"DATA"
 $"JUL DATE 0552+398 1999.05.03 22:12:33 (1,1,1)" .2451301500000000D+07

...

 $"CALBYFRQ HARTRAO  1999.05.03_22:12:33 (1,1,1)"    459
 $"CALBYFRQ HARTRAO  1999.05.03_22:12:33 (2,1,1)"  -1752
 $"CALBYFRQ HARTRAO  1999.05.03_22:12:33 (3,1,1)"     10

 $"GRDEL    GILCREEK/HARTRAO 1999.05.03_22:12:33 (1,1,1)" -.1162569743908074D-02
 $"GRDEL    GILCREEK/HARTRAO 1999.05.03_22:12:33 (2,1,1)" -.1162561782032324D-02

...
```

## 关于 VLBI 数据补充

最后，[参照 Lenoid 的说法](http://astrogeo.org/gvh/agvf.html)，我再补充一些有关 VLBI 数据的术语：

- experiment：独立编排的观测的对应数据集，一次实验的持续时间为从 30 分钟到 15 天不等，但一般不少于 1 小时或超过 24 小时。常规观测实验一般是持续 24 小时，UT1 加强观测试验持续 1 小时。在一个实验中，一般是 N 个站观测 M 个源。
- session：与 experiment 的概念相同，在描述 VLBI 的数据时我习惯用 session。
- scan：观测阵列或其部分基线在转向另一个颗目标源之前对当前目标源的持续观测。
- observation：在扫描期间一条基线收集到的数据，也可以称为时延（delay）。
