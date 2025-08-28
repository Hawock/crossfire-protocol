import i18next from "i18next";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export async function initI18n(locale: 'en' | 'ru' = 'en') {
  await i18next.init({
    lng: locale,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ru: { translation: ru }
    }
  });
}

export function t(key: string, options?: any): string {
  return i18next.t(key, options) as string;
}

export function setLocale(locale: 'en' | 'ru') {
  i18next.changeLanguage(locale);
}

export function getLocale() {
  return i18next.language;
}