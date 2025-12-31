/**
 * i18n Configuration
 * Internationalization setup for Vietnamese and English
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./locales/vi.json";
import en from "./locales/en.json";

// Define resources
const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: "vi", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

export default i18n;

// Type-safe translation keys
export type TranslationKeys = keyof typeof vi;
