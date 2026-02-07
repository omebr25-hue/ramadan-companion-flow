import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { CountdownCard } from '@/components/CountdownCard';
import { QuranWirdCard } from '@/components/QuranWirdCard';
import { AdhkarCard } from '@/components/AdhkarCard';
import { WorshipTrackerCard } from '@/components/WorshipTrackerCard';
import { EnergySelector } from '@/components/EnergySelector';

interface HomeViewProps {
  onNavigate: (tab: 'quran' | 'adhkar') => void;
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
    </div>
  );
}
