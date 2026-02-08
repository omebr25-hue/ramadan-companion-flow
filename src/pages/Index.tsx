import { useState, useEffect } from 'react';
import { Stars } from '@/components/Stars';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { HomeView } from '@/components/views/HomeView';
import { QuranView } from '@/components/views/QuranView';
import { AdhkarView } from '@/components/views/AdhkarView';
import { TasbeehView } from '@/components/views/TasbeehView';
import { SettingsView } from '@/components/views/SettingsView';
import { AccountabilityView } from '@/components/views/AccountabilityView';
import { useSettings } from '@/hooks/useSettings';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { settings, applyTheme } = useSettings();

  // تطبيق الثيم عند تحميل الصفحة
  useEffect(() => {
    applyTheme();
  }, [settings.theme]);

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
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-night relative">
      <Stars />
      
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
