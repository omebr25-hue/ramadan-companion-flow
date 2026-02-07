import { Moon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  // Get Hijri date (simplified - in production use a proper Hijri calendar library)
  const getHijriDate = () => {
    const today = new Date();
    const hijriMonth = 'رمضان';
    const day = today.getDate();
    return `${day} ${hijriMonth} ١٤٤٦`;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Moon className="w-8 h-8 text-primary animate-pulse-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">المرافق الرمضاني</h1>
              <p className="text-sm text-muted-foreground">{getHijriDate()}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
            className="hover:bg-secondary"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
