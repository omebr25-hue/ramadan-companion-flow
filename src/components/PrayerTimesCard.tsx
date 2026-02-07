import { useState, useEffect } from 'react';
import { Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { PrayerTimes } from '@/types/ramadan';

// Mock prayer times - in production, fetch from an API based on location
const mockPrayerTimes: PrayerTimes = {
  fajr: '04:45',
  sunrise: '06:10',
  dhuhr: '12:15',
  asr: '15:30',
  maghrib: '18:20',
  isha: '19:45',
};

const prayers = [
  { key: 'fajr', name: 'الفجر', icon: Moon },
  { key: 'sunrise', name: 'الشروق', icon: Sunrise },
  { key: 'dhuhr', name: 'الظهر', icon: Sun },
  { key: 'asr', name: 'العصر', icon: Sun },
  { key: 'maghrib', name: 'المغرب', icon: Sunset },
  { key: 'isha', name: 'العشاء', icon: Moon },
] as const;

export function PrayerTimesCard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string>('maghrib');
  const [timeToNext, setTimeToNext] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate next prayer and time remaining
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      const [hours, minutes] = mockPrayerTimes[prayer.key as keyof PrayerTimes].split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        setNextPrayer(prayer.key);
        const diff = prayerMinutes - currentMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeToNext(h > 0 ? `${h} ساعة و ${m} دقيقة` : `${m} دقيقة`);
        break;
      }
    }
  }, [currentTime]);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">مواقيت الصلاة</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">
            {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Next Prayer Highlight */}
      <div className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-1">الصلاة القادمة</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {prayers.find(p => p.key === nextPrayer)?.name}
          </span>
          <span className="text-sm text-muted-foreground">بعد {timeToNext}</span>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-3 gap-3">
        {prayers.map((prayer) => {
          const Icon = prayer.icon;
          const isNext = prayer.key === nextPrayer;
          
          return (
            <div
              key={prayer.key}
              className={`
                flex flex-col items-center p-3 rounded-xl transition-all
                ${isNext 
                  ? 'bg-primary/20 border border-primary/30 scale-105' 
                  : 'bg-secondary/50 hover:bg-secondary'
                }
              `}
            >
              <Icon className={`w-5 h-5 mb-2 ${isNext ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${isNext ? 'text-primary' : 'text-foreground'}`}>
                {prayer.name}
              </span>
              <span className={`text-sm font-mono mt-1 ${isNext ? 'text-primary' : 'text-muted-foreground'}`}>
                {mockPrayerTimes[prayer.key as keyof PrayerTimes]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
