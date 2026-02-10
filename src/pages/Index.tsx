import { useState } from 'react';
import { Stars } from '@/components/Stars';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { DailyWelcome } from '@/components/DailyWelcome';
import { HomeView } from '@/components/views/HomeView';
import { QuranView } from '@/components/views/QuranView';
import { AdhkarView } from '@/components/views/AdhkarView';
import { TasbeehView } from '@/components/views/TasbeehView';
import { SettingsView } from '@/components/views/SettingsView';
import { AccountabilityView } from '@/components/views/AccountabilityView';
import { WeeklySummaryView } from '@/components/views/WeeklySummaryView';
import { FavoritesView } from '@/components/views/FavoritesView';
import { useSettings } from '@/hooks/useSettings';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings' | 'summary' | 'favorites';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  useSettings();

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'quran':
        return <QuranView />;
      case 'adhkar':
        return <AdhkarView />;
      case 'tasbeeh':
        return <TasbeehView />;
      case 'accountability':
        return <AccountabilityView />;
      case 'settings':
        return <SettingsView />;
      case 'summary':
        return <WeeklySummaryView />;
      case 'favorites':
        return <FavoritesView />;
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-night relative">
      <Stars />
      <DailyWelcome />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-6 pb-28">
          {renderView()}
        </main>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;