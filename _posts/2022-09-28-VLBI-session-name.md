---
layout: post-lemonchann
title:  "VLBI数据文件的命名规则"
date: 2022-09-28
permalink: /blogs/VLBI-session-name.html
tags:
  - vlbi 
comments: true
author: Neo
---


在2023年以前，VLBI数据文件的命名遵循以下规则：日期（yyMMMdd）+DBC代码（database code, 一个或两个字母），一共是8-9个字母。
**注意：自2023年之后，VLBI数据文件的命名规则改为：yyyymmdd+session代码（最长可达12个字母）。**
这里简单介绍一下DBC代码的含义。

<!-- more -->

## DBC代码说明表

对于DBC代码的说明，可以在[master文件的格式说明文档](https://cddis.nasa.gov/archive/vlbi/ivsformats/master-format.txt)中找到，这里列举如下表所示：

| DBC   | CODES  |
| :---  | :---   |
| D  | DSN                   |
| DD | DSN                   |
| DO | GSI                   |
| DX | GSI, CRL, CDP         |
| KL | V230L |
| KR | V230R |
| KV | BR079, BL115 |
| LL | CDP                   |
| MH | INT (southern baseline) |
| MV | CRL                   |
| RR | CDP                   |
| SL | VLBA                  |
| SV | VLBA                  |
| VC | VGOS-INT |
| VB | VGOS, VGOS-INT, VGOS tests |
| VE | EU-VGOS |
| VG | VGOS operational, VGOS tests |
| VH | VGOS-INT |
| VI | VGOS-INT |
| VJ | VGOS-INT |
| VK | VGOS-INT |
| VT | VGOS-INT |
| VX | GSI                   |
| X  | CDP, POLA, MOBL, IRIS-A, NRL, GERMAN, EUR, NGS |
| XM | MOBL, EURMOB, IRIS-A |
| X2 | VLBA |
| X5 | SGP                  |
| X9 | |
| XA | SGP, POLA, CDP, MOBL, IRIS-A, NGS, EUR, VLBA |
| XB | POLA, IRIS-A, SGP, EUR, VLBA |
| XC | SGP, EUR           |
| XD | SGP                  |
| XE | NEOS-A, NEOS-B, SGP |
| XF | JADE |
| XG | CDP |
| XH | IRIS-S |
| XI | IRIS-A |
| XJ | MOBL, NAVINT, NAVEX |
| XK | CDP, SGP       |
| XL | VLBA      |
| XM | NRL, IRIS-I |
| XN | NRL, CRF |
| XO | USNO, NAVNET, NAVEX, APT |
| XP | POLA, IRIS-A, CDP, IRIS-P |
| XQ | CDP, SGP |
| XR | MOBL, IRIS-I, NRL, IRIS-A, NRL, GERMAN |
| XS | NGS |
| XT | MK1, CDP, VLBA, NEOS-I   |
| XU | IRIS-I, NEOS-I |
| XV | VLBA, CRF, NEOS-I |
| XW | CDP, SGP |
| XX | CDP, GERMAN, CRL, GSI, SYOWA |
| XY | CRL |
| XZ | INT |
| ZZ | CDP |

上述代码可以简单分为以下几类：

### 表征观测网名称

- Deep Space Network (DSN)：美国NASA深空网，VLBI观测开始于1967年，最早在*S*波段观测河外源3C273。尽管DSN VLBI观测网的主要目的是支持NASA航天器的运行和为深空探测研究服务，它的空闲时间（约占总观测时间的1%-2%）也用于地基天文观测。DSN中的VLBI望远镜代号一般为DSNxx（xx为数字），主要分布于三个地方：美国加州的Goldstone，西班牙马德里的Robledo和澳大利亚堪培拉的Tidbinbilla。目前在*X/Ka*波段的天球参考架（如ICRF3[[1](#Charlot2020)]）主要是建立在DSN VLBI观测网的观测上。Altunin等人的论文[[2](#Altunin2000)]为DSN的VLBI观测网提供了更为详细的说明。更多DSN在科学的应用可以参考[David L. Jauncey的报告]([https://rahist.nrao.edu/11-Montreal-Jauncey.pdf](https://rahist.nrao.edu/11-Montreal-Jauncey.pdf))。对于VLBI观测而言，**DBC代码为“D”或者“DD”**表示该观测来自于DSN的VLBI观测网。

- Very long baseline array (VLBA)：美国甚长基线（射电望远镜）阵，由10架口径为25米的天线组成，最长基线超过8000 km，工作频率为330 MHz至43 GHz，对射电天体的成图分辨率好于1 mas[[3](#Kellermann1985)]。**DBC代码为“SL”、“SV”、“X2”或者“XL”（“XA”、“XB”或“XT”）**表示该观测（可能）来自于VLBA观测网。

- Europe（EUR）：只使用欧洲VLBI网的观测，从1990年开始[[4](#Krasna2013)]。

- GERMAN：从字面上推测是德国的VLBI观测网。IVS数据库里面找不到相关数据。

- USNO Navy Network (NAVNET)：USNO主导的VLBI观测网，主要用于监测地球自转，每周观测一次，时间上与IRIS错开[[5](#Freedman1994)]。观测周期为1989年1月至1993年4月，共226期数据。

- NAVEX：USNO主导的国际联测网项目。观测周期为1990年4月至1999年9月，共75期数据。

- Asia Pacific Telescope (APT)：由[相关网页](http://astro.sci.yamaguchi-u.ac.jp/eavn/aboutapt.html)可知，这是一个亚洲、大西洋、南美洲和非洲之间的VLBI联测网。IVS数据库中只有4期资料，分别为95JUN27XO、95JUN28XO、97JAN16XA和97JAN17XA。

### 表征运行观测的机构名称

- Geographical Survey Institute (GSI)：日本国土地理院，Geospatial Information Authority of Japan的前身。主要的工作是进行测地VLBI观测，改进日本测地基准点位置的测量，监测日本附近的板块运动和地壳形变[[6](#Fukuzaki2001)]。1981年开始研制可移动的VLBI系统，该系统在1986年至1993年间用于VEGA（VLBI Experiment for Geodetic Application）项目。在2010年左右仍在建设可移动的短基线（约10Km）VLBI系统，以用于检查和验证如GPS接收机等测绘仪器的性能[[7](#Ishii2010)]。**DBC代码为“DO”或“VX”（“DX”或“XX”）**表示该观测（可能）来自于GSI的VLBI观测网。

- Communications Research Laboratory (CRL)：日本通信综合研究所，领导日本VLBL系统的发展，开发过K-3和K-4 VLBI系统，是IVS的Technology Development Centers 之一[[8](#Kondo2000)]。负责硬件开发和观测，有4架天线（口径分别为3 m， 10 m，26 m和34 m，包括Kashima），也参与测地观测（如CDP项目）[[9](#Takaba1991)]。**DBC代码为“MV”或“XY”（“DX”或“XX”）**表示该观测（可能）来自于CRL的VLBI观测网。

- Naval Research Laboratory (NRL)：美国海军研究实验室。IVS数据库里面找不到相关数据。

- United States Naval Observatory (USNO)：美国海军天文台。IVS数据库里面找不到相关数据。

- SYOWA：由日本Japanese Antarctic Research Expeditions (JAREs)在南极洲建立的Syowa站与澳洲的Hobart站、南非的Hartebeesthoek站组成的观测网，用于测量南极洲的板块运动[[10](#Fukuzaki2005)]。

### 表征观测项目或计划名称

- Crustal Dynamics Project (CDP)：美国NASA的大地测量计划，执行时期为1979年10月至1991年12月（一共12年）[[11](#Bosworth1993)]，主要科学目标包括提升对由北美西部板块边界区域大型地震引起的区域形变和应力积累的认知和理解、相对板块运动等，测量手段包括VLBI和SLR[[12](#Coates1983)]。根据[NASA官网的介绍](https://cddis.nasa.gov/Programs/Historical_Programs.html#CDP)，该项目的主要成果之一是表明主要板块的现在运动与地质学上测量的数百万年内平均运动相接近。**DBC代码为“LL”、“RR”、“XG”或“ZZ”（“DX”、“X”、“XK”、“XP”、“XT”、“XW”或“XX”）**表示该观测（可能）来自于CDP计划的VLBI观测。

- POLar-motion Analysis by Radio Interferometric Surveying (POLARIS)：对应的代号为POLA，由NGS主导的大地测量项目，1980年末开始观测，使用由HAYSTACK和HRAS站组成的基线。1981年1月，Haystack站被Westford站替代。此时的基线长度超过3100 km，主要延东西走向（与赤道面夹角约20度），因此对地球自转的变化非常敏感。1983年末，第三个测站OVRO开始运行。每次实验总时长为24 hr，单颗射电源每次典型观测时间为2-3 min。每次实验对14颗射电源进行超过200次的观测[[13](#Robertson1986)] 。自1984年开始加入MERIT计划，与其他国家的观测站一起联测，此时的代号为POLAR。该项目结束于1996年。**DBC代码为“X”、“XA”、“XB”或“XP”**表示该观测可能来自于POLARIS项目的观测。

- International Radio Interferometric Surveying（IRIS）：由于POLARIS观测网是个美国本土的局域网，观测精度受限，因此需要寻求国际合作，在原有的POLARIS观测网的基础上添加新的观测站，以扩大观测网的覆盖面积，这就是美国国家海洋和大气管理局（National Oceanic and Atmospheric Administration，NOAA）主导的IRIS项目。该项目首先与瑞典的Onsala空间天文台合作，每月参与一次POLARIS的观测，1983年末德国的Wettzel站也加入了观测[[13](#Robertson1986)]。 由美国三个站和欧洲的两个站组成的观测网称为IRIS-A，观测开始于1984年初，每5天观测一次，结束于1993年4月，共有639期资料。此外，IRIS还有另外两个观测网。一个IRIS观测网被称为IRIS-P (Pacific)，由美国的三个观测站（Fairbanks、Mojave和Richmond）和日本的Kashima站组成，1987年4月开始观测，结束于1994年10月，共有90多期资料。另一个IRIS观测网叫IRIS-S (South)，由南非的Hartebeesthoek站与美国和欧洲的站组成[[14](#Schuh1990)] ，观测自1986年1月开始，结束于2001年末，共有169期资料。IRIS-I观测网指的IRIS-Intensive，暂时没有找到相关信息，目前IVS数据库中也没有相应的数据。**DBC代码为“XI"("X"、“XM”、“XA”、“XB”、“XP”或“XR”)**表示该观测（可能）来自于IRIS-A观测网的观测，**DBC代码为“XP”**表示该观测可能来自于IRIS-A观测网，而**DBC代码为“XH”**表示该观测来自于IRIS-S观测网。

- Monitor Earth Rotation and Intercompare Techniques (MERIT)：1978年启动，旨在综合利用VLBI、LLR和SLR技术来进行大地测量研究，观测周期为1980年7月至10月，共17期数据。该项目的成功促使了IERS的建立[[13](#Robertson1986)] 。**DBC代码为"X"**表示该观测可能来自于MERIT项目的VLBI观测。

- National Earth Orientation Survey (NEOS)：NEOS-A观测网由NOAA的IRIS观测网和USNO的NAVNET观测网合并而成，由USNO负责，每周观测一次，目标是监测EOP和建立和维持ICRF。NEOS-A观测网主要由美国的Green Bank站和Kokee Park站、巴西的Fortaleza站和德国的Wettzell站构成，美国的Faribanks站或挪威的Ny Alesund站补充。加拿大的Algonquin Park站偶尔加入观测[[15](#Schuh2000)]。观测周期为1993年5月至2001年12月，共452期数据。NEOS-B观测由NOAA资助，每月观测一次，目的是提升TRF的精度，但由于NOAA的VLBI预算缩减，1994年被迫终止观测[[16](#Arias1997)]。观测周期为1993年5月至1994年10月，共19期数据。NEOS-I观测网指的是NEOS-Intensive，暂时没有找到相关信息，目前IVS数据库中也没有相应的数据。

- Continuous Observations of the Rotation of the Earth (CORE)：主要目的是评估不同VLBI观测网得到的EOP测量之间符合程度，从1997年1月开始，结束于2001年10月。与NEOS观测网同步观测的称为CORE-A观测网，在NEOS网观测的相邻日期进行观测的称为CORE-B观测网[[17](#MacMillan2000)]。CORE-A观测网共有81期观测数据，而CORE-B观测网有60期。

- National Geodetic Survey (NGS)：现由NOAA主导的大地测量计划。IVS数据库里面找不到相关数据。

- Space Geodesy Project (SGP)：NASA的项目。IVS数据库里面找不到相关数据。

- JApanese Dynamic Earth observation by VLBI (JADE)：日本国内的VLBI观测网，由4个GSI观测站（TSUKUB32、SINTOTU3、CHICHI10和AIRA）和两个VERA观测站（ERAMZSW和VERAISGK）组成[[18](#Miura2009)]。观测周期为1996年6月至2015年12月，共166期数据。**DBC代码为“XF”**表示该观测来自于JADE观测网。

- IVS Regular (IVS-R1/IVS-R4)：自2002年开始的IVS常规观测，每周一和周四分别进行观测，分别由NASA的GSFC和USNO负责[[19](#Behrend2011)]。

- IVS-T2：由波恩大学地球科学研究所 (Institute of Geodesy and Geoinformation)协调，每两个月观测一次，每次有12个观测台站参与，目的是利用所有的IVS观测台站每年至少观测3-4次监测TRF[[19](#Behrend2011)]。

- IVS Celestial Reference Frame (IVS-CRF), CRF median-south (IVS-CRMS), CRF deep-south (IVS-CRD)：由USNO协调，目的是提升现有的CRF精度并通过新的射电源来扩充CRF[[19](#Behrend2011)]，每3-4周观测一次[[20](#Schluter2007)]。

- IVS research and development (IVS-R&D)：每月观测一次，用于研究仪器效应、观测网偏差和改进技术和产品的新方法[[20](#Schluter2007)]。

- R&D with the VLBA (RDV)：每两个月一次，提供精准度最高的天体测量数据和为ICRF源提供成图资料[[20](#Schluter2007)]。

- Continuous VLBI campaign (CONT)：每三年一次的长达15天的连续观测，有CONT02、CONT05、CONT08、CONT11、CONT14、CONT17。目的是利用最好的VLBI观测设备来展示VLBI技术的能力和最好精度[[20](#Schluter2007)]。

- VLBI Global Observing System (VGOS)：下一代VLBI系统，采用12米口径的天线，目标是与下一代其他空间大地测量技术一起实现台站的1 mm定位精度和0.1 mm/yr测速精度[[21](#Niell2018)]。

- EUropean-VGOS (EU-VGOS)：利用三个欧洲VGOS台站（Wettzell、Onsala和Yebes）开展的VGOS测试实验[[22](#Alef2019)]。

- Intensive (INT)：UT1加强观测，观测时长为1小时，使用单基线。INT1基线由美国夏威夷的Kokee站（有时是MK-VLBA）和德国的Wetzell站组成，周一到周五观测。INT2基线由德国的Wetzell站和日本的Tsukuba站（后改为Ishioka）组成，周末观测。INT3观测网是由三个测站组成的三角观测网，三个测站分别为挪威的Ny-Ålesund站、德国的Wetzell站、日本的测站或者中国的佘山站（Seshan25），从2007年开始运行，每周一观测[[23](#Bohm2022)]。

- Southern Intensives (SI)：2019年启动，目的是弥补参与UT1加强观测的观测均位于北半球而导致的观测几何不均匀的不足，由 南非的Hartebeesthoek站 (HART15M，简称Ht)、澳大利亚的Yarragadee站(YARRA12M，简称Yg) 和Hobart站 (HOBART12，简称Hb)组成[[23](#Bohm2022)]，DBC代码为“MH”。

- NAVINT：从字面推测，是NAVNET观测网的UT1加强观测。观测周期为1989年4月至1993年4月，共129期数据。

- VGOS Intensives (VGOS-INT)：VGOS观测网的UT1加强观测，从2020年开始。VGOS-B和VGOS-C观测网由瑞典Onsala站的两台天线与日本的 Ishioka站组成[[23](#Bohm2022)]，DBC代码分别为“VB”和“VC”。此外，还有德国的Wetzell站（WETTZ13S，简称Ws）和美国的Kokee Park站（KOKEE12M，简称K2）组成的基线，DBC代码为“VI”；德国的Ws站和美国McDonald Geodetic Observatory的MACGO12M站（简称Mg）组成的基线，DBC代码为“VT”或“VJ”。目前还没有DBC代码为“VH”或“VK”的数据。

### 特殊观测实验

- V230L/V230R：这两个代码（DBC代码分别为KL和KR）各自只有一个观测数据，分别为07JUN24KL和07JUN24KR，为LBA的V230观测实验的不同极化方式结果（RR和LL）。这次实验的负责人为Leonid Petrov，根据[观测申请书](http://astrogeo.org/petrov/discussion/v230/lba_dec2006.pdf)主要目的是利用*K*波段的观测来测定Atca、Ceduna和Mopra这三个站的位置，预期精度为5至10厘米。Leonid也给出了实验分析结果(<http://astrogeo.org/petrov/discussion/v230/>)。显然，这次实验数据不适合作为*S/X*波段全局解的输入数据。

- BR079/BL115/BL122：DBC代码均为KV，共有10次观测实验，是为了将ICRF拓展到*K*和*Q*波段而进行的先期实验，观测数据的分析结果见[[24](#Lanyi2010)]和[[25](#Charlot2010)]。

- BP125C：DBC代码为KV，session名称为06OCT10KV，为VGaPS (Galactic Plane Survey)项目在*K*波段的观测。VGaPS项目的目的是观测约500颗源来增加银道面附近的*K*波段参考源数目，相关信息可见[http://astrogeo.org/gaps/](http://astrogeo.org/gaps/)。

- MOBL或EURMOB：从字面上推测应该是可移动的VLBI天线。IVS数据库里面找不到相关数据。

## 参考文献

- <span id="Charlot2020">[1] Charlot P, Jacobs C S, Gordon D, et al. The third realization of the International Celestial Reference Frame by very long baseline interferometry[J]. Astronomy & Astrophysics, 2020, 644: A159.</span>
- <span id="Altunin2000">[2] Altunin V. VLBI in the Deep Space Network: Challenges and Prospects[J]. 2000.</span>
- <span id="Kellermann1985">[2] Kellermann K I, Thompson A R. The very long baseline array[J]. Science, 1985, 229(4709): 123-130.</span>
- <span id="Krasna2013">[4] Krásná H, Tierno Ros C, Pavetich P, et al. Investigation of crustal motion in Europe by analysing the European VLBI sessions[J]. Acta geodaetica et geophysica, 2013, 48(4): 389-404.</span>
- <span id="Freedman1994">[5] Freedman A P, Steppe J A, Dickey J O, et al. The short‐term prediction of universal time and length of day using atmospheric angular momentum[J]. Journal of Geophysical Research: Solid Earth, 1994, 99(B4): 6981-6996.</span>
- <span id="Fukuzaki2001">[6] Fukuzaki Y. Geodetic VLBI activities at GSI[J]. Communications Research Laboratory Journal, 2001, 48: 17.</span>
- <span id="Ishii2010">[7] Ishii A, Ichikawa R, Takiguchi H, et al. Current Status of the Development of a Transportable and Compact VLBI System by NICT and GSI[C]//Proceedings of the Sixth General Meeting of the International VLBI Service for Geodesy and Astrometry. 2010.</span>
- <span id="Kondo2000">[8] Kondo T. Technology Development Center at CRL[J]. by" NR Vandenberg and KD Bayer, NASA/TP-2001-209979. pp, 2000: 263-266.</span>
- <span id="Takaba1991">[9] Takaba H. VLBI of the Communications Research Laboratory[J]. Communications Research Laboratory Journal, 1991, 38(3): 417-433.</span>
- <span id="Fukuzaki2005">[10] Fukuzaki Y, Shibuya K, Ozawa T, et al. Results of the VLBI experiments conducted with Syowa Station, Antarctica[J]. Journal of geodesy, 2005, 79(6): 379-388.</span>
- <span id="Bosworth1993">[11] Bosworth J M, Coates R J. The development of NASA's crustal dynamics project[J]. Contributions of Space Geodesy to Geodynamics: Technology, 1993, 25: 1-20.</span>
- <span id="Coates1983">[12] Coates R J. The Crustal Dynamics Project[C]//Multidisciplinary Use of the Very Long Baseline Array. 1983: 64.</span>
- <span id="Robertson1986">[13] Robertson D S. The Astrometric Possibilities of Very-Long-Baseline Interferometry[C]//Symposium-International Astronomical Union. Cambridge University Press, 1986, 109: 143-155.</span>
- <span id="Schuh1990">[14] Schuh H. Earth’s rotation measured by VLBI[M]//Earth’s Rotation from Eons to Days. Springer, Berlin, Heidelberg, 1990: 1-12.</span>
- <span id="Schuh2000">[15] Schuh H, Schmitz-Hübsch H. Short period variations in Earth rotation as seen by VLBI[J]. Surveys in Geophysics, 2000, 21(5): 499-520.</span>
- <span id="Arias1997">[16] Arias F, Capitaine N, Dehant V, et al. Commission 19: Earth Rotation [Rotation De La Terre](J). 1997.</span>
- <span id="MacMillan2000">[17] MacMillan D, Ma C. Improvement of VLBI EOP accuracy and precision[C]//International VLBI Service for Geodesy and Astrometry 2000 General Meeting Proceedings. 2000: 247-251.</span>
- <span id="Miura2009">[18] Miura Y, Kokado K, Kurihara S. Tsukuba VLBI Correlator[J]. management, 2009, 1: 1.</span>
- <span id="Behrend2011">[19] Behrend D, Haas R, Nothnagel A. Reports of IERS Components: International VLBI Service [IVS](J). IERS Annual Report 2008-09. Edited by Wolfgang R. Dick and Bernd Richter. International Earth Rotation and Reference Systems Service, Central Bureau. Frankfurt am Main: Verlag des Bundesamts für Kartographie und Geodäsie, 2011. 237 p.,, 2011: 72-82.</span>
- <span id="Schluter2007">[20] Schlüter W, Behrend D. The International VLBI Service for Geodesy and Astrometry (IVS): current capabilities and future prospects[J]. Journal of Geodesy, 2007, 81(6): 379-387.</span>
- <span id="Niell2018">[21] Niell A, Barrett J, Burns A, et al. Demonstration of a broadband very long baseline interferometer system: a new instrument for high-precision space geodesy[J]. Radio Science, 2018, 53(10): 1269-1291.</span>
- <span id="Alef2019">[22] Alef W, Anderson J M, Bernhart S, et al. The EUropean-VGOS Project[C]//Proceedings of the 24th European VLBI Group for Geodesy and Astrometry Working Meeting. 2019, 107: 111.</span>
- <span id="Bohm2022">[23] Böhm S, Böhm J, Gruber J, et al. Probing a southern hemisphere VLBI Intensive baseline configuration for UT1 determination[J]. Earth, Planets and Space, 2022, 74(1): 1-16.</span>
- <span id="Lanyi2010">[24] Lanyi G E, Boboltz D A, Charlot P, et al. The celestial reference frame at 24 and 43 GHz. I. Astrometry[J]. The Astronomical Journal, 2010, 139(5): 1695.</span>
- <span id="Charlot2010">[25] Charlot P, Boboltz D A, Fey A L, et al. The Celestial Reference Frame at 24 and 43 GHz. II. Imaging[J]. The Astronomical Journal, 2010, 139(5): 1713.</span>
