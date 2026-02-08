import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { CountdownCard } from '@/components/CountdownCard';
import { QuranWirdCard } from '@/components/QuranWirdCard';
import { AdhkarCard } from '@/components/AdhkarCard';
import { WorshipTrackerCard } from '@/components/WorshipTrackerCard';
import { EnergySelector } from '@/components/EnergySelector';
import { ClipboardCheck, BookOpen, Sparkles, Settings } from 'lucide-react';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-6">
      {/* Spiritual Greeting */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">السلام عليكم</h2>
        <p className="text-muted-foreground">رمضان كريم، تقبل الله منا ومنكم</p>
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
          <div className="w-12 h-12 rounded-full bg-emerald/20 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-emerald" />
          </div>
          <span className="text-sm font-medium text-foreground">المحاسبة اليومية</span>
          <span className="text-xs text-muted-foreground">راجع عباداتك</span>
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
