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
import { CalendarView } from '@/components/views/CalendarView';
import { useSettings } from '@/hooks/useSettings';
import { useNotifications } from '@/hooks/useNotifications';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings' | 'summary' | 'favorites' | 'calendar';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  useSettings();
  useNotifications(); // تفعيل نظام الإشعارات

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigate={setActiveTab} />;
      case 'quran': return <QuranView />;
      case 'adhkar': return <AdhkarView />;
      case 'tasbeeh': return <TasbeehView />;
      case 'accountability': return <AccountabilityView />;
      case 'settings': return <SettingsView />;
      case 'summary': return <WeeklySummaryView />;
      case 'favorites': return <FavoritesView />;
      case 'calendar': return <CalendarView />;
      default: return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-night relative">
      <Stars />
      <DailyWelcome />
      
      <div className="relative z-10">
        <Header onMenuToggle={() => setMenuOpen(o => !o)} />
        
        <main className="container mx-auto px-4 py-6 pb-8">
          {renderView()}
        </main>
        
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={menuOpen}
          onToggle={() => setMenuOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
