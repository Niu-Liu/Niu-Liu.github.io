---
layout: post-lemonchann
title:  "Solve使用指南"
date: 2022-01-31
permalink: /blogs/note-for-solve.html
tags:
  - vlbi 
  - software package
comments: true
author: Neo
---

这里记录下有关Solve的一些用法，方便自己和他人查阅。

<!-- more -->

## 1. 相关概念介绍

在介绍solve的使用之前，需要先介绍一些概念，以便更好地理解相关的内容。

- `session`： VLBI的常规观测实验时长为24小时，一次将这24小时内的观测数据存入单个文件存储，这些数据一般称为`session`。有些同行将其翻译为`观测组`，我则习惯称其为单次观测实验。目前我还没有注意到比较权威的翻译。
- `VLBI solution`：VLBI解算分两种，交互解（`Interactive solution`）和综合解（`Batch solution`）。交互解每次只能处理单次实验的数据，主要目的是进行数据筛选、解时延模糊度、特殊的参数化和模型处理等。综合解将多次实验的数据综合在一起，利用相同的先验模型、分析手段和参数化处理来从这些数据中估计感兴趣的参数，以用于科学研究。综合解一般处理已经交互解处理过后的数据（V004以后的数据）。这里只记录与综合解有关的内容。
- `Local parameters`：也称`Arc parameters`，局部参数，指由单次VLBI实验的观测数据给出估计值的参数。典型的局部参数包括钟模型参数、大气梯度参数、EOP等。
- `Global parameter`：全局参数，估计值由多次VLBI实验的观测数据给出，一般包括射电源的位置、测站的位置和速度等。**需要注意的是，局部参数和全局参数是针对某次特定的VLBI解算而言的。对于不同科学用途的VLBI解算，同一种参数的分类可能不同。**

## 2. Enter指令的使用

Calc/Solve全局解的核心程序叫`batch`，`batch`程序一般由`enter`指令唤起。`Enter`指令可以从输入参数中获取solve用户名、控制文件名和其他参数并传递给`batch`，同时确保运行全局解算所需要的所有辅助文件都能正常工作。这也是我常用的一种方式。

Enter指令的用法为

```
enter <solve_initials> [<control_file>] [post_check] [evoke_method] [flag_for_test] [processor_index] [number_of_processors]
```

- `solve_initials`: 用户代号，由两个英文字母组成，记录在$SAVE_DIR/letok文件中。不同的用户都可以同时调用solve，使用用户代号可以区分不同用户解算过程中产生的中间结果以及最终解算结果。需要注意的是，一个用户同一时间只能进行一种solve解算。
- `control_file`：解算用的控制文件名。控制文件有特殊的格式，Leonid也给出了[说明](http://astrogeo.org/psolve/doc/solve_guide_03.html)。
- `post_check`：不为`0`时则表示要运行某种检查
- `evoke_method`：全局解的启动方式
  - `b`或`B`：对应于`solve`指令的`verboisty_level`="verbose"或"silent"。如果是运行被中断的全局解，终端会询问是否是继续被中断的解算，还是**从头**（第一个session处）开始重新运行全局解。
  - `a`或`A`：对应于`solve`指令的`verboisty_level`="verbose-autorestart"或"silent-autorestart"，自动继续被中断的解算而不用再交互一次。
  - `n`或`N`：对应于`solve`指令的`verboisty_level`="verbose-norestart"或"silent-norestart"，自动**从头**（第一个session处）开始运行解算
- `flag_for_test`：是否接受使用`solve`的测试版本，为`-1`时表示接受。
- `processor_index`：使用的CPU核代号。单次解（independent solution）中会用到，默认为1。
- `number_of_processors`：所有可以调用的CPU核代号。单次解（independent solution）中会用到，默认为1。

我通常使用的指令为

```
enter LN <control_file> 1 b -1
```

这是从Sebastien那里学来的，未来我打算改为

```
enter LN <control_file> 1 a -1
```

## 3. Solve指令的用法

进行全局解的另一指令叫`solve`，实际上`solve`指令是一个调用`enter`的C-shell脚本。
参考[Leonid的说明](http://astrogeo.org/psolve/doc/solve_guide_02.html)，`solve`指令的输入参数与`enter`类似，其用法为：

```
solve <solve_initials> [<control_file>] [verboisty_level] [processor_index] [number_of_processors]
```

- `verbosity_level`：
  - "verbose"：默认，输出与解算有关的信息
  - "silent"：不输出任何信息
  - "verbose-autorestart"：同"verbose"类似，但会自动继续被中断的解算而不用再交互一次
  - "silent-autorestart"：同"silent"类似，但会自动继续被中断的解算而不用再交互一次
  - "verbose-norestart"：同"verbose"类似，但会自动**从头**（第一个session处）开始运行解算
  - "silent-norestart"：同"silent"类似，但会自动**从头**（第一个session处）开始运行解算

交互解输入

```
solve <solve_initials> 
```

而综合解至少要输入

```
solve <solve_initials> <control_file>
```

## 4. 综合解的一些说明

综合解主要分为单次解（`Independent solution`）和全局解（`Global solution`）。单次解可以视为交互解的自动化模式，所有的待估参数都是局部参数。而全局解中待估参数分为全局参数和局部参数。

运行综合解时，可以通过`smon`程序检视运行情况，具体指令为

```
smon <solve_initials> <work_dir> [<interval_update>]
```

其中，`work_dir`为solve解算的缓存目录，用于存储中间结果，由环境变量`$WORK_DIR`给出。其原理是solve会将正在处理的实验名称记录到进程文件（progress file，即`$WORK_DIR/PRGFxx`，`xx`即
`solve_initials`）中，`smon`程序通过查询该文件来获取信息。因此，我们也可以手动检查进程文件来了解情况，如

```
tail $WORK_DIR/PRGFxx
```

综合解的解算结果存储在`$SOLVE_DIR/SPLFxx`中，可以通过`getpar`程序来获取，如

```
getpar <spool_file> [solve_label] [apr_nut]
```

最后的`apr_nut`表示章动序列是以dX/dY的形式给出，否则以${\rm d}\psi$和${\rm d}\epsilon$的形式给出。

## 5. 来自Leonid Petrov的建议

- `SAVE_RATE` 建议设为 100。
- 控制文件每一项参数配置都要写清楚。
