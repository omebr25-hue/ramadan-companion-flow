import { useState } from 'react';
import { ChevronLeft, Check, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdhkar } from '@/hooks/useAdhkar';
import { DhikrCategory, Dhikr } from '@/types/ramadan';

export function AdhkarView() {
  const { 
    adhkarCategories, 
    getAdhkarByCategory, 
    getDhikrProgress, 
    incrementDhikr,
    resetDhikr,
    getCategoryProgress 
  } = useAdhkar();
  
  const [selectedCategory, setSelectedCategory] = useState<DhikrCategory | null>(null);
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);

  // Dhikr Detail View
  if (selectedDhikr) {
    const progress = getDhikrProgress(selectedDhikr.id);
    const currentCount = progress?.currentCount || 0;
    const isComplete = currentCount >= selectedDhikr.count;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDhikr(null)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">الذكر</h2>
        </div>

        <div className="glass-card p-6">
          <p className="text-xl leading-loose font-arabic text-foreground mb-6 text-center">
            {selectedDhikr.text}
          </p>

          {/* Counter */}
          <button
            onClick={() => incrementDhikr(selectedDhikr)}
            disabled={isComplete}
            className={`
              relative w-40 h-40 mx-auto mb-6 rounded-full 
              flex items-center justify-center transition-all
              ${isComplete 
                ? 'bg-accent/20 cursor-default' 
                : 'bg-gradient-to-br from-primary to-gold-dim active:scale-95 cursor-pointer'
              }
            `}
          >
            <div className="text-center">
              <span className={`text-5xl font-bold ${isComplete ? 'text-accent' : 'text-primary-foreground'}`}>
                {currentCount}
              </span>
              <p className={`text-sm ${isComplete ? 'text-accent' : 'text-primary-foreground/80'}`}>
                / {selectedDhikr.count}
              </p>
            </div>
          </button>

          {isComplete && (
            <div className="text-center p-3 bg-accent/20 rounded-xl border border-accent/30 mb-4">
              <p className="text-accent font-medium">✓ تم إكمال الذكر</p>
            </div>
          )}

          {/* Source */}
          <div className="bg-secondary/50 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">المصدر</span>
            </div>
            <p className="text-sm text-foreground">{selectedDhikr.source}</p>
            {selectedDhikr.hadithGrade && (
              <span className="inline-block mt-2 px-2 py-1 bg-accent/20 rounded text-xs text-accent">
                {selectedDhikr.hadithGrade}
              </span>
            )}
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={() => resetDhikr(selectedDhikr.id)}
            className="w-full mt-4"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة العداد
          </Button>
        </div>
      </div>
    );
  }

  // Category View
  if (selectedCategory) {
    const categoryAdhkar = getAdhkarByCategory(selectedCategory);
    const categoryInfo = adhkarCategories.find(c => c.id === selectedCategory);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{categoryInfo?.name}</h2>
            <p className="text-sm text-muted-foreground">{categoryAdhkar.length} ذكر</p>
          </div>
        </div>

        <div className="space-y-3">
          {categoryAdhkar.map((dhikr) => {
            const progress = getDhikrProgress(dhikr.id);
            const isComplete = progress?.isCompleted || false;
            const currentCount = progress?.currentCount || 0;

            return (
              <button
                key={dhikr.id}
                onClick={() => setSelectedDhikr(dhikr)}
                className={`
                  w-full text-right p-4 rounded-xl transition-all
                  ${isComplete 
                    ? 'bg-accent/10 border border-accent/30' 
                    : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className={`font-arabic leading-relaxed ${isComplete ? 'text-accent' : 'text-foreground'}`}>
                      {dhikr.text.length > 100 ? dhikr.text.substring(0, 100) + '...' : dhikr.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      التكرار: {dhikr.count} مرة
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    {isComplete ? (
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-accent" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium text-foreground">
                          {currentCount}/{dhikr.count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Categories List
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">الأذكار</h2>
        <p className="text-sm text-muted-foreground">أذكار من حصن المسلم</p>
      </div>

      <div className="grid gap-4">
        {adhkarCategories.map((category) => {
          const progress = getCategoryProgress(category.id as DhikrCategory);

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as DhikrCategory)}
              className="glass-card p-5 text-right hover:bg-secondary/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.count} ذكر</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-primary">
                    {progress.completed}/{progress.total}
                  </span>
                  {progress.completed === progress.total && progress.total > 0 && (
                    <Check className="w-4 h-4 text-accent mt-1" />
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 h-1 rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
