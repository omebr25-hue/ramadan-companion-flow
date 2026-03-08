import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { CountdownCard } from '@/components/CountdownCard';
import { QuranWirdCard } from '@/components/QuranWirdCard';
import { AdhkarCard } from '@/components/AdhkarCard';
import { WorshipTrackerCard } from '@/components/WorshipTrackerCard';
import { EnergySelector } from '@/components/EnergySelector';
import { ClipboardCheck, Settings, BarChart3, Heart } from 'lucide-react';
import { useQuranWird } from '@/hooks/useQuranWird';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAppMode } from '@/hooks/useAppMode';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings' | 'summary' | 'favorites' | 'calendar';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { getProgress } = useQuranWird();
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  const [dailyIntention] = useLocalStorage<string>(`intention-${today}`, '');
  const { mode, greeting } = useAppMode();

  const motivationalQuotes = mode === 'ramadan' 
    ? { text: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ', source: 'سورة البقرة - آية ١٨٥' }
    : { text: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ', source: 'سورة الطلاق - آية ٢-٣' };

  return (
    <div className="space-y-5">
      {/* Spiritual Greeting */}
      <div className="text-center py-3">
        <h2 className="text-2xl font-bold gradient-text mb-1">{greeting}</h2>
        <p className="text-muted-foreground text-sm">
          {mode === 'ramadan' ? 'رمضان كريم، تقبل الله منا ومنكم' : 'تقبل الله طاعاتكم'}
        </p>
      </div>

      {dailyIntention && (
        <div className="glass-card p-3 text-center border border-accent/20 bg-accent/5">
          <p className="text-xs text-muted-foreground mb-0.5">✨ نيّة اليوم</p>
          <p className="text-foreground font-medium text-sm">{dailyIntention}</p>
        </div>
      )}

      {/* Quran Progress */}
      <div className="glass-card p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">تقدم الختمة</span>
          <span className="text-xs font-bold text-primary">{progress.percentage}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1">{progress.read} / {progress.total} صفحة</p>
      </div>

      <EnergySelector />

      <div className="grid gap-4 md:grid-cols-2">
        <PrayerTimesCard />
        {mode === 'ramadan' && <CountdownCard />}
      </div>

      <QuranWirdCard onViewDetails={() => onNavigate('quran')} />
      <AdhkarCard onViewDetails={() => onNavigate('adhkar')} />
      <WorshipTrackerCard />

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate('accountability')} className="glass-card p-3 flex flex-col items-center gap-1.5 hover:bg-secondary/50 transition-all">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs font-medium text-foreground">المحاسبة اليومية</span>
        </button>
        <button onClick={() => onNavigate('summary')} className="glass-card p-3 flex flex-col items-center gap-1.5 hover:bg-secondary/50 transition-all">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground">الملخص الأسبوعي</span>
        </button>
        <button onClick={() => onNavigate('favorites')} className="glass-card p-3 flex flex-col items-center gap-1.5 hover:bg-secondary/50 transition-all">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs font-medium text-foreground">المفضلة والأدعية</span>
        </button>
        <button onClick={() => onNavigate('settings')} className="glass-card p-3 flex flex-col items-center gap-1.5 hover:bg-secondary/50 transition-all">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground">الإعدادات</span>
        </button>
      </div>

      <div className="glass-card p-4 text-center">
        <p className="font-quran text-base text-foreground mb-1">"{motivationalQuotes.text}"</p>
        <p className="text-xs text-muted-foreground">{motivationalQuotes.source}</p>
      </div>
    </div>
  );
}
