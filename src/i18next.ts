import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import English from "./locale/en/translation.json";
import Khmer from "./locale/kh/translation.json";
import zhCNTranslation from './locale/zh-CN/translation.json';
import zhTWTranslation from './locale/zh-TW/translation.json';

const defaultLanguage = 'en';

i18next
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('language') || defaultLanguage,
        fallbackLng: defaultLanguage,
        resources: {
            en: {
                translation: English
            },
            kh: {
                translation: Khmer
            },
            'zh-CN': {
                translation: zhCNTranslation
            },
            'zh-TW': {
                translation: zhTWTranslation
            },
        }
    });

export default i18next;