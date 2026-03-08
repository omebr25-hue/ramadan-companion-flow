import { Home, BookOpen, Sparkles, CircleDot, ClipboardCheck, BarChart3, Heart, Settings, CalendarDays, X, Menu } from 'lucide-react';

type TabType = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'accountability' | 'settings' | 'summary' | 'favorites' | 'calendar';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'الرئيسية', icon: Home },
  { id: 'quran' as TabType, label: 'القرآن', icon: BookOpen },
  { id: 'adhkar' as TabType, label: 'الأذكار', icon: Sparkles },
  { id: 'tasbeeh' as TabType, label: 'المسبحة', icon: CircleDot },
  { id: 'calendar' as TabType, label: 'التقويم', icon: CalendarDays },
  { id: 'accountability' as TabType, label: 'المحاسبة', icon: ClipboardCheck },
  { id: 'summary' as TabType, label: 'الملخص', icon: BarChart3 },
  { id: 'favorites' as TabType, label: 'المفضلة', icon: Heart },
  { id: 'settings' as TabType, label: 'الإعدادات', icon: Settings },
];

export function Navigation({ activeTab, onTabChange, isOpen, onToggle }: NavigationProps) {
  const handleTabClick = (tab: TabType) => {
    onTabChange(tab);
    onToggle();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-[70] w-64 bg-background/95 backdrop-blur-xl
          border-l border-border/50 shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-base font-bold gradient-text">القائمة</h2>
          <button onClick={onToggle} className="p-2 rounded-xl hover:bg-secondary/50 transition-all">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-64px)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right
                  ${isActive
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-secondary/50'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Trigger button to use in header
export function MenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-2 rounded-xl hover:bg-secondary/50 transition-all">
      <Menu className="w-5 h-5 text-foreground" />
    </button>
  );
}
