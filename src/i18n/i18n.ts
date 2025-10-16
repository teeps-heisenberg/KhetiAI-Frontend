import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ur from './locales/ur.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            ur: {
                translation: ur,
            },
        },
        fallbackLng: 'en',
        lng: 'en', // default language
        interpolation: {
            escapeValue: false, // React already does escaping
        },
    });

export default i18n;


