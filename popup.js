// 获取当前语言（从 localStorage 读取，如果没有则使用浏览器语言）
let currentLang = localStorage.getItem('toolkitpub_lang') ||
  ((typeof chrome !== 'undefined' && chrome.i18n)
    ? (chrome.i18n.getUILanguage().startsWith('zh') ? 'zh' : 'en')
    : (navigator.language.startsWith('zh') ? 'zh' : 'en'));

// 工具数据
let toolsData = null;
let categories = [];

// DOM 元素
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.getElementById('categoryTabs');
const toolsList = document.getElementById('toolsList');
const toolsCount = document.getElementById('toolsCount');
const langSwitcher = document.getElementById('langSwitcher');
const langSwitcherAbout = document.getElementById('langSwitcherAbout');

// 当前筛选条件
let currentCategory = 'all';
let currentSearch = '';

// 初始化
async function init() {
  try {
    // 加载工具数据
    const response = await fetch('tools-data.json');
    toolsData = await response.json();
    categories = toolsData.categories;

    // 渲染分类标签
    renderCategoryTabs();

    // 渲染工具列表
    renderTools();

    // 更新工具数量
    updateToolsCount();

    // 绑定事件
    bindEvents();
    
    // 更新语言切换按钮状态
    updateLangButtons();
    
    // 初始化所有 i18n 文本
    updateI18nTexts();
  } catch (error) {
    console.error('Failed to load tools data:', error);
  }
}

// 渲染分类标签
function renderCategoryTabs() {
  // 清空所有标签
  categoryTabs.innerHTML = '';
  
  // 添加"全部"标签
  const allTab = document.createElement('button');
  allTab.className = 'category-tab active';
  allTab.dataset.category = 'all';
  allTab.textContent = getMessage('all_categories');
  categoryTabs.appendChild(allTab);

  // 添加其他分类标签
  categories.forEach(category => {
    const tab = document.createElement('button');
    tab.className = 'category-tab';
    tab.dataset.category = category.id;
    tab.textContent = category.name[currentLang];
    categoryTabs.appendChild(tab);
  });
}

// 渲染工具列表
function renderTools() {
  const filteredTools = filterTools();
  
  if (filteredTools.length === 0) {
    toolsList.innerHTML = `
      <div class="no-results">
        ${getMessage('no_results')}
      </div>
    `;
    return;
  }

  toolsList.innerHTML = filteredTools.map(tool => {
    const url = getToolUrl(tool.id);
    const iconName = getToolIcon(tool.id, tool.category);
    return `
    <a href="${url}" class="tool-item" data-category="${tool.category}" data-url="${url}">
      <div class="tool-icon">
        <i class="material-icons">${iconName}</i>
      </div>
      <div class="tool-info">
        <div class="tool-name">${tool.name[currentLang]}</div>
        <div class="tool-description">${tool.description[currentLang]}</div>
      </div>
    </a>
  `}).join('');
  
  // 为所有工具链接添加点击事件
  document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const url = item.dataset.url;
      openCenteredWindow(url);
    });
  });
}

// 获取工具链接（根据语言生成不同路径）
function getToolUrl(toolId) {
  const langPrefix = currentLang === 'zh' ? '/zh' : '';
  return `https://www.toolkitpub.com${langPrefix}/tools/${toolId}`;
}

// 过滤工具
function filterTools() {
  return toolsData.tools.filter(tool => {
    const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;
    const searchLower = currentSearch.toLowerCase();
    const matchesSearch = currentSearch === '' || 
      tool.name[currentLang].toLowerCase().includes(searchLower) ||
      tool.name.en.toLowerCase().includes(searchLower) ||
      tool.description[currentLang].toLowerCase().includes(searchLower) ||
      tool.description.en.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });
}

// 更新工具数量
function updateToolsCount() {
  const count = filterTools().length;
  const countText = currentLang === 'zh' 
    ? `${count} 个工具` 
    : `${count} tools`;
  toolsCount.textContent = countText;
}

