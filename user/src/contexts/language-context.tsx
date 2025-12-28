import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = ['nl', 'en', 'es', 'pt', 'de'];
const DEFAULT_LANGUAGE = 'nl';

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Language Context Provider
 * 
 * This provides a structure for language switching without auto-translation.
 * The structure supports future translation implementation.
 * 
 * Usage:
 * - Language preference is stored in localStorage
 * - Current language can be accessed via useLanguage hook
 * - Translation function (t) is a placeholder for future i18n implementation
 * 
 * To add translations later:
 * 1. Create translation files: /locales/nl.json, /locales/en.json, etc.
 * 2. Load translations based on currentLanguage
 * 3. Update the t() function to return actual translations
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // Load saved language preference on mount
    if (process.browser) {
      const savedLang = localStorage.getItem('preferred_language');
      if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
        setCurrentLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setCurrentLanguageState(lang);
      if (process.browser) {
        localStorage.setItem('preferred_language', lang);
        // Dispatch custom event for components that need to react to language changes
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
      }
    }
  };

  // Translation function - placeholder for future i18n implementation
  // Currently returns the fallback or key as-is
  const t = (key: string, fallback?: string): string => {
    // TODO: Implement actual translation lookup
    // For now, return fallback or key
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Get current language code
 */
export function getCurrentLanguage(): string {
  if (process.browser) {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      return savedLang;
    }
  }
  return DEFAULT_LANGUAGE;
}

