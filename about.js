// 获取当前语言
let currentLang = localStorage.getItem('toolkitpub_lang') ||
  ((typeof chrome !== 'undefined' && chrome.i18n)
    ? (chrome.i18n.getUILanguage().startsWith('zh') ? 'zh' : 'en')
    : (navigator.language.startsWith('zh') ? 'zh' : 'en'));

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 更新页面语言
  updatePageLanguage();
});

// 监听 localStorage 变化（其他页面切换语言时）
window.addEventListener('storage', (e) => {
  if (e.key === 'toolkitpub_lang') {
    currentLang = e.newValue || 'en';
    updatePageLanguage();
  }
});

// 更新页面语言
function updatePageLanguage() {
  // 更新所有带有 __MSG_xxx__ 的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = getMessage(key);
  });

  // 更新 title
  document.title = getMessage('about_title');
}

// 获取 i18n 消息
function getMessage(key) {
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    return chrome.i18n.getMessage(key) || key;
  }
  // 本地测试时的默认消息
  const messages = {
    'about_title': currentLang === 'zh' ? '关于 ToolkitPub' : 'About ToolkitPub',
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