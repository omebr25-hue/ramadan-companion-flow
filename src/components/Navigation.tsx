import { Home, BookOpen, Sparkles, CircleDot, ClipboardCheck, BarChart3, Heart, Settings } from 'lucide-react';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings' | 'summary' | 'favorites';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'الرئيسية', icon: Home },
  { id: 'quran' as TabType, label: 'القرآن', icon: BookOpen },
  { id: 'adhkar' as TabType, label: 'الأذكار', icon: Sparkles },
  { id: 'tasbeeh' as TabType, label: 'المسبحة', icon: CircleDot },
  { id: 'accountability' as TabType, label: 'المحاسبة', icon: ClipboardCheck },
  { id: 'summary' as TabType, label: 'الملخص', icon: BarChart3 },
  { id: 'favorites' as TabType, label: 'المفضلة', icon: Heart },
  { id: 'settings' as TabType, label: 'الإعدادات', icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="container mx-auto px-1">
        <div className="flex justify-around py-1.5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center py-1.5 px-1.5 rounded-xl transition-all min-w-0 flex-shrink-0
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-full transition-all
                  ${isActive ? 'bg-primary/20' : ''}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] mt-0.5 font-medium leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}