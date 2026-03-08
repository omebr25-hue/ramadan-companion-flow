import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Check, RotateCcw, Info, ChevronRight as NextIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdhkar } from '@/hooks/useAdhkar';
import { DhikrCategory, Dhikr } from '@/types/ramadan';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CustomDhikr {
  id: string;
  text: string;
  count: number;
  category: string;
}

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
  const [selectedDhikrIndex, setSelectedDhikrIndex] = useState<number>(-1);
  const [autoAdvanced, setAutoAdvanced] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customAdhkar, setCustomAdhkar] = useLocalStorage<CustomDhikr[]>('custom-adhkar', []);
  const [newDhikrText, setNewDhikrText] = useState('');
  const [newDhikrCount, setNewDhikrCount] = useState(3);
  const [newDhikrCategory, setNewDhikrCategory] = useState('custom');

  const categoryAdhkar = selectedCategory ? getAdhkarByCategory(selectedCategory) : [];
  const selectedDhikr = selectedDhikrIndex >= 0 ? categoryAdhkar[selectedDhikrIndex] : null;

  const handleIncrement = useCallback((dhikr: Dhikr) => {
    incrementDhikr(dhikr);
  }, [incrementDhikr]);

  // Auto-advance
  useEffect(() => {
    if (!selectedDhikr || selectedDhikrIndex < 0) return;
    const progress = getDhikrProgress(selectedDhikr.id);
    const isComplete = (progress?.currentCount || 0) >= selectedDhikr.count;
    
    if (isComplete && selectedDhikrIndex < categoryAdhkar.length - 1) {
      const timer = setTimeout(() => {
        setSelectedDhikrIndex(prev => prev + 1);
        setAutoAdvanced(true);
        setTimeout(() => setAutoAdvanced(false), 1500);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedDhikr, getDhikrProgress, selectedDhikrIndex, categoryAdhkar.length]);

  const addCustomDhikr = () => {
    if (!newDhikrText.trim()) return;
    const newDhikr: CustomDhikr = {
      id: `custom-${Date.now()}`,
      text: newDhikrText.trim(),
      count: newDhikrCount,
      category: newDhikrCategory,
    };
    setCustomAdhkar(prev => [...prev, newDhikr]);
    setNewDhikrText('');
    setNewDhikrCount(3);
    setShowAddForm(false);
  };

  const deleteCustomDhikr = (id: string) => {
    setCustomAdhkar(prev => prev.filter(d => d.id !== id));
  };

  // Dhikr Detail View
  if (selectedDhikr) {
    const progress = getDhikrProgress(selectedDhikr.id);
    const currentCount = progress?.currentCount || 0;
    const isComplete = currentCount >= selectedDhikr.count;
    const isLast = selectedDhikrIndex >= categoryAdhkar.length - 1;
    const isFirst = selectedDhikrIndex <= 0;

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedDhikrIndex(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">الذكر</h2>
            <p className="text-xs text-muted-foreground">
              {selectedDhikrIndex + 1} من {categoryAdhkar.length}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" disabled={isFirst} onClick={() => setSelectedDhikrIndex(prev => prev - 1)}>
              <NextIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={isLast} onClick={() => setSelectedDhikrIndex(prev => prev + 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {autoAdvanced && (
          <div className="text-center p-2 bg-primary/10 rounded-xl border border-primary/30 animate-fade-in">
            <p className="text-primary text-sm font-medium">⬅ تم الانتقال للذكر التالي تلقائياً</p>
          </div>
        )}

        <div className="h-1.5 rounded-full bg-secondary flex gap-0.5">
          {categoryAdhkar.map((d, i) => {
            const p = getDhikrProgress(d.id);
            const done = p?.isCompleted || false;
            return (
              <div key={d.id} className={`flex-1 rounded-full transition-all ${i === selectedDhikrIndex ? 'bg-primary' : done ? 'bg-accent' : 'bg-secondary'}`} />
            );
          })}
        </div>

        <div className="glass-card p-6">
          <p className="text-xl leading-loose font-arabic text-foreground mb-6 text-center whitespace-pre-line">
            {selectedDhikr.text}
          </p>

          <button
            onClick={() => handleIncrement(selectedDhikr)}
            disabled={isComplete}
            className={`relative w-36 h-36 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${isComplete ? 'bg-accent/20 cursor-default' : 'bg-gradient-to-br from-primary to-primary/70 active:scale-95 cursor-pointer shadow-lg'}`}
          >
            <div className="text-center">
              <span className={`text-4xl font-bold ${isComplete ? 'text-accent' : 'text-primary-foreground'}`}>{currentCount}</span>
              <p className={`text-sm ${isComplete ? 'text-accent' : 'text-primary-foreground/80'}`}>/ {selectedDhikr.count}</p>
            </div>
          </button>

          {isComplete && (
            <div className="text-center p-3 bg-accent/20 rounded-xl border border-accent/30 mb-4 animate-fade-in">
              <p className="text-accent font-medium text-sm">
                {isLast ? '✓ تم إكمال جميع الأذكار - بارك الله فيك' : '✓ تم - جارٍ الانتقال للتالي...'}
              </p>
            </div>
          )}

          <div className="bg-secondary/50 rounded-xl p-3 mt-3">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">المصدر</span>
            </div>
            <p className="text-xs text-foreground">{selectedDhikr.source}</p>
            {selectedDhikr.hadithGrade && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-accent/20 rounded text-[10px] text-accent">{selectedDhikr.hadithGrade}</span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <Button variant="outline" onClick={() => resetDhikr(selectedDhikr.id)} className="flex-1" size="sm">
              <RotateCcw className="w-3 h-3 ml-1" /> إعادة
            </Button>
            {!isLast && (
              <Button onClick={() => setSelectedDhikrIndex(prev => prev + 1)} className="flex-1 bg-primary" size="sm">
                التالي <ChevronLeft className="w-3 h-3 mr-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Category View
  if (selectedCategory) {
    const categoryInfo = adhkarCategories.find(c => c.id === selectedCategory);
    const catProgress = getCategoryProgress(selectedCategory);

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{categoryInfo?.name}</h2>
            <p className="text-sm text-muted-foreground">{catProgress.completed} / {categoryAdhkar.length} مكتمل</p>
          </div>
          <Button size="sm" onClick={() => setSelectedDhikrIndex(0)} className="bg-primary">ابدأ الأذكار</Button>
        </div>

        <div className="h-2 rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${catProgress.percentage}%` }} />
        </div>

        <div className="space-y-2">
          {categoryAdhkar.map((dhikr, index) => {
            const progress = getDhikrProgress(dhikr.id);
            const isComplete = progress?.isCompleted || false;
            const currentCount = progress?.currentCount || 0;

            return (
              <button
                key={dhikr.id}
                onClick={() => setSelectedDhikrIndex(index)}
                className={`w-full text-right p-3 rounded-xl transition-all ${isComplete ? 'bg-accent/10 border border-accent/30' : 'bg-secondary/50 hover:bg-secondary border border-transparent'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground font-bold w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">{index + 1}</span>
                  <div className="flex-1">
                    <p className={`font-arabic leading-relaxed text-sm ${isComplete ? 'text-accent' : 'text-foreground'}`}>
                      {dhikr.text.length > 80 ? dhikr.text.substring(0, 80) + '...' : dhikr.text}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">التكرار: {dhikr.count} مرة • {dhikr.source}</p>
                  </div>
                  <div className="shrink-0">
                    {isComplete ? (
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-[10px] font-medium text-foreground">{currentCount}/{dhikr.count}</span>
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
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">الأذكار</h2>
        <p className="text-sm text-muted-foreground">أذكار من حصن المسلم - موثقة بالمصادر الشرعية</p>
      </div>

      <div className="grid gap-3">
        {adhkarCategories.map((category) => {
          const progress = getCategoryProgress(category.id as DhikrCategory);
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as DhikrCategory)}
              className="glass-card p-4 text-right hover:bg-secondary/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.count} ذكر</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-primary">{progress.completed}/{progress.total}</span>
                  {progress.completed === progress.total && progress.total > 0 && <Check className="w-3 h-3 text-accent mt-1" />}
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress.percentage}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Adhkar Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">أذكاري الخاصة</h3>
          <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 ml-1" /> إضافة ذكر
          </Button>
        </div>

        {showAddForm && (
          <div className="glass-card p-4 space-y-3 animate-fade-in">
            <textarea
              value={newDhikrText}
              onChange={(e) => setNewDhikrText(e.target.value)}
              placeholder="اكتب الذكر أو الدعاء..."
              className="w-full bg-secondary/50 rounded-lg p-3 text-foreground text-sm placeholder:text-muted-foreground/50 border-none outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-none"
              dir="rtl"
            />
            <div className="flex gap-2 items-center">
              <label className="text-xs text-muted-foreground">عدد التكرار:</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={newDhikrCount}
                onChange={(e) => setNewDhikrCount(Number(e.target.value))}
                className="w-20 bg-secondary/50 rounded-lg p-2 text-foreground text-sm text-center border-none outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addCustomDhikr} className="bg-primary flex-1">حفظ</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">إلغاء</Button>
            </div>
          </div>
        )}

        {customAdhkar.length === 0 && !showAddForm && (
          <p className="text-xs text-muted-foreground text-center py-4">لم تضف أي أذكار بعد. أضف أذكارك وأدعيتك الخاصة!</p>
        )}

        {customAdhkar.map((dhikr) => (
          <div key={dhikr.id} className="glass-card p-3 flex items-start gap-3">
            <div className="flex-1">
              <p className="font-arabic text-sm text-foreground leading-relaxed">{dhikr.text}</p>
              <p className="text-[10px] text-muted-foreground mt-1">التكرار: {dhikr.count} مرة</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteCustomDhikr(dhikr.id)} className="shrink-0 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