// 获取工具图标（使用 Material Icons）
function getToolIcon(toolId, categoryId) {
  const toolIcons = {
    // JSON 工具
    'json-formatter': 'code',
    'json-to-xml': 'transform',
    'json-to-csv': 'table_chart',
    'json-to-yaml': 'description',
    'json-minify': 'compress',
    'json-beautify': 'auto_awesome',
    
    // 转换器
    'base64-encoder': 'lock',
    'base64-decoder': 'lock_open',
    'url-encoder': 'link',
    'url-decoder': 'link_off',
    'timestamp-converter': 'schedule',
    'color-converter': 'palette',
    'yaml-to-json': 'swap_horiz',
    'xml-to-json': 'swap_horiz',
    'csv-to-json': 'swap_horiz',
    'hex-converter': 'tag',
    'binary-converter': 'memory',
    'unicode-converter': 'translate',
    'html-entity': 'code',
    
    // 生成器
    'uuid-generator': 'fingerprint',
    'password-generator': 'vpn_key',
    'qrcode-generator': 'qr_code',
    'lorem-ipsum': 'text_fields',
    'jwt-generator': 'token',
    
    // 加密工具
    'hash-generator': 'tag',
    'hmac-generator': 'security',
    'crc-calculator': 'calculate',
    
    // 网络工具
    'ip-lookup': 'public',
    'port-scanner': 'router',
    'useragent-parser': 'devices',
    
    // 开发者工具
    'cron-parser': 'event',
    'regex-tester': 'search',
    'sql-formatter': 'storage',
    'jwt-decoder': 'verified_user',
    'markdown-preview': 'preview',
    
    // 图像工具
    'base64-image': 'image',
    'image-compressor': 'compress',
    'image-resizer': 'photo_size_select_large',
    
    // 文本工具
    'text-counter': 'format_list_numbered',
    'text-case-converter': 'text_format'
  };
  
  // 如果有特定工具图标，返回它
  if (toolIcons[toolId]) {
    return toolIcons[toolId];
  }
  
  // 否则返回分类默认图标
  return getCategoryIcon(categoryId);
}

// 获取分类图标
function getCategoryIcon(categoryId) {
  const icons = {
    developer: 'code',
    converter: 'swap_horiz',
    json: 'data_object',
    image: 'image',
    generator: 'auto_fix_high',
    text: 'text_fields',
    crypto: 'lock',
    network: 'wifi'
  };
  return icons[categoryId] || 'build';
}

// 获取 i18n 消息
function getMessage(key) {
  // 使用本地消息以支持动态语言切换
  const messages = {
    'all_categories': currentLang === 'zh' ? '全部分类' : 'All Categories',
    'search_placeholder': currentLang === 'zh' ? '搜索工具...' : 'Search tools...',
    'no_results': currentLang === 'zh' ? '未找到相关工具' : 'No tools found',
    'about': currentLang === 'zh' ? '关于' : 'About',
    'back': currentLang === 'zh' ? '返回' : 'Back',
    'about_subtitle': currentLang === 'zh' ? '开发者工具箱' : 'Developer Toolkit',
    'about_description_title': currentLang === 'zh' ? '网站介绍' : 'Website Introduction',
    'about_description_text': currentLang === 'zh'
      ? 'ToolkitPub 是一个免费的在线开发者工具箱，提供 41 种实用工具，帮助开发者提高工作效率。网站支持中英文界面，无需注册即可使用。'
      : 'ToolkitPub is a free online developer toolkit offering 41 practical tools to help developers improve work efficiency. The website supports Chinese and English interfaces and can be used without registration.',
    'about_tools_count': currentLang === 'zh' ? '个在线工具' : 'Online Tools',
    'about_categories_count': currentLang === 'zh' ? '个分类' : 'Categories',
    'about_categories_title': currentLang === 'zh' ? '工具分类' : 'Tool Categories',
    'about_visit_title': currentLang === 'zh' ? '访问官网' : 'Visit Website',
    'about_visit_btn': currentLang === 'zh' ? '打开 ToolkitPub' : 'Open ToolkitPub',
    'cat_developer': currentLang === 'zh' ? '开发者工具' : 'Developer Tools',
    'cat_converter': currentLang === 'zh' ? '转换器' : 'Converters',
    'cat_json': currentLang === 'zh' ? 'JSON 工具' : 'JSON Utilities',
    'cat_image': currentLang === 'zh' ? '图像工具' : 'Image Tools',
    'cat_generator': currentLang === 'zh' ? '生成器' : 'Generator Tools',
    'cat_docker': currentLang === 'zh' ? 'Docker 工具' : 'Docker Tools',
    'cat_text': currentLang === 'zh' ? '文本工具' : 'Text Tools',
    'cat_crypto': currentLang === 'zh' ? '加密工具' : 'Crypto Tools',
    'cat_network': currentLang === 'zh' ? '网络工具' : 'Network Tools',
    'cat_time': currentLang === 'zh' ? '时间工具' : 'Time Tools'
  };
  return messages[key] || key;
}

