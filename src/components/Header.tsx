import { Moon, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppMode } from '@/hooks/useAppMode';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { mode, appName } = useAppMode();

  const getHijriDate = () => {
    const today = new Date();
    const hijriMonth = mode === 'ramadan' ? 'رمضان' : 'شوال';
    const day = today.getDate();
    return `${day} ${hijriMonth} ١٤٤٦`;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              {mode === 'ramadan' ? (
                <Moon className="w-7 h-7 text-primary animate-pulse-glow" />
              ) : (
                <Star className="w-7 h-7 text-primary" />
              )}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">{appName}</h1>
              <p className="text-xs text-muted-foreground">{getHijriDate()}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onSettingsClick} className="hover:bg-secondary">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
