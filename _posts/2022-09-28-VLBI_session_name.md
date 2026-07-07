---
layout: post-lemonchann
title: "VLBI 数据文件的命名规则"
date: 2022-09-28
permalink: /blogs/VLBI-session-name.html
tags:
  - VLBI
  - database
  - geodesy
comments: false
toc: true
author: Niu Liu
---

在 2023 年以前，VLBI 数据文件的命名遵循以下规则：日期 `yyMMMdd` 加 DBC 代码，即 database code，一个或两个字母，一共是 8 到 9 个字符。

<strong>注意</strong>：自 2023 年之后，VLBI 数据文件的命名规则改为 `yyyymmdd` 加 session 代码，其中 session 代码最长可达 12 个字符。

这里简单介绍一下 DBC 代码的含义。

<!-- more -->

## DBC 代码说明表

对于 DBC 代码的说明，可以在 [master 文件的格式说明文档](https://cddis.nasa.gov/archive/vlbi/ivsformats/master-format.txt) 中找到。这里列举如下表所示：

| DBC | CODES                                          |
| :-- | :--------------------------------------------- |
| D   | DSN                                            |
| DD  | DSN                                            |
| DO  | GSI                                            |
| DX  | GSI, CRL, CDP                                  |
| KL  | V230L                                          |
| KR  | V230R                                          |
| KV  | BR079, BL115                                   |
| LL  | CDP                                            |
| MH  | INT southern baseline                          |
| MV  | CRL                                            |
| RR  | CDP                                            |
| SL  | VLBA                                           |
| SV  | VLBA                                           |
| VC  | VGOS-INT                                       |
| VB  | VGOS, VGOS-INT, VGOS tests                     |
| VE  | EU-VGOS                                        |
| VG  | VGOS operational, VGOS tests                   |
| VH  | VGOS-INT                                       |
| VI  | VGOS-INT                                       |
| VJ  | VGOS-INT                                       |
| VK  | VGOS-INT                                       |
| VT  | VGOS-INT                                       |
| VX  | GSI                                            |
| X   | CDP, POLA, MOBL, IRIS-A, NRL, GERMAN, EUR, NGS |
| XM  | MOBL, EURMOB, IRIS-A                           |
| X2  | VLBA                                           |
| X5  | SGP                                            |
| X9  |                                                |
| XA  | SGP, POLA, CDP, MOBL, IRIS-A, NGS, EUR, VLBA   |
| XB  | POLA, IRIS-A, SGP, EUR, VLBA                   |
| XC  | SGP, EUR                                       |
| XD  | SGP                                            |
| XE  | NEOS-A, NEOS-B, SGP                            |
| XF  | JADE                                           |
| XG  | CDP                                            |
| XH  | IRIS-S                                         |
| XI  | IRIS-A                                         |
| XJ  | MOBL, NAVINT, NAVEX                            |
| XK  | CDP, SGP                                       |
| XL  | VLBA                                           |
| XM  | NRL, IRIS-I                                    |
| XN  | NRL, CRF                                       |
| XO  | USNO, NAVNET, NAVEX, APT                       |
| XP  | POLA, IRIS-A, CDP, IRIS-P                      |
| XQ  | CDP, SGP                                       |
| XR  | MOBL, IRIS-I, NRL, IRIS-A, GERMAN              |
| XS  | NGS                                            |
| XT  | MK1, CDP, VLBA, NEOS-I                         |
| XU  | IRIS-I, NEOS-I                                 |
| XV  | VLBA, CRF, NEOS-I                              |
| XW  | CDP, SGP                                       |
| XX  | CDP, GERMAN, CRL, GSI, SYOWA                   |
| XY  | CRL                                            |
| XZ  | INT                                            |
| ZZ  | CDP                                            |

上述代码可以简单分为以下几类。

## 表征观测网名称

### Deep Space Network

Deep Space Network，简称 DSN，是美国 NASA 深空网。其 VLBI 观测开始于 1967 年，最早在 <i>S</i> 波段观测河外源 3C273。

尽管 DSN VLBI 观测网的主要目的是支持 NASA 航天器的运行和为深空探测研究服务，它的空闲时间，约占总观测时间的 1% 到 2%，也用于地基天文观测。

DSN 中的 VLBI 望远镜代号一般为 `DSNxx`，其中 `xx` 为数字，主要分布于三个地方：美国加州的 Goldstone，西班牙马德里的 Robledo，以及澳大利亚堪培拉的 Tidbinbilla。

目前在 <i>X/Ka</i> 波段的天球参考架，例如 ICRF3 [[1](#Charlot2020)]，主要建立在 DSN VLBI 观测网的观测上。Altunin 等人的论文 [[2](#Altunin2000)] 为 DSN 的 VLBI 观测网提供了更为详细的说明。更多 DSN 在科学中的应用可以参考 [David L. Jauncey 的报告](https://rahist.nrao.edu/11-Montreal-Jauncey.pdf)。

对于 VLBI 观测而言，<strong>DBC 代码为 `D` 或 `DD`</strong> 表示该观测来自于 DSN 的 VLBI 观测网。

### Very Long Baseline Array

Very Long Baseline Array，简称 VLBA，是美国甚长基线射电望远镜阵，由 10 架口径为 25 米的天线组成，最长基线超过 8000 km，工作频率为 330 MHz 至 43 GHz，对射电天体的成图分辨率好于 1 mas [[3](#Kellermann1985)]。

<strong>DBC 代码为 `SL`、`SV`、`X2` 或 `XL`，以及可能的 `XA`、`XB` 或 `XT`</strong> 表示该观测可能来自于 VLBA 观测网。

### Europe

Europe，简称 EUR，指只使用欧洲 VLBI 网的观测，从 1990 年开始 [[4](#Krasna2013)]。

### GERMAN

GERMAN 从字面上推测是德国的 VLBI 观测网。IVS 数据库里面找不到相关数据。

### USNO Navy Network

USNO Navy Network，简称 NAVNET，是 USNO 主导的 VLBI 观测网，主要用于监测地球自转。它每周观测一次，时间上与 IRIS 错开 [[5](#Freedman1994)]。观测周期为 1989 年 1 月至 1993 年 4 月，共 226 期数据。

### NAVEX

NAVEX 是 USNO 主导的国际联测网项目。观测周期为 1990 年 4 月至 1999 年 9 月，共 75 期数据。

### Asia Pacific Telescope

Asia Pacific Telescope，简称 APT。由[相关网页](http://astro.sci.yamaguchi-u.ac.jp/eavn/aboutapt.html)可知，这是一个亚洲、大西洋、南美洲和非洲之间的 VLBI 联测网。

IVS 数据库中只有 4 期资料，分别为 `95JUN27XO`、`95JUN28XO`、`97JAN16XA` 和 `97JAN17XA`。

## 表征运行观测的机构名称

### Geographical Survey Institute

Geographical Survey Institute，简称 GSI，是日本国土地理院 Geospatial Information Authority of Japan 的前身。其主要工作是进行测地 VLBI 观测，改进日本测地基准点位置的测量，并监测日本附近的板块运动和地壳形变 [[6](#Fukuzaki2001)]。

GSI 于 1981 年开始研制可移动的 VLBI 系统，该系统在 1986 年至 1993 年间用于 VEGA，即 VLBI Experiment for Geodetic Application 项目。在 2010 年左右，GSI 仍在建设可移动的短基线，约 10 km，VLBI 系统，以用于检查和验证 GPS 接收机等测绘仪器的性能 [[7](#Ishii2010)]。

<strong>DBC 代码为 `DO` 或 `VX`，以及可能的 `DX` 或 `XX`</strong> 表示该观测可能来自于 GSI 的 VLBI 观测网。

### Communications Research Laboratory

Communications Research Laboratory，简称 CRL，是日本通信综合研究所，领导日本 VLBI 系统的发展，开发过 K-3 和 K-4 VLBI 系统，是 IVS 的 Technology Development Centers 之一 [[8](#Kondo2000)]。

CRL 负责硬件开发和观测，有 4 架天线，口径分别为 3 m、10 m、26 m 和 34 m，包括 Kashima，也参与测地观测，例如 CDP 项目 [[9](#Takaba1991)]。

<strong>DBC 代码为 `MV` 或 `XY`，以及可能的 `DX` 或 `XX`</strong> 表示该观测可能来自于 CRL 的 VLBI 观测网。

### Naval Research Laboratory

Naval Research Laboratory，简称 NRL，是美国海军研究实验室。IVS 数据库里面找不到相关数据。

### United States Naval Observatory

United States Naval Observatory，简称 USNO，是美国海军天文台。IVS 数据库里面找不到相关数据。

### SYOWA

SYOWA 是由日本 Japanese Antarctic Research Expeditions，简称 JAREs，在南极洲建立的 Syowa 站与澳大利亚 Hobart 站、南非 Hartebeesthoek 站组成的观测网，用于测量南极洲的板块运动 [[10](#Fukuzaki2005)]。

## 表征观测项目或计划名称

### Crustal Dynamics Project

Crustal Dynamics Project，简称 CDP，是美国 NASA 的大地测量计划，执行时期为 1979 年 10 月至 1991 年 12 月，共 12 年 [[11](#Bosworth1993)]。

该项目的主要科学目标包括提升对北美西部板块边界区域大型地震引起的区域形变和应力积累的认知和理解，以及研究相对板块运动等。测量手段包括 VLBI 和 SLR [[12](#Coates1983)]。

根据 [NASA 官网的介绍](https://cddis.nasa.gov/Programs/Historical_Programs.html#CDP)，该项目的主要成果之一是表明主要板块的现在运动与地质学上测量的数百万年内平均运动相接近。

<strong>DBC 代码为 `LL`、`RR`、`XG` 或 `ZZ`，以及可能的 `DX`、`X`、`XK`、`XP`、`XT`、`XW` 或 `XX`</strong> 表示该观测可能来自于 CDP 计划的 VLBI 观测。

### POLar-motion Analysis by Radio Interferometric Surveying

POLar-motion Analysis by Radio Interferometric Surveying，简称 POLARIS，对应的代号为 POLA。它是由 NGS 主导的大地测量项目，1980 年末开始观测，使用由 Haystack 和 HRAS 站组成的基线。1981 年 1 月，Haystack 站被 Westford 站替代。

此时的基线长度超过 3100 km，主要沿东西走向，与赤道面夹角约 20 度，因此对地球自转的变化非常敏感。1983 年末，第三个测站 OVRO 开始运行。每次实验总时长为 24 hr，单颗射电源每次典型观测时间为 2 到 3 min。每次实验对 14 颗射电源进行超过 200 次的观测 [[13](#Robertson1986)]。

自 1984 年开始，POLARIS 加入 MERIT 计划，与其他国家的观测站一起联测，此时的代号为 POLAR。该项目结束于 1996 年。

<strong>DBC 代码为 `X`、`XA`、`XB` 或 `XP`</strong> 表示该观测可能来自于 POLARIS 项目的观测。

### International Radio Interferometric Surveying

International Radio Interferometric Surveying，简称 IRIS。由于 POLARIS 观测网是美国本土的局域网，观测精度受限，因此需要寻求国际合作，在原有的 POLARIS 观测网的基础上添加新的观测站，以扩大观测网的覆盖面积。这就是美国国家海洋和大气管理局，National Oceanic and Atmospheric Administration，简称 NOAA，主导的 IRIS 项目。

该项目首先与瑞典 Onsala 空间天文台合作，每月参与一次 POLARIS 的观测。1983 年末，德国 Wettzell 站也加入了观测 [[13](#Robertson1986)]。

由美国三个站和欧洲两个站组成的观测网称为 IRIS-A，观测开始于 1984 年初，每 5 天观测一次，结束于 1993 年 4 月，共有 639 期资料。

此外，IRIS 还有另外两个观测网。一个 IRIS 观测网被称为 IRIS-P，即 Pacific，由美国的三个观测站 Fairbanks、Mojave 和 Richmond，以及日本 Kashima 站组成，1987 年 4 月开始观测，结束于 1994 年 10 月，共有 90 多期资料。另一个 IRIS 观测网叫 IRIS-S，即 South，由南非 Hartebeesthoek 站与美国和欧洲的站组成 [[14](#Schuh1990)]，观测自 1986 年 1 月开始，结束于 2001 年末，共有 169 期资料。

IRIS-I 观测网指的是 IRIS-Intensive，暂时没有找到相关信息，目前 IVS 数据库中也没有相应的数据。

<strong>DBC 代码为 `XI`，以及可能的 `X`、`XM`、`XA`、`XB`、`XP` 或 `XR`</strong> 表示该观测可能来自于 IRIS-A 观测网。<strong>DBC 代码为 `XP`</strong> 表示该观测可能来自于 IRIS-P 观测网。<strong>DBC 代码为 `XH`</strong> 表示该观测来自于 IRIS-S 观测网。

### Monitor Earth Rotation and Intercompare Techniques

Monitor Earth Rotation and Intercompare Techniques，简称 MERIT，于 1978 年启动，旨在综合利用 VLBI、LLR 和 SLR 技术来进行大地测量研究。观测周期为 1980 年 7 月至 10 月，共 17 期数据。该项目的成功促使了 IERS 的建立 [[13](#Robertson1986)]。

<strong>DBC 代码为 `X`</strong> 表示该观测可能来自于 MERIT 项目的 VLBI 观测。

### National Earth Orientation Survey

National Earth Orientation Survey，简称 NEOS。NEOS-A 观测网由 NOAA 的 IRIS 观测网和 USNO 的 NAVNET 观测网合并而成，由 USNO 负责，每周观测一次，目标是监测 EOP，并建立和维持 ICRF。

NEOS-A 观测网主要由美国的 Green Bank 站和 Kokee Park 站、巴西的 Fortaleza 站和德国的 Wettzell 站构成，美国的 Fairbanks 站或挪威的 Ny-Ålesund 站作为补充。加拿大的 Algonquin Park 站偶尔加入观测 [[15](#Schuh2000)]。观测周期为 1993 年 5 月至 2001 年 12 月，共 452 期数据。

NEOS-B 观测由 NOAA 资助，每月观测一次，目的是提升 TRF 的精度。但由于 NOAA 的 VLBI 预算缩减，1994 年被迫终止观测 [[16](#Arias1997)]。观测周期为 1993 年 5 月至 1994 年 10 月，共 19 期数据。

NEOS-I 观测网指的是 NEOS-Intensive，暂时没有找到相关信息，目前 IVS 数据库中也没有相应的数据。

### Continuous Observations of the Rotation of the Earth

Continuous Observations of the Rotation of the Earth，简称 CORE，主要目的是评估不同 VLBI 观测网得到的 EOP 测量之间的符合程度，从 1997 年 1 月开始，结束于 2001 年 10 月。

与 NEOS 观测网同步观测的称为 CORE-A 观测网，在 NEOS 网观测的相邻日期进行观测的称为 CORE-B 观测网 [[17](#MacMillan2000)]。CORE-A 观测网共有 81 期观测数据，而 CORE-B 观测网有 60 期。

### National Geodetic Survey

National Geodetic Survey，简称 NGS，现由 NOAA 主导的大地测量计划。IVS 数据库里面找不到相关数据。

### Space Geodesy Project

Space Geodesy Project，简称 SGP，是 NASA 的项目。IVS 数据库里面找不到相关数据。

### JApanese Dynamic Earth observation by VLBI

JApanese Dynamic Earth observation by VLBI，简称 JADE，是日本国内的 VLBI 观测网，由 4 个 GSI 观测站 TSUKUB32、SINTOTU3、CHICHI10 和 AIRA，以及两个 VERA 观测站 ERAMZSW 和 VERAISGK 组成 [[18](#Miura2009)]。观测周期为 1996 年 6 月至 2015 年 12 月，共 166 期数据。

<strong>DBC 代码为 `XF`</strong> 表示该观测来自于 JADE 观测网。

### IVS Regular

IVS Regular，包括 IVS-R1 和 IVS-R4，是自 2002 年开始的 IVS 常规观测。它们分别在每周一和周四进行观测，分别由 NASA 的 GSFC 和 USNO 负责 [[19](#Behrend2011)]。

### IVS-T2

IVS-T2 由波恩大学地球科学研究所 Institute of Geodesy and Geoinformation 协调，每两个月观测一次，每次有 12 个观测台站参与，目的是利用所有 IVS 观测台站每年至少观测 3 到 4 次，以监测 TRF [[19](#Behrend2011)]。

### IVS Celestial Reference Frame

IVS Celestial Reference Frame，简称 IVS-CRF，以及 CRF median-south，简称 IVS-CRMS，和 CRF deep-south，简称 IVS-CRD，均由 USNO 协调。它们的目的是提升现有 CRF 的精度，并通过新的射电源来扩充 CRF [[19](#Behrend2011)]，每 3 到 4 周观测一次 [[20](#Schluter2007)]。

### IVS research and development

IVS research and development，简称 IVS-R&D，每月观测一次，用于研究仪器效应、观测网偏差，以及改进技术和产品的新方法 [[20](#Schluter2007)]。

### R&D with the VLBA

R&D with the VLBA，简称 RDV，每两个月一次，提供精准度最高的天体测量数据，并为 ICRF 源提供成图资料 [[20](#Schluter2007)]。

### Continuous VLBI campaign

Continuous VLBI campaign，简称 CONT，是每三年一次、长达 15 天的连续观测，已有 CONT02、CONT05、CONT08、CONT11、CONT14 和 CONT17。其目的是利用最好的 VLBI 观测设备来展示 VLBI 技术的能力和最佳精度 [[20](#Schluter2007)]。

### VLBI Global Observing System

VLBI Global Observing System，简称 VGOS，是下一代 VLBI 系统，采用 12 米口径的天线，目标是与下一代其他空间大地测量技术一起实现台站的 1 mm 定位精度和 0.1 mm/yr 测速精度 [[21](#Niell2018)]。

### EUropean-VGOS

EUropean-VGOS，简称 EU-VGOS，是利用三个欧洲 VGOS 台站 Wettzell、Onsala 和 Yebes 开展的 VGOS 测试实验 [[22](#Alef2019)]。

### Intensive

Intensive，简称 INT，是 UT1 加强观测，观测时长为 1 小时，使用单基线。

INT1 基线由美国夏威夷的 Kokee 站，有时是 MK-VLBA，和德国的 Wettzell 站组成，周一到周五观测。INT2 基线由德国的 Wettzell 站和日本的 Tsukuba 站，后改为 Ishioka，组成，周末观测。INT3 观测网是由三个测站组成的三角观测网，三个测站分别为挪威的 Ny-Ålesund 站、德国的 Wettzell 站、日本的测站或者中国的佘山站 Seshan25，从 2007 年开始运行，每周一观测 [[23](#Bohm2022)]。

### Southern Intensives

Southern Intensives，简称 SI，于 2019 年启动，目的是弥补参与 UT1 加强观测的观测网均位于北半球而导致的观测几何不均匀不足。

该观测网由南非的 Hartebeesthoek 站 HART15M，简称 Ht，澳大利亚的 Yarragadee 站 YARRA12M，简称 Yg，以及 Hobart 站 HOBART12，简称 Hb，组成 [[23](#Bohm2022)]。DBC 代码为 `MH`。

### NAVINT

NAVINT 从字面推测，是 NAVNET 观测网的 UT1 加强观测。观测周期为 1989 年 4 月至 1993 年 4 月，共 129 期数据。

### VGOS Intensives

VGOS Intensives，简称 VGOS-INT，是 VGOS 观测网的 UT1 加强观测，从 2020 年开始。

VGOS-B 和 VGOS-C 观测网由瑞典 Onsala 站的两台天线与日本的 Ishioka 站组成 [[23](#Bohm2022)]，DBC 代码分别为 `VB` 和 `VC`。此外，还有由德国 Wettzell 站 WETTZ13S，简称 Ws，和美国 Kokee Park 站 KOKEE12M，简称 K2，组成的基线，DBC 代码为 `VI`；以及由德国 Ws 站和美国 McDonald Geodetic Observatory 的 MACGO12M 站，简称 Mg，组成的基线，DBC 代码为 `VT` 或 `VJ`。

目前还没有 DBC 代码为 `VH` 或 `VK` 的数据。

## 特殊观测实验

### V230L 和 V230R

V230L 和 V230R 这两个代码，DBC 代码分别为 `KL` 和 `KR`，各自只有一个观测数据，分别为 `07JUN24KL` 和 `07JUN24KR`。它们是 LBA 的 V230 观测实验的不同极化方式结果，即 RR 和 LL。

这次实验的负责人为 Leonid Petrov。根据[观测申请书](http://astrogeo.org/petrov/discussion/v230/lba_dec2006.pdf)，其主要目的是利用 <i>K</i> 波段的观测来测定 Atca、Ceduna 和 Mopra 这三个站的位置，预期精度为 5 至 10 厘米。Leonid 也给出了[实验分析结果](http://astrogeo.org/petrov/discussion/v230/)。

显然，这次实验数据不适合作为 <i>S/X</i> 波段全局解的输入数据。

### BR079、BL115 和 BL122

BR079、BL115 和 BL122 的 DBC 代码均为 `KV`，共有 10 次观测实验，是为了将 ICRF 拓展到 <i>K</i> 和 <i>Q</i> 波段而进行的先期实验。观测数据的分析结果见 [[24](#Lanyi2010)] 和 [[25](#Charlot2010)]。

### BP125C

BP125C 的 DBC 代码为 `KV`，session 名称为 `06OCT10KV`，为 VGaPS，即 Galactic Plane Survey 项目在 <i>K</i> 波段的观测。VGaPS 项目的目的是观测约 500 颗源，以增加银道面附近的 <i>K</i> 波段参考源数目。相关信息可见 http://astrogeo.org/gaps/。

### MOBL 或 EURMOB

MOBL 或 EURMOB 从字面上推测应该是可移动的 VLBI 天线。IVS 数据库里面找不到相关数据。

## 参考文献

* <span id="Charlot2020">[1] Charlot P, Jacobs C S, Gordon D, et al. The third realization of the International Celestial Reference Frame by very long baseline interferometry[J]. Astronomy & Astrophysics, 2020, 644: A159.</span>
* <span id="Altunin2000">[2] Altunin V. VLBI in the Deep Space Network: Challenges and Prospects[J]. 2000.</span>
* <span id="Kellermann1985">[3] Kellermann K I, Thompson A R. The Very Long Baseline Array[J]. Science, 1985, 229(4709): 123-130.</span>
* <span id="Krasna2013">[4] Krásná H, Tierno Ros C, Pavetich P, et al. Investigation of crustal motion in Europe by analysing the European VLBI sessions[J]. Acta Geodaetica et Geophysica, 2013, 48(4): 389-404.</span>
* <span id="Freedman1994">[5] Freedman A P, Steppe J A, Dickey J O, et al. The short-term prediction of universal time and length of day using atmospheric angular momentum[J]. Journal of Geophysical Research: Solid Earth, 1994, 99(B4): 6981-6996.</span>
* <span id="Fukuzaki2001">[6] Fukuzaki Y. Geodetic VLBI activities at GSI[J]. Communications Research Laboratory Journal, 2001, 48: 17.</span>
* <span id="Ishii2010">[7] Ishii A, Ichikawa R, Takiguchi H, et al. Current Status of the Development of a Transportable and Compact VLBI System by NICT and GSI[C]//Proceedings of the Sixth General Meeting of the International VLBI Service for Geodesy and Astrometry. 2010.</span>
* <span id="Kondo2000">[8] Kondo T. Technology Development Center at CRL[J]. In: N. R. Vandenberg and K. D. Baver, eds., International VLBI Service for Geodesy and Astrometry 2000 Annual Report, NASA/TP-2001-209979, 2000: 263-266.</span>
* <span id="Takaba1991">[9] Takaba H. VLBI of the Communications Research Laboratory[J]. Communications Research Laboratory Journal, 1991, 38(3): 417-433.</span>
* <span id="Fukuzaki2005">[10] Fukuzaki Y, Shibuya K, Ozawa T, et al. Results of the VLBI experiments conducted with Syowa Station, Antarctica[J]. Journal of Geodesy, 2005, 79(6): 379-388.</span>
* <span id="Bosworth1993">[11] Bosworth J M, Coates R J. The development of NASA's Crustal Dynamics Project[J]. Contributions of Space Geodesy to Geodynamics: Technology, 1993, 25: 1-20.</span>
* <span id="Coates1983">[12] Coates R J. The Crustal Dynamics Project[C]//Multidisciplinary Use of the Very Long Baseline Array. 1983: 64.</span>
* <span id="Robertson1986">[13] Robertson D S. The Astrometric Possibilities of Very-Long-Baseline Interferometry[C]//Symposium - International Astronomical Union. Cambridge University Press, 1986, 109: 143-155.</span>
* <span id="Schuh1990">[14] Schuh H. Earth's rotation measured by VLBI[M]//Earth's Rotation from Eons to Days. Springer, Berlin, Heidelberg, 1990: 1-12.</span>
* <span id="Schuh2000">[15] Schuh H, Schmitz-Hübsch H. Short period variations in Earth rotation as seen by VLBI[J]. Surveys in Geophysics, 2000, 21(5): 499-520.</span>
* <span id="Arias1997">[16] Arias F, Capitaine N, Dehant V, et al. Commission 19: Earth Rotation [Rotation De La Terre][J]. 1997.</span>
* <span id="MacMillan2000">[17] MacMillan D, Ma C. Improvement of VLBI EOP accuracy and precision[C]//International VLBI Service for Geodesy and Astrometry 2000 General Meeting Proceedings. 2000: 247-251.</span>
* <span id="Miura2009">[18] Miura Y, Kokado K, Kurihara S. Tsukuba VLBI Correlator[J]. management, 2009, 1: 1.</span>
* <span id="Behrend2011">[19] Behrend D, Haas R, Nothnagel A. Reports of IERS Components: International VLBI Service [IVS][J]. IERS Annual Report 2008-09. Frankfurt am Main: Verlag des Bundesamts für Kartographie und Geodäsie, 2011: 72-82.</span>
* <span id="Schluter2007">[20] Schlüter W, Behrend D. The International VLBI Service for Geodesy and Astrometry IVS: current capabilities and future prospects[J]. Journal of Geodesy, 2007, 81(6): 379-387.</span>
* <span id="Niell2018">[21] Niell A, Barrett J, Burns A, et al. Demonstration of a broadband very long baseline interferometer system: a new instrument for high-precision space geodesy[J]. Radio Science, 2018, 53(10): 1269-1291.</span>
* <span id="Alef2019">[22] Alef W, Anderson J M, Bernhart S, et al. The EUropean-VGOS Project[C]//Proceedings of the 24th European VLBI Group for Geodesy and Astrometry Working Meeting. 2019, 107: 111.</span>
* <span id="Bohm2022">[23] Böhm S, Böhm J, Gruber J, et al. Probing a southern hemisphere VLBI Intensive baseline configuration for UT1 determination[J]. Earth, Planets and Space, 2022, 74(1): 1-16.</span>
* <span id="Lanyi2010">[24] Lanyi G E, Boboltz D A, Charlot P, et al. The Celestial Reference Frame at 24 and 43 GHz. I. Astrometry[J]. The Astronomical Journal, 2010, 139(5): 1695.</span>
* <span id="Charlot2010">[25] Charlot P, Boboltz D A, Fey A L, et al. The Celestial Reference Frame at 24 and 43 GHz. II. Imaging[J]. The Astronomical Journal, 2010, 139(5): 1713.</span>
