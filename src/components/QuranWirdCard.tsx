import { BookOpen, Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuranWird } from '@/hooks/useQuranWird';

interface QuranWirdCardProps {
  onViewDetails?: () => void;
}

export function QuranWirdCard({ onViewDetails }: QuranWirdCardProps) {
  const { todayWird, markWirdAsComplete, getProgress, getPageInfo } = useQuranWird();
  const progress = getProgress();
  const startInfo = getPageInfo(todayWird.startPage);
  const endInfo = getPageInfo(todayWird.endPage);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-accent/20">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">ورد القرآن اليومي</h2>
            <p className="text-sm text-muted-foreground">
              {todayWird.totalPages} صفحة اليوم
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewDetails}
          className="text-muted-foreground hover:text-foreground"
        >
          التفاصيل
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>

      {/* Today's Reading Range */}
      <div className="bg-secondary/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">من</span>
          <span className="text-sm text-muted-foreground">إلى</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">صفحة {todayWird.startPage}</p>
            <p className="text-xs text-accent">{startInfo.surahName}</p>
          </div>
          <div className="flex-1 mx-4 h-0.5 bg-border relative">
            <div 
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-accent to-primary rounded-full"
              style={{ width: `${(todayWird.readPages / todayWird.totalPages) * 100}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">صفحة {todayWird.endPage}</p>
            <p className="text-xs text-accent">{endInfo.surahName}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">تقدم اليوم</span>
          <span className="text-accent font-medium">
            {todayWird.readPages} / {todayWird.totalPages} صفحة
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(todayWird.readPages / todayWird.totalPages) * 100}%` }}
          />
        </div>
      </div>

      {/* Complete Button */}
      {!todayWird.isCompleted ? (
        <Button 
          onClick={markWirdAsComplete}
          className="w-full bg-gradient-to-l from-accent to-emerald-dim text-accent-foreground hover:opacity-90"
        >
          <Check className="w-5 h-5 ml-2" />
          تمّت القراءة
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 p-3 bg-accent/20 rounded-xl border border-accent/30">
          <Check className="w-5 h-5 text-accent" />
          <span className="text-accent font-medium">أتممت ورد اليوم - بارك الله فيك</span>
        </div>
      )}

      {/* Overall Progress */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">التقدم الكلي</span>
          <span className="text-primary font-medium">{progress.percentage}%</span>
        </div>
        <div className="progress-bar mt-2">
          <div 
            className="h-full rounded-full bg-primary/70"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {progress.read} من {progress.total} صفحة
        </p>
      </div>
    </div>
  );
}
