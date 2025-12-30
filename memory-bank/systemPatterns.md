# System Patterns

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-12-30 01:20:00 - Log of updates made.

*

## Coding Patterns

*   使用 Chrome Extension Manifest V3
*   使用 ES6+ JavaScript 语法
*   使用 Chrome i18n API 实现多语言
*   工具数据存储在 JSON 配置文件中

## Architectural Patterns

*   Popup 模式：点击扩展图标显示工具列表
*   数据驱动：工具列表从 JSON 配置动态加载
*   分类筛选：按类别过滤工具

## Testing Patterns

*   手动测试扩展功能
*   测试多语言切换
*   测试工具链接跳转