// 绑定事件
function bindEvents() {
  // 搜索输入
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderTools();
    updateToolsCount();
  });

  // 分类切换
  categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
      document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderTools();
      updateToolsCount();
    }
  });

  // 语言切换 - 主视图
  langSwitcher.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-btn')) {
      handleLangSwitch(e.target.dataset.lang);
    }
  });

  // 语言切换 - 关于视图
  if (langSwitcherAbout) {
    langSwitcherAbout.addEventListener('click', (e) => {
      if (e.target.classList.contains('lang-btn')) {
        handleLangSwitch(e.target.dataset.lang);
      }
    });
  }

  // 关于按钮点击
  const aboutLink = document.getElementById('aboutLink');
  if (aboutLink) {
    aboutLink.addEventListener('click', () => {
      showAboutView();
    });
  }

  // 返回按钮点击
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showMainView();
    });
  }

  // 回到顶部按钮
  const backToTop = document.getElementById('backToTop');
  const mainContent = document.querySelector('#mainView .main-content');
  if (backToTop && mainContent) {
    backToTop.addEventListener('click', () => {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// 处理语言切换
function handleLangSwitch(newLang) {
  if (newLang !== currentLang) {
    currentLang = newLang;
    localStorage.setItem('toolkitpub_lang', newLang);
    
    // 重置当前分类为"全部"
    currentCategory = 'all';
    
    // 更新按钮状态
    updateLangButtons();
    
    // 重新渲染页面
    renderCategoryTabs();
    renderTools();
    updateToolsCount();
    updateSubtitle();
    updateI18nTexts();
  }
}

// 更新语言切换按钮状态
function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 更新副标题
function updateSubtitle() {
  const subtitle = document.querySelector('.subtitle');
  if (subtitle) {
    subtitle.textContent = currentLang === 'zh' ? '开发者工具箱' : 'Developer Toolkit';
  }
}

// 打开居中的固定大小窗口
function openCenteredWindow(url) {
  const width = 1024;
  const height = 800;
  
  // 计算居中位置
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  // 窗口特性
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
  
  // 打开新窗口
  window.open(url, '_blank', features);
}

// 显示关于视图
function showAboutView() {
  document.getElementById('mainView').classList.remove('active');
  document.getElementById('aboutView').classList.add('active');
  // 确保语言按钮状态同步
  updateLangButtons();
  // 更新所有文本
  updateI18nTexts();
}

// 显示主视图
function showMainView() {
  document.getElementById('aboutView').classList.remove('active');
  document.getElementById('mainView').classList.add('active');
}

// 更新所有 i18n 文本
function updateI18nTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = getMessage(key);
    if (text) {
      el.textContent = text;
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);