import { useState, useEffect, useCallback } from 'react';
import { useSettings } from './useSettings';

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// خريطة المدن مع الإحداثيات
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'صنعاء': { lat: 15.3694, lng: 44.1910 },
  'عدن': { lat: 12.7855, lng: 45.0187 },
  'تعز': { lat: 13.5789, lng: 44.0219 },
  'الحديدة': { lat: 14.7979, lng: 42.9540 },
  'إب': { lat: 13.9667, lng: 44.1667 },
  'ذمار': { lat: 14.5500, lng: 44.4000 },
  'المكلا': { lat: 14.5400, lng: 49.1240 },
  'مكة المكرمة': { lat: 21.4225, lng: 39.8262 },
  'المدينة المنورة': { lat: 24.4672, lng: 39.6112 },
  'الرياض': { lat: 24.7136, lng: 46.6753 },
  'جدة': { lat: 21.5433, lng: 39.1728 },
  'القاهرة': { lat: 30.0444, lng: 31.2357 },
  'الإسكندرية': { lat: 31.2001, lng: 29.9187 },
  'دبي': { lat: 25.2048, lng: 55.2708 },
  'أبوظبي': { lat: 24.4539, lng: 54.3773 },
  'عمّان': { lat: 31.9454, lng: 35.9284 },
  'بغداد': { lat: 33.3152, lng: 44.3661 },
  'الدوحة': { lat: 25.2854, lng: 51.5310 },
  'الكويت': { lat: 29.3759, lng: 47.9774 },
  'مسقط': { lat: 23.5880, lng: 58.3829 },
  'المنامة': { lat: 26.2285, lng: 50.5860 },
  'بيروت': { lat: 33.8938, lng: 35.5018 },
  'دمشق': { lat: 33.5138, lng: 36.2765 },
  'الخرطوم': { lat: 15.5007, lng: 32.5599 },
  'طرابلس': { lat: 32.8872, lng: 13.1913 },
  'تونس': { lat: 36.8065, lng: 10.1815 },
  'الرباط': { lat: 34.0209, lng: -6.8416 },
  'الجزائر': { lat: 36.7538, lng: 3.0588 },
  'إسطنبول': { lat: 41.0082, lng: 28.9784 },
  'جاكرتا': { lat: -6.2088, lng: 106.8456 },
  'كوالالمبور': { lat: 3.1390, lng: 101.6869 },
  'لندن': { lat: 51.5074, lng: -0.1278 },
};

// طرق الحساب
const calculationMethods: Record<string, number> = {
  'UmmAlQura': 4,
  'Egyptian': 5,
  'Karachi': 1,
  'ISNA': 2,
  'MWL': 3,
  'Tehran': 7,
  'Jafari': 0,
  'Gulf': 8,
  'Kuwait': 9,
  'Qatar': 10,
  'Singapore': 11,
  'Turkey': 13,
};

export function usePrayerTimes() {
  const { settings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = cityCoordinates[settings.city];
      const method = calculationMethods[settings.calculationMethod] ?? 4;
      
      if (coords) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${coords.lat}&longitude=${coords.lng}&method=${method}`
        );
        
        if (!response.ok) throw new Error('فشل في جلب المواقيت');
        
        const data = await response.json();
        const timings = data.data.timings;
        
        setPrayerTimes({
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        });
      } else {
        // إذا لم نجد إحداثيات المدينة، نستخدم API بالاسم
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(settings.city)}&country=${encodeURIComponent(settings.country)}&method=${method}`
        );
        
        if (!response.ok) throw new Error('فشل في جلب المواقيت');
        
        const data = await response.json();
        const timings = data.data.timings;
        
        setPrayerTimes({
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        });
      }
    } catch (err) {
      setError('تعذر جلب المواقيت، تحقق من الاتصال');
      // Fallback times
      setPrayerTimes({
        fajr: '05:07',
        sunrise: '06:20',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:10',
        isha: '19:25',
      });
    } finally {
      setLoading(false);
    }
  }, [settings.city, settings.country, settings.calculationMethod]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  return { prayerTimes, loading, error, refetch: fetchPrayerTimes };
}
