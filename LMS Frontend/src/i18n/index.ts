import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import si from './si.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      si: { translation: si },
    },
    fallbackLng: 'si',
    lng: 'si', // default language is Sinhala
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
