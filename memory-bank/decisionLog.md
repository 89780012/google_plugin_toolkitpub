# Decision Log

This file records architectural and implementation decisions using a list format.
2025-12-30 01:20:00 - Log of updates made.

*

## Decision

* 2025-12-30 01:27:00 - Chrome Extension 基础架构实现

## Rationale

* 使用 Manifest V3 符合 Chrome 扩展最新规范
* 使用 Chrome i18n API 实现多语言支持
* 工具数据存储在 JSON 配置文件中便于维护
* Popup 模式提供简洁的用户界面
* 支持按类别筛选和搜索功能

## Implementation Details

**核心文件结构：**
- `manifest.json` - 扩展配置
- `tools-data.json` - 41 个工具数据配置
- `popup.html` - 弹出界面
- `popup.js` - 交互逻辑
- `styles.css` - 样式文件
- `_locales/en/messages.json` - 英文语言包
- `_locales/zh_CN/messages.json` - 中文语言包
- `images/` - 图标文件

---

### Decision (Code)
2025-12-30 02:39:00 - 更新 tools-data.json 以匹配 toolkitpub.com 网站

**Rationale:**
根据网站实际内容更新工具数据，确保与官方工具列表完全一致。

**Details:**
- 添加了 2 个新分类：Docker 工具、Time 工具
- 更新了 41 个工具的完整信息
- 工具分类：开发者工具(4)、转换器(11)、JSON 工具(6)、图像工具(5)、生成器(2)、Docker 工具(1)、文本工具(2)、加密工具(8)、网络工具(1)、时间工具(1)