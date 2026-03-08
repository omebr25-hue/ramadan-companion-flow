import { useState, useEffect } from 'react';
import { Clock, Sunrise, Sun, Sunset, Moon, RefreshCw, MapPin, Pencil, Check, RotateCcw } from 'lucide-react';
import { usePrayerTimes, PrayerTimesData } from '@/hooks/usePrayerTimes';
import { useSettings } from '@/hooks/useSettings';

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
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [timeToNext, setTimeToNext] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<Partial<PrayerTimesData>>({});
  const { prayerTimes, loading, error, refetch, updatePrayerTime, resetOverrides, hasOverrides } = usePrayerTimes();
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let found = false;

    for (const prayer of prayers) {
      const timeStr = prayerTimes[prayer.key as keyof PrayerTimesData];
      if (!timeStr) continue;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentMinutes) {
        setNextPrayer(prayer.key);
        const diff = prayerMinutes - currentMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeToNext(h > 0 ? `${h} ساعة و ${m} دقيقة` : `${m} دقيقة`);
        found = true;
        break;
      }
    }

    if (!found) {
      setNextPrayer('fajr');
      const [fh, fm] = (prayerTimes.fajr || '05:00').split(':').map(Number);
      const fajrTomorrow = (24 * 60 - currentMinutes) + fh * 60 + fm;
      const h = Math.floor(fajrTomorrow / 60);
      const m = fajrTomorrow % 60;
      setTimeToNext(`${h} ساعة و ${m} دقيقة`);
    }
  }, [currentTime, prayerTimes]);

  const handleEnterEdit = () => {
    if (prayerTimes) {
      setEditValues({ ...prayerTimes });
    }
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    Object.entries(editValues).forEach(([key, value]) => {
      if (value && prayerTimes && value !== prayerTimes[key as keyof PrayerTimesData]) {
        // Only save if actually changed from current
      }
      if (value) {
        updatePrayerTime(key as keyof PrayerTimesData, value);
      }
    });
    setEditMode(false);
  };

  const handleResetOverrides = () => {
    resetOverrides();
    setEditMode(false);
  };

  if (loading && !prayerTimes) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-center gap-2 py-8">
          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          <span className="text-muted-foreground text-sm">جارٍ تحميل المواقيت...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">مواقيت الصلاة</h2>
          {!editMode && (
            <>
              <button onClick={refetch} className="p-1 rounded-lg hover:bg-secondary/50 transition-all">
                <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={handleEnterEdit} className="p-1 rounded-lg hover:bg-secondary/50 transition-all">
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </>
          )}
          {editMode && (
            <>
              <button onClick={handleSaveEdit} className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-all">
                <Check className="w-3.5 h-3.5 text-primary" />
              </button>
              {hasOverrides && (
                <button onClick={handleResetOverrides} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-all" title="إعادة للمواقيت التلقائية">
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">
            {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center justify-center gap-1.5 mb-4 text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-xs">{settings.city}، {settings.country}</span>
        {hasOverrides && !editMode && (
          <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">معدّل يدوياً</span>
        )}
      </div>

      {editMode && (
        <p className="text-xs text-center text-accent mb-3">✏️ اضغط على الوقت لتعديله</p>
      )}

      {error && <p className="text-xs text-center text-destructive mb-3">{error}</p>}

      {/* Next Prayer Highlight */}
      {nextPrayer && !editMode && (
        <div className="bg-primary/10 rounded-xl p-4 mb-5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">الصلاة القادمة</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {prayers.find(p => p.key === nextPrayer)?.name}
            </span>
            <div className="text-left">
              <span className="text-lg font-mono font-bold text-primary">
                {prayerTimes?.[nextPrayer as keyof PrayerTimesData]}
              </span>
              <p className="text-xs text-muted-foreground">بعد {timeToNext}</p>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-3 gap-3">
        {prayers.map((prayer) => {
          const Icon = prayer.icon;
          const isNext = prayer.key === nextPrayer;
          const time = prayerTimes?.[prayer.key as keyof PrayerTimesData] || '--:--';
          
          return (
            <div
              key={prayer.key}
              className={`
                flex flex-col items-center p-3 rounded-xl transition-all
                ${editMode
                  ? 'bg-secondary/70 border border-dashed border-primary/30'
                  : isNext 
                    ? 'bg-primary/20 border border-primary/30 scale-105' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }
              `}
            >
              <Icon className={`w-5 h-5 mb-2 ${isNext && !editMode ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${isNext && !editMode ? 'text-primary' : 'text-foreground'}`}>
                {prayer.name}
              </span>
              {editMode ? (
                <input
                  type="time"
                  value={editValues[prayer.key as keyof PrayerTimesData] || time}
                  onChange={(e) => setEditValues(prev => ({ ...prev, [prayer.key]: e.target.value }))}
                  className="w-full mt-1 text-center text-sm font-mono bg-background/50 rounded-lg p-1 border border-primary/20 text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <span className={`text-sm font-mono mt-1 ${isNext ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {time}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
