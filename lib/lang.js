import zhCN from './lang/zh-CN';
import enUS from './lang/en-US';
import zhHK from './lang/zh-HK';
import zhTW from './lang/zh-TW';
import frFR from './lang/fr-FR';
import trTR from './lang/tr-TR';
import jaJP from './lang/ja-JP';
import { getQueryVariable, isBrowser, mergeDeep } from './utils';
import { isEqual } from 'lodash';

/**
 * 在这里配置所有支持的语言
 * 国家-地区
 */
export const langs = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
  'fr-FR': frFR,
  'tr-TR': trTR,
  'ja-JP': jaJP,
};

export const supportedLocales = Object.keys(langs);

/**
 * 获取当前语言字典
 * 如果匹配到完整的“国家-地区”语言，则显示国家的语言
 * @returns 不同语言对应字典
 */
export function generateLocaleDict(langString) {
  let userLocale;

  // 将语言字符串拆分为语言和地区代码，例如将 "zh-CN" 拆分为 "zh" 和 "CN"
  const [language, region] = langString.split(/[-_]/);

  // 优先匹配语言和地区都匹配的情况
  const specificLocale = `${language}-${region}`;
  if (supportedLocales.includes(specificLocale)) {
    userLocale = langs[specificLocale];
  }

  // 然后尝试匹配只有语言匹配的情况
  if (!userLocale) {
    const languageOnlyLocales = supportedLocales.filter((locale) =>
      locale.startsWith(language),
    );
    if (languageOnlyLocales.length > 0) {
      userLocale = langs[languageOnlyLocales[0]];
    }
  }

  // 如果还没匹配到，则返回最接近的语言包
  if (!userLocale) {
    const fallbackLocale = supportedLocales.find((locale) =>
      locale.startsWith('en'),
    );
    userLocale = langs[fallbackLocale];
  }

  return mergeDeep({}, langs['en-US'], userLocale);
}

/**
 * 初始化站点翻译
 * 根据用户当前浏览器语言进行切换
 */
export function initLocale(lang, locale, changeLang, changeLocale) {
  if (isBrowser) {
    const queryLang =
      getQueryVariable('lang') ||
      loadLangFromLocalStorage() ||
      window.navigator.language;

    let currentLang = lang;
    if (queryLang !== lang) {
      currentLang = queryLang;
    }
    changeLang(currentLang);
    saveLangToLocalStorage(currentLang);

    const targetLocale = generateLocaleDict(currentLang);
    if (!isEqual(locale, targetLocale)) {
      changeLocale(targetLocale);
    }
  }
}

/**
 * 读取语言
 * @returns {*}
 */
export const loadLangFromLocalStorage = () => {
  return localStorage.getItem('lang');
};

/**
 * 保存语言
 * @param newTheme
 */
export const saveLangToLocalStorage = (lang) => {
  localStorage.setItem('lang', lang);
};
