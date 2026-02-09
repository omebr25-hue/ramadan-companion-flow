import { useLocalStorage } from './useLocalStorage';
import { useCallback, useEffect } from 'react';

export interface AppSettings {
  // المظهر
  theme: 'dark' | 'light' | 'auto';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  
  // الموقع
  city: string;
  country: string;
  calculationMethod: string;
  
  // التنبيهات
  notifications: {
    enabled: boolean;
    prayerTimes: boolean;
    prayerReminder: number;
    quranWird: boolean;
    quranWirdTime: string;
    morningAdhkar: boolean;
    morningAdhkarTime: string;
    eveningAdhkar: boolean;
    eveningAdhkarTime: string;
    iftarReminder: boolean;
    iftarReminderTime: number;
    suhoorReminder: boolean;
    suhoorReminderTime: number;
    doNotDisturb: boolean;
    doNotDisturbStart: string;
    doNotDisturbEnd: string;
  };
  
  // القرآن
  quran: {
    displayMode: 'page' | 'surah' | 'ayah';
    showTranslation: boolean;
    translationLanguage: string;
  };
  
  // العشر الأواخر
  lastTenDays: {
    enabled: boolean;
    multiplier: number;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  fontSize: 'medium',
  city: 'صنعاء',
  country: 'اليمن',
  calculationMethod: 'UmmAlQura',
  notifications: {
    enabled: true,
    prayerTimes: true,
    prayerReminder: 10,
    quranWird: true,
    quranWirdTime: '09:00',
    morningAdhkar: true,
    morningAdhkarTime: '06:00',
    eveningAdhkar: true,
    eveningAdhkarTime: '17:00',
    iftarReminder: true,
    iftarReminderTime: 15,
    suhoorReminder: true,
    suhoorReminderTime: 30,
    doNotDisturb: true,
    doNotDisturbStart: '23:00',
    doNotDisturbEnd: '05:00',
  },
  quran: {
    displayMode: 'page',
    showTranslation: false,
    translationLanguage: 'ar',
  },
  lastTenDays: {
    enabled: false,
    multiplier: 1.5,
  },
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', DEFAULT_SETTINGS);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateNotifications = (updates: Partial<AppSettings['notifications']>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  };

  const updateQuranSettings = (updates: Partial<AppSettings['quran']>) => {
    setSettings(prev => ({
      ...prev,
      quran: { ...prev.quran, ...updates },
    }));
  };

  const updateLastTenDays = (updates: Partial<AppSettings['lastTenDays']>) => {
    setSettings(prev => ({
      ...prev,
      lastTenDays: { ...prev.lastTenDays, ...updates },
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // تطبيق الثيم مباشرة بناءً على القيمة المحددة
  const applyTheme = useCallback((themeOverride?: 'dark' | 'light' | 'auto') => {
    const theme = themeOverride || settings.theme;
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'dark') {
      root.classList.remove('light');
    } else {
      // auto: detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.remove('light');
      } else {
        root.classList.add('light');
      }
    }
  }, [settings.theme]);

  // تطبيق الثيم عند تغييره
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const getFontSizeClass = () => {
    const sizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xlarge: 'text-xl',
    };
    return sizes[settings.fontSize];
  };

  const getQuranFontSize = () => {
    const sizes = {
      small: '1.25rem',
      medium: '1.5rem',
      large: '2rem',
      xlarge: '2.5rem',
    };
    return sizes[settings.fontSize];
  };

  return {
    settings,
    updateSettings,
    updateNotifications,
    updateQuranSettings,
    updateLastTenDays,
    resetSettings,
    applyTheme,
    getFontSizeClass,
    getQuranFontSize,
  };
}
