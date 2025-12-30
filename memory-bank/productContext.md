# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-12-30 01:20:00 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

创建一个 Chrome 浏览器插件，提供对 toolkitpub.com 网站工具的快速访问。支持多语言界面和工具分类功能，用户可以直接在插件内点击链接在新标签页中打开对应的工具网页。

## Key Features

*   **工具分类浏览**：按类别（开发者工具、转换器、JSON 工具、图像工具、生成器等）组织 41+ 个工具
*   **多语言支持**：支持中文、英文等多语言界面
*   **快速访问**：点击工具直接在新标签页打开 toolkitpub.com 对应工具
*   **搜索功能**：快速搜索工具
*   **分类筛选**：按类别筛选显示工具

## Overall Architecture

*   Chrome Extension (Manifest V3)
*   Popup 界面显示工具列表
*   使用 Chrome i18n API 实现多语言
*   工具数据硬编码在 JSON 配置中
*   工具链接指向 toolkitpub.com 域名下的页面