import { Check } from 'lucide-react';
import { useWorshipTracker } from '@/hooks/useWorshipTracker';

const prayers = [
  { key: 'fajr', name: 'الفجر' },
  { key: 'dhuhr', name: 'الظهر' },
  { key: 'asr', name: 'العصر' },
  { key: 'maghrib', name: 'المغرب' },
  { key: 'isha', name: 'العشاء' },
] as const;

const extras = [
  { key: 'taraweeh', name: 'التراويح', icon: '🌙' },
  { key: 'tahajjud', name: 'التهجد', icon: '🤲' },
  { key: 'sadaqah', name: 'الصدقة', icon: '💝' },
] as const;

export function WorshipTrackerCard() {
  const { todayWorship, togglePrayer, toggleWorship, getDailyProgress } = useWorshipTracker();
  const progress = getDailyProgress();

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">متابع العبادات</h2>
        <span className="text-sm text-primary font-medium">{progress.percentage}%</span>
      </div>

      {/* Prayers */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">الصلوات</p>
        <div className="flex justify-between gap-2">
          {prayers.map((prayer) => (
            <button
              key={prayer.key}
              onClick={() => togglePrayer(prayer.key)}
              className={`
                flex-1 flex flex-col items-center p-3 rounded-xl transition-all
                ${todayWorship.prayers[prayer.key] 
                  ? 'bg-accent/20 border border-accent/30' 
                  : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all
                ${todayWorship.prayers[prayer.key] 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted'
                }
              `}>
                {todayWorship.prayers[prayer.key] ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs">○</span>
                )}
              </div>
              <span className={`text-xs font-medium ${
                todayWorship.prayers[prayer.key] ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {prayer.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Extra Worship */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">عبادات إضافية</p>
        <div className="grid grid-cols-3 gap-3">
          {extras.map((extra) => (
            <button
              key={extra.key}
              onClick={() => toggleWorship(extra.key)}
              className={`
                flex flex-col items-center p-4 rounded-xl transition-all
                ${todayWorship[extra.key] 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                }
              `}
            >
              <span className="text-2xl mb-2">{extra.icon}</span>
              <span className={`text-xs font-medium ${
                todayWorship[extra.key] ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {extra.name}
              </span>
              {todayWorship[extra.key] && (
                <Check className="w-4 h-4 text-primary mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {progress.completed} من {progress.total} عبادة
        </p>
      </div>
    </div>
  );
}
