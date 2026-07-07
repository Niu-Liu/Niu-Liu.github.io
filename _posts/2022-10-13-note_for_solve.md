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
usemathjax: true
---


这里记录下有关 Solve 的一些用法，方便自己和他人查阅。

<!-- more -->

## 1. 相关概念介绍

在介绍 Solve 的使用之前，需要先介绍一些概念，以便更好地理解相关内容。

- `session`：VLBI 的常规观测实验时长为 24 小时。通常会将这 24 小时内的观测数据存入单个文件，这些数据一般称为一个 `session`。有些同行将其翻译为“观测组”，我则习惯称其为“单次观测实验”。目前我还没有注意到比较权威的中文译法。

- `VLBI solution`：VLBI 解算可以分为两种，即交互解 `Interactive solution` 和综合解 `Batch solution`。交互解每次只能处理单次实验的数据，主要目的是进行数据筛选、解时延模糊度、特殊参数化和模型处理等。综合解则将多次实验的数据综合在一起，利用相同的先验模型、分析手段和参数化处理，从这些数据中估计感兴趣的参数，以用于科学研究。综合解一般处理已经经过交互解处理的数据，例如 V004 以后的数据。这里主要记录与综合解有关的内容。

- `Local parameters`：也称 `Arc parameters`，即局部参数，指由单次 VLBI 实验的观测数据给出估计值的参数。典型的局部参数包括钟模型参数、大气梯度参数和 EOP 等。

- `Global parameters`：即全局参数，估计值由多次 VLBI 实验的观测数据共同给出，一般包括射电源的位置、测站的位置和速度等。<strong>需要注意的是</strong>，局部参数和全局参数是针对某次特定的 VLBI 解算而言的。对于不同科学用途的 VLBI 解算，同一种参数的分类可能不同。

## 2. `enter` 指令的使用

Calc/Solve 全局解的核心程序叫 `batch`，而 `batch` 程序一般由 `enter` 指令唤起。

`enter` 指令可以从输入参数中获取 Solve 用户名、控制文件名和其他参数，并将这些信息传递给 `batch`。同时，它也会确保运行全局解算所需要的所有辅助文件都能正常工作。这也是我常用的一种方式。

`enter` 指令的用法为：

```bash
enter <solve_initials> [<control_file>] [post_check] [evoke_method] [flag_for_test] [processor_index] [number_of_processors]
```

各参数含义如下：

- `solve_initials`：用户代号，由两个英文字母组成，记录在 `$SAVE_DIR/letok` 文件中。不同用户可以同时调用 Solve。使用用户代号可以区分不同用户在解算过程中产生的中间结果以及最终解算结果。需要注意的是，一个用户同一时间只能进行一种 Solve 解算。

- `control_file`：解算用的控制文件名。控制文件有特殊格式，Leonid 也给出了[说明](http://astrogeo.org/psolve/doc/solve_guide_03.html)。

- `post_check`：如果不为 `0`，则表示要运行某种检查。

- `evoke_method`：全局解的启动方式。常用取值如下：

  - `b` 或 `B`：对应于 `solve` 指令的 `verbosity_level` 为 `verbose` 或 `silent`。如果运行的是被中断的全局解，终端会询问是继续被中断的解算，还是<strong>从头</strong>，即从第一个 `session` 处，开始重新运行全局解。

  - `a` 或 `A`：对应于 `solve` 指令的 `verbosity_level` 为 `verbose-autorestart` 或 `silent-autorestart`，表示自动继续被中断的解算，不需要再进行一次交互确认。

  - `n` 或 `N`：对应于 `solve` 指令的 `verbosity_level` 为 `verbose-norestart` 或 `silent-norestart`，表示自动<strong>从头</strong>，即从第一个 `session` 处，开始运行解算。

- `flag_for_test`：是否接受使用 `solve` 的测试版本。取值为 `-1` 时表示接受。

- `processor_index`：使用的 CPU 核代号。单次解，即 `independent solution` 中会用到，默认为 `1`。

- `number_of_processors`：所有可以调用的 CPU 核数量。单次解，即 `independent solution` 中会用到，默认为 `1`。

我通常使用的指令为：

```bash
enter LN <control_file> 1 b -1
```

这是从 Sébastien 那里学来的。未来我打算改为：

```bash
enter LN <control_file> 1 a -1
```

## 3. `solve` 指令的用法

进行全局解的另一条指令叫 `solve`。实际上，`solve` 指令是一个调用 `enter` 的 C-shell 脚本。

参考 [Leonid 的说明](http://astrogeo.org/psolve/doc/solve_guide_02.html)，`solve` 指令的输入参数与 `enter` 类似，其用法为：

```bash
solve <solve_initials> [<control_file>] [verbosity_level] [processor_index] [number_of_processors]
```

其中，`verbosity_level` 的常用取值如下：

- `verbose`：默认值，输出与解算有关的信息。

- `silent`：不输出任何信息。

- `verbose-autorestart`：与 `verbose` 类似，但会自动继续被中断的解算，不需要再进行一次交互确认。

- `silent-autorestart`：与 `silent` 类似，但会自动继续被中断的解算，不需要再进行一次交互确认。

- `verbose-norestart`：与 `verbose` 类似，但会自动<strong>从头</strong>，即从第一个 `session` 处，开始运行解算。

- `silent-norestart`：与 `silent` 类似，但会自动<strong>从头</strong>，即从第一个 `session` 处，开始运行解算。

交互解输入：

```bash
solve <solve_initials>
```

而综合解至少需要输入：

```bash
solve <solve_initials> <control_file>
```

## 4. 综合解的一些说明

综合解主要分为单次解 `Independent solution` 和全局解 `Global solution`。

单次解可以视为交互解的自动化模式，所有待估参数都是局部参数。而在全局解中，待估参数则分为全局参数和局部参数。

运行综合解时，可以通过 `smon` 程序检视运行情况，具体指令为：

```bash
smon <solve_initials> <work_dir> [<interval_update>]
```

其中，`work_dir` 为 Solve 解算的缓存目录，用于存储中间结果，由环境变量 `$WORK_DIR` 给出。

其原理是：Solve 会将正在处理的实验名称记录到进程文件，即 progress file 中。该文件通常为 `$WORK_DIR/PRGFxx`，其中 `xx` 即 `solve_initials`。`smon` 程序通过查询该文件来获取信息。因此，我们也可以手动检查进程文件来了解情况，例如：

```bash
tail $WORK_DIR/PRGFxx
```

综合解的解算结果存储在 `$SOLVE_DIR/SPLFxx` 中，可以通过 `getpar` 程序来获取，例如：

```bash
getpar <spool_file> [solve_label] [apr_nut]
```

最后的 `apr_nut` 表示章动序列是以 dX/dY 的形式给出。否则，章动序列以 $\mathrm{d}\psi$ 和 $\mathrm{d}\epsilon$ 的形式给出。

## 5. 来自 Leonid Petrov 的建议

- `SAVE_RATE` 建议设为 `100`。

- 控制文件中每一项参数配置都要写清楚。