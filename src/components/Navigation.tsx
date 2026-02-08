import { Home, BookOpen, Sparkles, CircleDot, Settings, ClipboardCheck } from 'lucide-react';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings';

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
  { id: 'settings' as TabType, label: 'الإعدادات', icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50">
      <div className="container mx-auto px-2">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center py-2 px-2 rounded-xl transition-all
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-full transition-all
                  ${isActive ? 'bg-primary/20' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
