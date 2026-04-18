import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {findBestLanguageTag} from 'react-native-localize';
import es from './locales/es.json';
import en from './locales/en.json';

const SUPPORTED_LANGS = ['es', 'en'] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: SupportedLang = 'es';

function detectLanguage(): SupportedLang {
  try {
    const best = findBestLanguageTag([...SUPPORTED_LANGS]);
    if (best && (SUPPORTED_LANGS as readonly string[]).includes(best.languageTag)) {
      return best.languageTag as SupportedLang;
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_LANG;
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      resources: {
        es: {translation: es},
        en: {translation: en},
      },
      lng: detectLanguage(),
      fallbackLng: DEFAULT_LANG,
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    });
}

export default i18n;
