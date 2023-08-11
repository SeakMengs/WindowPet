import English from "./locale/en/translation.json";
import Khmer from "./locale/kh/translation.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getAppSettings } from "./utils/settingsFunction";

const settings = await getAppSettings()

i18next
    .use(initReactI18next)
    .init({
        lng: settings?.language,
        fallbackLng: 'defaultLanguage',
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