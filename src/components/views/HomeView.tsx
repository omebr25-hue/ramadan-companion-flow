import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { CountdownCard } from '@/components/CountdownCard';
import { QuranWirdCard } from '@/components/QuranWirdCard';
import { AdhkarCard } from '@/components/AdhkarCard';
import { WorshipTrackerCard } from '@/components/WorshipTrackerCard';
import { EnergySelector } from '@/components/EnergySelector';
import { ClipboardCheck, BookOpen, Sparkles, Settings, BarChart3, Heart } from 'lucide-react';
import { useQuranWird } from '@/hooks/useQuranWird';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings' | 'summary' | 'favorites';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { getProgress } = useQuranWird();
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  const [dailyIntention] = useLocalStorage<string>(`intention-${today}`, '');

  return (
    <div className="space-y-6">
      {/* Spiritual Greeting */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">السلام عليكم</h2>
        <p className="text-muted-foreground">رمضان كريم، تقبل الله منا ومنكم</p>
      </div>

      {/* Daily Intention (if set) */}
      {dailyIntention && (
        <div className="glass-card p-4 text-center border border-accent/20 bg-accent/5">
          <p className="text-xs text-muted-foreground mb-1">✨ نيّة اليوم</p>
          <p className="text-foreground font-medium text-sm">{dailyIntention}</p>
        </div>
      )}

      {/* Quran Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">تقدم الختمة</span>
          <span className="text-sm font-bold text-primary">{progress.percentage}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">{progress.read} / {progress.total} صفحة</p>
      </div>

      {/* Energy Selector */}
      <EnergySelector />

      {/* Prayer Times & Countdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <PrayerTimesCard />
        <CountdownCard />
      </div>

      {/* Quran Wird */}
      <QuranWirdCard onViewDetails={() => onNavigate('quran')} />

      {/* Adhkar */}
      <AdhkarCard onViewDetails={() => onNavigate('adhkar')} />

      {/* Worship Tracker */}
      <WorshipTrackerCard />

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('accountability')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">المحاسبة اليومية</span>
          <span className="text-xs text-muted-foreground">راجع عباداتك</span>
        </button>

        <button
          onClick={() => onNavigate('summary')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">الملخص الأسبوعي</span>
          <span className="text-xs text-muted-foreground">إحصائيات أدائك</span>
        </button>

        <button
          onClick={() => onNavigate('favorites')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">المفضلة والأدعية</span>
          <span className="text-xs text-muted-foreground">أدعيتك الخاصة</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">الإعدادات</span>
          <span className="text-xs text-muted-foreground">خصص تجربتك</span>
        </button>
      </div>

      {/* Motivational Quote */}
      <div className="glass-card p-6 text-center">
        <p className="font-quran text-lg text-foreground mb-2">
          "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ"
        </p>
        <p className="text-sm text-muted-foreground">سورة البقرة - آية ١٨٥</p>
      </div>
    </div>
  );
}