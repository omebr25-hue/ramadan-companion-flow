import { ChevronLeft, Sunrise, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdhkar } from '@/hooks/useAdhkar';

interface AdhkarCardProps {
  onViewDetails?: () => void;
}

export function AdhkarCard({ onViewDetails }: AdhkarCardProps) {
  const { getCategoryProgress, getTotalDailyProgress } = useAdhkar();
  const morningProgress = getCategoryProgress('morning');
  const eveningProgress = getCategoryProgress('evening');
  const totalProgress = getTotalDailyProgress();

  // Determine if it's morning or evening
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 4 && currentHour < 16;

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">الأذكار اليومية</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewDetails}
          className="text-muted-foreground hover:text-foreground"
        >
          عرض الكل
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>

      {/* Morning / Evening Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <AdhkarTypeCard
          title="أذكار الصباح"
          icon={Sunrise}
          progress={morningProgress}
          isActive={isMorning}
          color="primary"
        />
        <AdhkarTypeCard
          title="أذكار المساء"
          icon={Moon}
          progress={eveningProgress}
          isActive={!isMorning}
          color="accent"
        />
      </div>

      {/* Total Daily Progress */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">إجمالي التقدم اليومي</span>
          <span className="text-sm font-medium text-foreground">
            {totalProgress.completed} / {totalProgress.total}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${totalProgress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface AdhkarTypeCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: { completed: number; total: number; percentage: number };
  isActive: boolean;
  color: 'primary' | 'accent';
}

function AdhkarTypeCard({ title, icon: Icon, progress, isActive, color }: AdhkarTypeCardProps) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary/10',
      border: isActive ? 'border-primary/50' : 'border-transparent',
      icon: 'text-primary',
      progress: 'bg-primary',
    },
    accent: {
      bg: 'bg-accent/10',
      border: isActive ? 'border-accent/50' : 'border-transparent',
      icon: 'text-accent',
      progress: 'bg-accent',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-xl p-4 border-2 ${classes.border} transition-all`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${classes.icon}`} />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-foreground">{progress.completed}</span>
          <span className="text-sm text-muted-foreground"> / {progress.total}</span>
        </div>
        {progress.completed === progress.total && progress.total > 0 && (
          <span className="text-lg">✓</span>
        )}
      </div>
      
      <div className="h-1 rounded-full bg-secondary mt-3">
        <div 
          className={`h-full rounded-full ${classes.progress} transition-all`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
