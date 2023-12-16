---
layout: post-lemonchann
title: "利用Github Pages搭建个人主页的全过程"
date: 2022-01-31
tags:
    - geek
permalink: /blogs/create_blog_with_github_pages.html
comments: true
author: Neo
---

这是我的个人主页搭建完成之后的第一篇博文，整个搭建过程花了四天时间，现在我记录下搭建过程，
包括我的需求和实现、遇到的问题和解决方法。
需要声明的是，这并不是一篇教程，它展示的是我瞎折腾的过程，仅作自娱自乐之用。
而对于搭建教程，我推荐这篇
《[可能是最全面的github pages搭建个人博客教程](https://lemonchann.github.io/create_blog_with_github_pages/)》。
实际上，我也借鉴了这位作者的模版。

我参考了以下模版：

* [academicpages](https://github.com/academicpages/academicpages.github.io)，适合于学术展示；

* [lemonchann](https://github.com/lemonchann/lemonchann.github.io)，非常简洁的博客模版；

* [particle](https://github.com/nrandecker/particle)和[jekyll-uno-timeline](https://github.com/tzuehlke/jekyll-uno-timeline/)，我很喜欢他们的首页风格。

由于我的个人需求，最终我的个人主页就是囊括这三类模版的“缝合怪”。
如果你在寻找合适的模版，可以参考我上面的推荐。

<!-- more -->

接下来进入正式的内容。

## 起因

一直以来都有搭建个人学术主页的想法。
尽管学校也提供了个人信息页，但是可定制化的内容很少，且对上传文件的支持不好，
因此我就想利用Github Page自己搭建一个。
此外，Lenoid Petrov最近推出了一个新的VLBI数据处理软件包
[Space Geodesy Data Analysis Software System](http://astrogeo.org/sgdass/)。
安装这个软件包花了我许多时间，将来学习使用它肯定也要花费更多时间，我想写点博文记录一下。
今年过年要在老家待一周，我正好利用这段时间来摸索一下。

综合上述，我对个人主页的需求是：

- 适合学术展示；

- 支持博客功能。

如果仅考虑以上的需要，
[academicpages](https://github.com/academicpages/academicpages.github.io)
就是个非常合适的模版。
在搜索模版的时候，我发现
[lemonchann](https://github.com/lemonchann/lemonchann.github.io)
的风格我很喜欢，简约但功能很全。
此外，[particle](https://github.com/nrandecker/particle)的首页背景很好看。
最终，我决定做一个“融合怪”：即
`particle`的首页风格+`lemonchann`的博客配置+`academicpages`的学术主页配置。
这也是借鉴了
[jekyll-uno-timeline](https://github.com/tzuehlke/jekyll-uno-timeline/)
的思路：这位作者的主页上，点击“Projects”，在侧边栏显示的是Github项目的时间轴；
点击“Blogs”之后，完全是另外一种风格。
思路定下来之后，接下来就是具体实现了。

## 前期准备

如果完全使用模版，只需要修改根目录下的`_config.yml`。
但是，如果要实现自己定制，我觉得下列信息还是需要简单了解一下：

- node.js，npm、gem和yarn的区别与使用；

- Jekyll常用目录配置；

- 模版的目录配置，如`css`和`scss`对应目录以及实现逻辑。

## 模版混用

我采取的是加法原则，即选择最简单的模版，然后往里面依次添加其他功能。
我从`particle`开始，即将`particle`所有目录和文件复制到我的主页文件夹下。

### `particle`模版的修改 -- 修改首页图标

`particle`的预览需要通过`gulp`命令来实现，这个命令的具体操作可以在`gulpfile.js`中查看。
`particle`的`*.scss`文件放在`src/styles/`目录下，因此添加页面格式就需要修改这里面的文件。

`particle`首页的四个图标分别是：Email、Twitter、Google Plus和Github，其中Twitter和Google Plus的图标我不需要。
同时，我需要新增一些学术相关的图标和链接。
这时，我注意到`academicpages`模版中提供了ORCID、ADS和ResearchGate的图标，这些图标很适合
添加到首页上去。
通过查找，学术相关图标都由
[academicons](https://jpswalsh.github.io/academicons/)提供，
相关文件为`academicpages`模版的`/assets/css/`目录下的`academicons.css`
和`academicons.min.css`。
将这两个文件复制到我的`/assets/css/`目录下，将下面语句
```
<link rel="stylesheet" href="{{ "/assets/css/academicons.min.css" | prepend: site.baseurl }}">
```
添加到`_include/head.html`中，结果如下：
```
<link rel="stylesheet" href="{{ "/assets/css/academicons.min.css" | prepend: site.baseurl }}">
<link rel="stylesheet" href="{{ "/assets/css/main.css" | prepend: site.baseurl }}">
```

此后，在`_include/header.html`删去Twitter和Google Plus图标，
新增ORCID、ADS和ResearchGate的图标，结果如下：
```
<div class="header-icons">
  <a aria-label="Send email" href="mailto:{{site.email}}"><i class="icon fa fa-envelope" aria-hidden="true"></i></a>
  <a aria-label="My ORCID" href="http://orcid.org/{{site.author.orcid}}"><i class="icon ai ai-orcid" aria-hidden="true"></i></a>
  <a aria-label="My ResearchGate" href="{{site.author.researchgate}}"><i class="icon ai ai-researchgate" aria-hidden="true"></i></a>
  <a aria-label="My Github" target="_blank" href="https://github.com/{{site.github_username}}"><i class="icon fa fa-github-alt" aria-hidden="true"></i></a>
  <a aria-label="Search me on ADS" href="{{site.author.adslib}}"><i class="icon ai ai-ads" aria-hidden="true"></i></a>
</div>
```

图标栏下的导航栏修改相对容易，此处就不细说了。
此外，在`#about`和`#projects`处进行相应的修改，添加个人简介和项目信息。

### 引入`academicpages`模版的功能

`academicpages`模版的页面格式配置文件都放在`_sass`目录下，最终的`main.css`由
`/assets/css/main.scss`生成。
因此，将这些`_sass`目录和`/assets/css/main.scss`复制到相应目录下即可。
注意要重命名文件`main.scss`，如重命名为`academicmain.scss`。

`academicpages`模版的页面模版放在`_include`和`_layout`目录下，
复制到相应目录下并重命名即可。
此时，还需要修改`academicpages`模版的`head.html`中`main.css`的名称。

在`_config.yml`中引入`academicpages`模版的`_config.yml`的设置，注意检查同名变量的冲突。

将`academicpages`模版的页面内容存放在`_page`目录下，把需要的页面复制过来即可。
修改页面文件中的`layout`值。
我忽略了与`blog`相关的文件，因为博客的页面要另外定制。

### 引入`lemonchann`模版的功能

这一步与上一步类似，不再赘述。需要注意的是，`lemonchann`模版的目录设置与前两个不太一样。
我选择将三者统一，即修改了`lemonchann`模版文件中的目录信息。
由于我的博客首页不是根目录而是`/blogs`，在配置文件需要修改分页插件jekyll-paginate
的配置，需要将
```
paginate_path: "page:num"
```
改为
```
paginate_path: "/blogs/page:num/"
```
此时，分页插件将在`/blogs`目录下创建子目录。

尽管`lemonchann`模版利用[gitalk](https://github.com/gitalk/gitalk)实现了评论功能，
但遗憾的是不支持匿名评论。
一位名叫[bigbyto](https://github.com/xingty)的开发者写了一篇
《[给gitalk添加匿名评论功能](https://wiyi.org/gitalk-anonymous-comment.html)》。
于是，参考[ta的个人主页配置](https://github.com/xingty/xingty.github.io)，
即`_includes/comments-providers/gitalk.html`,对`lemonchann`模版中的
`_includes/gitalk.html`做出相应的修改即可。
此外，还需要自己部署后端来转发评论，这些均可以在bigbyto的仓库里找到，非常棒！

到了这一步，我的个人网页基本上就搭建好了。
正巧赶上大年夜，希望新的一年里能多写博文、多发paper吧！

## 致谢

感谢 [Jekyll](https://www.jekyll.com.cn/) 提供的技术支持才能有这个博客。
感谢 [academicpages](https://github.com/academicpages/academicpages.github.io)、
[lemonchann](https://github.com/lemonchann/lemonchann.github.io)
和[particle](https://github.com/nrandecker/particle)
提供的原始模板，我在其上进行的二次开发。
