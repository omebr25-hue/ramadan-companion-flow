import { useState } from 'react';
import { Stars } from '@/components/Stars';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { HomeView } from '@/components/views/HomeView';
import { QuranView } from '@/components/views/QuranView';
import { AdhkarView } from '@/components/views/AdhkarView';
import { TasbeehView } from '@/components/views/TasbeehView';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

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
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-night relative">
      <Stars />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-6 pb-24">
          {renderView()}
        </main>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
