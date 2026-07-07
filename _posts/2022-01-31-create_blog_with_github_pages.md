---
layout: post-lemonchann
title: "利用 GitHub Pages 搭建个人主页的全过程"
date: 2022-01-31
tags:
  - geek
permalink: /blogs/create_blog_with_github_pages.html
comments: false
author: Niu Liu
---

> 注：本文写于 2022 年，主要记录本站最初搭建时的折腾过程。网站结构后来经过多次调整，文中的部分路径和代码写法已经按照当前版本略作更新。

这是我的个人主页搭建完成之后的第一篇博文。整个搭建过程花了四天时间，所以我想记录一下其中的过程，包括我的需求、具体实现方式，以及遇到的问题和解决方法。

需要声明的是，这并不是一篇严格意义上的教程，而是对我自己瞎折腾过程的记录，仅作自娱自乐之用。关于更系统的搭建教程，我推荐这篇文章：《[可能是最全面的 GitHub Pages 搭建个人博客教程](https://lemonchann.github.io/create_blog_with_github_pages/)》。实际上，我也借鉴了这位作者的模板。

我主要参考了以下几个模板：

* [academicpages](https://github.com/academicpages/academicpages.github.io)，适合学术展示；
* [lemonchann](https://github.com/lemonchann/lemonchann.github.io)，非常简洁的博客模板；
* [particle](https://github.com/nrandecker/particle) 和 [jekyll-uno-timeline](https://github.com/tzuehlke/jekyll-uno-timeline/)，我很喜欢它们的首页风格。

由于个人需求比较混杂，最终我的个人主页就成了一个融合三类模板的“缝合怪”。如果你也在寻找合适的模板，可以参考上面的几个项目。

<!-- more -->

接下来进入正式内容。

## 起因

一直以来，我都有搭建个人学术主页的想法。尽管学校也提供了个人信息页，但可定制化的内容很少，而且对上传文件的支持也不够方便。因此，我想利用 GitHub Pages 自己搭建一个个人主页。

此外，Leonid Petrov 最近推出了一个新的 VLBI 数据处理软件包：[Space Geodesy Data Analysis Software System](http://astrogeo.org/sgdass/)。安装这个软件包花了我不少时间，将来学习使用它肯定也需要更多时间，所以我想写一些博文记录相关过程。正好今年过年要在老家待一周，于是我就利用这段时间开始摸索个人主页的搭建。

综合上述情况，我对个人主页的主要需求是：

* 适合学术展示；
* 支持博客功能。

如果仅考虑以上需求，[academicpages](https://github.com/academicpages/academicpages.github.io) 就是一个非常合适的模板。在搜索模板的时候，我发现 [lemonchann](https://github.com/lemonchann/lemonchann.github.io) 的风格也很喜欢，简约但功能比较完整。此外，[particle](https://github.com/nrandecker/particle) 的首页背景很好看。

最终，我决定做一个“融合怪”：即 `particle` 的首页风格，加上 `lemonchann` 的博客配置，再加上 `academicpages` 的学术主页配置。这也借鉴了 [jekyll-uno-timeline](https://github.com/tzuehlke/jekyll-uno-timeline/) 的思路：这位作者的主页中，点击 “Projects” 时，在侧边栏显示的是 GitHub 项目的时间轴；点击 “Blogs” 之后，则切换到另一种完全不同的风格。

思路确定之后，接下来就是具体实现了。

## 前期准备

如果完全使用某一个模板，通常只需要修改根目录下的 `_config.yml`。但是，如果要实现自己的定制，我觉得下列信息还是需要简单了解一下：

* Node.js、npm、gem 和 yarn 的区别与基本使用；
* Jekyll 常用目录配置；
* 模板的目录结构，例如 `css` 和 `scss` 对应的目录，以及样式文件的生成逻辑。

## 模板混用

我采取的是“加法原则”，即选择一个最简单的模板作为基础，然后往里面依次添加其他功能。我从 `particle` 开始，将 `particle` 的所有目录和文件复制到我的主页文件夹下。

### `particle` 模板的修改：修改首页图标

`particle` 的本地预览需要通过 `gulp` 命令实现，具体操作可以在 `gulpfile.js` 中查看。`particle` 的 `.scss` 文件放在 `src/styles/` 目录下，因此如果要修改页面样式，就需要修改这里面的文件。

`particle` 首页原本有四个图标，分别是 Email、Twitter、Google Plus 和 GitHub。其中 Twitter 和 Google Plus 的图标我不需要，同时我希望新增一些学术相关的图标和链接。

这时，我注意到 `academicpages` 模板中提供了 ORCID、ADS 和 ResearchGate 的图标，这些图标非常适合添加到学术主页上。通过查找，我发现这些学术相关图标都由 [Academicons](https://jpswalsh.github.io/academicons/) 提供。相关文件在 `academicpages` 模板的 `/assets/css/` 目录下，主要包括 `academicons.css` 和 `academicons.min.css`。

将这两个文件复制到我的 `/assets/css/` 目录下，然后在 `_includes/head.html` 中添加：

```liquid
<link rel="stylesheet" href="{{ '/assets/css/academicons.min.css' | relative_url }}">
```

最终相关部分如下：

```liquid
<link rel="stylesheet" href="{{ '/assets/css/academicons.min.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
```

此后，在 `_includes/header.html` 中删去 Twitter 和 Google Plus 图标，新增 ORCID、ADS 和 ResearchGate 图标。当前版本可以写成：

```liquid
<div class="header-icons">
  {% if site.author.email %}
    <a aria-label="Send email" target="_blank" href="mailto:{{ site.author.email }}">
      <i class="icon fa fa-envelope" aria-hidden="true"></i>
    </a>
  {% endif %}

  {% if site.author.orcid %}
    <a aria-label="My ORCID" target="_blank" href="https://orcid.org/{{ site.author.orcid }}">
      <i class="icon ai ai-orcid" aria-hidden="true"></i>
    </a>
  {% endif %}

  {% if site.author.researchgate %}
    <a aria-label="My ResearchGate" target="_blank" href="{{ site.author.researchgate }}">
      <i class="icon ai ai-researchgate" aria-hidden="true"></i>
    </a>
  {% endif %}

  {% if site.github_username %}
    <a aria-label="My GitHub" target="_blank" href="https://github.com/{{ site.github_username }}">
      <i class="icon fa fa-github-alt" aria-hidden="true"></i>
    </a>
  {% endif %}

  {% if site.author.adslib %}
    <a aria-label="Search me on ADS" target="_blank" href="{{ site.author.adslib }}">
      <i class="icon ai ai-ads" aria-hidden="true"></i>
    </a>
  {% endif %}
</div>
```

图标栏下方的导航栏修改相对容易，此处不再细说。此外，我也在 `#about` 和 `#projects` 两个部分进行了相应修改，用来添加个人简介和项目信息。

### 引入 `academicpages` 模板的功能

`academicpages` 模板的页面样式配置文件主要放在 `_sass` 目录下，最终的 CSS 文件由 `/assets/css/main.scss` 生成。因此，我将这些 `_sass` 目录和 `/assets/css/main.scss` 复制到自己的项目中。

为了避免和原有首页的 `main.css` 冲突，需要将 `main.scss` 重命名，例如改成 `academicmain.scss`，对应生成的文件为 `academicmain.css`。

`academicpages` 模板的页面模板主要放在 `_includes` 和 `_layouts` 目录下。复制到相应目录之后，也需要根据自己的项目结构进行重命名和调整。此时，还需要修改 `academicpages` 模板中的 `head.html`，让它加载新的 CSS 文件，而不是默认的 `main.css`。

在 `_config.yml` 中，需要引入 `academicpages` 模板的相关配置，并仔细检查同名变量是否发生冲突。

学术页面的内容则可以存放在 `_pages` 目录下。将需要的页面复制过来之后，再修改页面文件中的 `layout` 值即可。我忽略了其中与博客相关的文件，因为博客页面要另外定制。

### 引入 `lemonchann` 模板的功能

这一步与上一步类似，不再赘述。需要注意的是，`lemonchann` 模板的目录设置与前两个模板不太一样。为了让站点结构更统一，我选择修改 `lemonchann` 模板文件中的目录信息，使其适应当前网站结构。

由于我的博客首页不是根目录，而是 `/blogs/`，因此还需要修改分页插件 `jekyll-paginate` 的配置。原来的设置是：

```yaml
paginate_path: "page:num"
```

需要改为：

```yaml
paginate_path: "/blogs/page:num/"
```

这样，分页插件就会在 `/blogs/` 目录下创建子目录。

`lemonchann` 模板原本利用 [Gitalk](https://github.com/gitalk/gitalk) 实现评论功能，但遗憾的是它不支持匿名评论。一位名叫 [bigbyto](https://github.com/xingty) 的开发者写过一篇《[给 Gitalk 添加匿名评论功能](https://wiyi.org/gitalk-anonymous-comment.html)》。于是，我参考了他的个人主页配置，尤其是其中的 `_includes/comments-providers/gitalk.html`，并对 `lemonchann` 模板中的 `_includes/gitalk.html` 做了相应修改。

此外，还需要自己部署后端来转发评论。这些内容都可以在 bigbyto 的仓库里找到，非常棒。

到了这一步，我的个人网页基本上就搭建好了。正巧赶上大年夜，希望新的一年里能多写博文，多发 paper 吧！

## 致谢

感谢 [Jekyll](https://www.jekyll.com.cn/) 提供的技术支持，让我能够搭建这个博客。

感谢 [academicpages](https://github.com/academicpages/academicpages.github.io)、[lemonchann](https://github.com/lemonchann/lemonchann.github.io) 和 [particle](https://github.com/nrandecker/particle) 提供的原始模板。本站是在这些模板的基础上进行二次开发而成的。

