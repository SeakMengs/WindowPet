import English from "./locale/en/translation.json";
import Khmer from "./locale/kh/translation.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const defaultLanguage = 'en';

i18next
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: defaultLanguage,
        resources: {
            en: {
                translation: English
            },
            kh: {
                translation: Khmer
            },
        }
    });

export default i18next;